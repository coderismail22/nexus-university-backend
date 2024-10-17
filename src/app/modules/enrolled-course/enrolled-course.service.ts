/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import mongoose from "mongoose";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { Course } from "../Course/course.model";
import { Faculty } from "../Faculty/faculty.model";
import { OfferedCourse } from "../offered-course/offered-course.model";
import { Student } from "../student/student.model";
import EnrolledCourse from "./enrolled-course.model";
import { SemesterRegistration } from "../semester-registration/semester-registration.model";
import { TEnrolledCourse } from "./enrolled-course.interface";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../user/user.model";
import { StringValidation } from "zod";
import { calculateGradeAndPoints } from "./enrolled-course.util";

const createEnrolledCourseIntoDB = async (
  user: JwtPayload,
  payload: TEnrolledCourse,
) => {
  const session = await mongoose.startSession();
  session.startTransaction(); // Begin transaction

  try {
    const { offeredCourse } = payload;

    // Step 1: Does the course exist
    const doesOfferedCourseExist =
      await OfferedCourse.findById(offeredCourse).session(session);
    if (!doesOfferedCourseExist) {
      throw new AppError(httpStatus.NOT_FOUND, "OfferedCourse not found");
    }

    // Step 2: Check max capacity
    if (doesOfferedCourseExist.maxCapacity <= 0) {
      throw new AppError(httpStatus.BAD_REQUEST, "No seats left.");
    }

    // course
    const course = await Course.findById(doesOfferedCourseExist.course).session(
      session,
    );
    const currentCredit = course?.credits;

    // Step 3: Find the student
    const student = await User.findOne({ id: user.userId }, { _id: 1 }).session(
      session,
    );
    if (!student) {
      throw new AppError(httpStatus.NOT_FOUND, "Student not found");
    }

    // Step 4: Has the student already enrolled in the course
    const hasStudentEnrolledAlready = await OfferedCourse.findOne({
      semesterRegistration: doesOfferedCourseExist.semesterRegistration,
      offeredCourse,
      student: student.id,
    }).session(session);
    if (hasStudentEnrolledAlready) {
      throw new AppError(httpStatus.CONFLICT, "Student has already enrolled.");
    }

    // validate max credit exceeds or not
    const semesterRegistration = await SemesterRegistration.findById(
      doesOfferedCourseExist.semesterRegistration,
    ).select("maxCredit");

    const maxCredit = semesterRegistration?.maxCredit;
    //total enrolled credits + new enrolled course credit >maxCredit
    // aggregation for getting the sum of enrolled courses
    const enrolledCourses = await EnrolledCourse.aggregate([
      {
        $match: {
          semesterRegistration: doesOfferedCourseExist.semesterRegistration,
          student: student?._id,
        },
      },
      {
        $lookup: {
          from: "courses",
          localField: "course",
          foreignField: "_id",
          as: "enrolledCourseData",
        },
      },
      {
        $unwind: "$enrolledCourseData",
      },
      {
        $group: {
          _id: null,
          totalEnrolledCredits: {
            $sum: "$enrolledCourseData.credits",
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalEnrolledCredits: 1,
        },
      },
    ]);

    console.log(enrolledCourses);
    const totalCredits =
      enrolledCourses.length > 0 ? enrolledCourses[0]?.totalEnrolledCredits : 0;

    if (totalCredits && maxCredit && totalCredits + currentCredit > maxCredit) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "You have exceeded maximum number of credits.",
      );
    }

    // // Step 5: Create an enrolled course
    // const result = await EnrolledCourse.create(
    //   [
    //     {
    //       semesterRegistration: doesOfferedCourseExist.semesterRegistration,
    //       academicSemester: doesOfferedCourseExist.semesterRegistration,
    //       academicFaculty: doesOfferedCourseExist.academicFaculty,
    //       academicDepartment: doesOfferedCourseExist.academicDepartment,
    //       offeredCourse: offeredCourse,
    //       course: doesOfferedCourseExist.course,
    //       student: student._id,
    //       faculty: doesOfferedCourseExist.faculty,
    //       isEnrolled: true,
    //     },
    //   ],
    //   { session },
    // );

    // if (!result) {
    //   throw new AppError(httpStatus.BAD_REQUEST, "Failed to enroll.");
    // }

    // // Step 6: Update max capacity of the offered course
    // const maxCapacity = doesOfferedCourseExist.maxCapacity;
    // await OfferedCourse.findByIdAndUpdate(
    //   offeredCourse,
    //   { maxCapacity: maxCapacity - 1 },
    //   { session },
    // );

    // // Commit the transaction
    // await session.commitTransaction();
    // session.endSession();

    return null;
  } catch (error) {
    // Rollback the transaction on error
    await session.abortTransaction();
    session.endSession();

    throw error; // Propagate the error
  }
};

const getMyEnrolledCoursesFromDB = async () => {};

const updateEnrolledCourseMarksIntoDB = async (
  facultyId: string,
  payload: Partial<TEnrolledCourse>,
) => {
  const { semesterRegistration, offeredCourse, student, courseMarks } = payload;
  const doesSemesterRegistrationExist =
    await SemesterRegistration.findById(semesterRegistration);
  if (!doesSemesterRegistrationExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Semester registration not found.",
    );
  }

  const doesOfferedCourseExist = await OfferedCourse.findById(offeredCourse);
  if (!doesOfferedCourseExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Offered course not found.");
  }

  console.log("student", student);
  const doesStudentExist = await Student.findById(student);
  if (!doesStudentExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Student not found.");
  }

  // Find the faculty id (mongodb _id)
  const faculty = await Faculty.findOne({ id: facultyId }, { _id: 1 });

  if (!faculty) {
    throw new AppError(httpStatus.NOT_FOUND, "Faculty not found.");
  }
  const doesCourseBelongToFaculty = await EnrolledCourse.findOne({
    semesterRegistration,
    offeredCourse,
    student,
    faculty: faculty._id,
  });

  if (!doesCourseBelongToFaculty) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "The course does not belong to the faculty.",
    );
  }
  console.log(doesCourseBelongToFaculty);

  const modifiedData: Record<string, unknown> = {};

  if (courseMarks?.finalTerm) {
    const { classTest1, classTest2, midTerm, finalTerm } =
      doesCourseBelongToFaculty.courseMarks;

    const totalMarks =
      Math.ceil(classTest1 * 0.1) +
      Math.ceil(midTerm * 0.3) +
      Math.ceil(classTest2 * 0.1) +
      Math.ceil(finalTerm * 0.5);

    const result = calculateGradeAndPoints(totalMarks);

    modifiedData.grade = result.grade;
    modifiedData.gradePoints = result.gradePoints;
    modifiedData.isCompleted = true;
  }

  if (courseMarks && Object.keys(courseMarks).length) {
    for (const [key, value] of Object.entries(courseMarks)) {
      modifiedData[`courseMarks.${key}`] = value;
    }
  }

  const result = await EnrolledCourse.findByIdAndUpdate(
    doesCourseBelongToFaculty._id,
    modifiedData,
    {
      new: true,
    },
  );

  return result;
};

export const EnrolledCourseServices = {
  createEnrolledCourseIntoDB,
  getMyEnrolledCoursesFromDB,
  updateEnrolledCourseMarksIntoDB,
};
