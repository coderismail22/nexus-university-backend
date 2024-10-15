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
            $sum: "$enrolledCourseData",
          },
        },
      },
    ]);

    console.log(enrolledCourses);

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

const updateEnrolledCourseMarksIntoDB = async () => {};

export const EnrolledCourseServices = {
  createEnrolledCourseIntoDB,
  getMyEnrolledCoursesFromDB,
  updateEnrolledCourseMarksIntoDB,
};
