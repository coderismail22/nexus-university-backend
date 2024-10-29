import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { TOfferedCourse } from "./offered-course.interface";
import { OfferedCourse } from "./offered-course.model";
import { AcademicDepartment } from "../academicDepartment/academicDepartment.model";
import { AcademicFaculty } from "../academicFaculty/academicFaculty.model";
import { Course } from "../Course/course.model";
import { SemesterRegistration } from "../semester-registration/semester-registration.model";
import { Faculty } from "../Faculty/faculty.model";
import { hasTimeConflict } from "./offered-course.util";
import { Student } from "../student/student.model";

// Create an offered course
const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
  const {
    academicDepartment,
    academicFaculty,
    course,
    semesterRegistration,
    faculty,
    section,
    days,
    startTime,
    endTime,
  } = payload;
  // check registration
  const doesSemesterRegistrationExist =
    await SemesterRegistration.findById(semesterRegistration);
  if (!doesSemesterRegistrationExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Semester registration not found");
  }

  // get from semester registration semester
  const academicSemester = doesSemesterRegistrationExist.academicSemester;

  // 1.check department
  const doesAcademicDepartmentExist =
    await AcademicDepartment.findById(academicDepartment);
  if (!doesAcademicDepartmentExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Academic department not found");
  }

  // const academicSemester = doesAcademicSemesterExist.academicSemester;
  // 2.check academic faculty
  const doesAcademicFacultyExist =
    await AcademicFaculty.findById(academicFaculty);
  if (!doesAcademicFacultyExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Academic faculty not found");
  }
  // 3.check course
  const doesCourseExist = await Course.findById(course);
  if (!doesCourseExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Course not found");
  }

  // 4.check faculty
  const doesFacultyExists = await Faculty.findById(faculty);
  if (!doesFacultyExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Faculty not found");
  }

  // check : does academic department belong to faculty
  const doesDepartmentBelongToFaculty = await AcademicDepartment.findOne({
    academicFaculty,
    _id: academicDepartment,
  });

  console.log(doesDepartmentBelongToFaculty);
  if (!doesDepartmentBelongToFaculty) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `This ${doesAcademicDepartmentExist.name} does not belong to ${doesAcademicFacultyExist.name}`,
    );
  }

  // check: existingOfferedCourseInSameSemesterAndSection
  const existingOfferedCourseInSameSemesterAndSection =
    await OfferedCourse.findOne({
      semesterRegistration,
      course,
      section,
    });
  if (existingOfferedCourseInSameSemesterAndSection) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Offered course already exists in the same semester section!`,
    );
  }

  // check time conflict

  //1. get the current schedules of the faculties
  const currentAssignedSchedules = await OfferedCourse.find({
    semesterRegistration,
    faculty,
    days: { $in: days }, // days coming from new request
  }).select("days startTime endTime");

  console.log(currentAssignedSchedules);

  // 2. get the newly requested schedules
  const newSchedule = {
    days,
    startTime,
    endTime,
  };

  if (hasTimeConflict(currentAssignedSchedules, newSchedule)) {
    throw new AppError(
      httpStatus.CONFLICT,
      "This faculty is not available at the specified time! Please choose other time or day.",
    );
  }
  const result = await OfferedCourse.create({ ...payload, academicSemester });
  return result;
};

// Update a single offered course
const updateOfferedCourseIntoDB = async (
  id: string,
  payload: Pick<TOfferedCourse, "faculty" | "startTime" | "endTime" | "days">,
) => {
  const { faculty, days, startTime, endTime } = payload;

  // does offered course exist
  const doesOfferedCourseExist = await OfferedCourse.findById(id);

  if (!doesOfferedCourseExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Offered course not found!");
  }
  // does faculty exist
  const doesFacultyExist = await Faculty.findById(faculty);

  if (!doesFacultyExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Faculty not found!");
  }

  // check time conflict

  const semesterRegistration = doesOfferedCourseExist?.semesterRegistration;

  const semesterRegistrationStatus =
    await SemesterRegistration.findById(semesterRegistration);

  if (semesterRegistrationStatus?.status !== "UPCOMING") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You cannot update the offered course as it is ${semesterRegistrationStatus?.status}`,
    );
  }

  //1. get the current schedules of the faculties
  const currentAssignedSchedules = await OfferedCourse.find({
    semesterRegistration,
    faculty,
    days: { $in: days }, // days coming from new request
  }).select("days startTime endTime");

  console.log(currentAssignedSchedules);

  // 2. get the newly requested schedules
  const newSchedule = {
    days,
    startTime,
    endTime,
  };

  if (hasTimeConflict(currentAssignedSchedules, newSchedule)) {
    throw new AppError(
      httpStatus.CONFLICT,
      "This faculty is not available at the specified time! Please choose other time or day.",
    );
  }

  const result = await OfferedCourse.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

// Get all offered courses
const getAllOfferedCoursesFromDB = async () => {
  const result = await OfferedCourse.find();
  return result;
};

// Get a single offered course
const getSingleOfferedCourseFromDB = async (id: string) => {
  const result = await OfferedCourse.findById(id);
  return result;
};

// Delete a single offered course
const deleteSingleOfferedCourseFromDB = async (id: string) => {
  // check if the offered course does exist
  const doesOfferedCourseExist = await OfferedCourse.findById(id);
  if (!doesOfferedCourseExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "The offered course does not exist !",
    );
  }

  // check the semester registration
  const semesterRegistrationId = doesOfferedCourseExist?.semesterRegistration;
  const semesterRegistration = await SemesterRegistration.findById(
    semesterRegistrationId,
  ).select("-_id status");

  if (semesterRegistration?.status !== "UPCOMING") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `The offered course cannot be deleted since the status is ${semesterRegistration?.status}`,
    );
  }
  // const result = await OfferedCourse.findByIdAndDelete(id);
  // return result;
};

const getMyOfferedCoursesFromDB = async (
  userId: string,
  query: Record<string, unknown>,
) => {
  //pagination setup

  const page = Number(query?.page) || 1;
  const limit = Number(query?.limit) || 10;
  const skip = (page - 1) * limit;

  const student = await Student.findOne({ id: userId });
  // find the student
  if (!student) {
    throw new AppError(httpStatus.NOT_FOUND, "User is not found");
  }

  //find current ongoing semester
  const currentOngoingRegistrationSemester = await SemesterRegistration.findOne(
    {
      status: "ONGOING",
    },
  );

  if (!currentOngoingRegistrationSemester) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "There is no ongoing semester registration!",
    );
  }

  const aggregationQuery = [
    {
      $match: {
        semesterRegistration: currentOngoingRegistrationSemester?._id,
        academicFaculty: student.academicFaculty,
        academicDepartment: student.academicDepartment,
      },
    },
    {
      $lookup: {
        from: "courses",
        localField: "course",
        foreignField: "_id",
        as: "course",
      },
    },
    {
      $unwind: "$course",
    },
    {
      $lookup: {
        from: "enrolledcourses",
        let: {
          currentOngoingRegistrationSemester:
            currentOngoingRegistrationSemester._id,
          currentStudent: student._id,
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: [
                      "$semesterRegistration",
                      "$$currentOngoingRegistrationSemester",
                    ],
                  },
                  {
                    $eq: ["$student", "$$currentStudent"],
                  },
                  {
                    $eq: ["$isEnrolled", true],
                  },
                ],
              },
            },
          },
        ],
        as: "enrolledCourses",
      },
    },
    {
      $lookup: {
        from: "enrolledcourses",
        let: {
          currentStudent: student._id,
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: ["$student", "$$currentStudent"],
                  },
                  {
                    $eq: ["$isCompleted", true],
                  },
                ],
              },
            },
          },
        ],
        as: "completedCourses",
      },
    },
    {
      $addFields: {
        completedCourseIds: {
          $map: {
            input: "$completedCourses",
            as: "completed",
            in: "$$completed.course",
          },
        },
      },
    },
    {
      $addFields: {
        isPreRequisitesFulFilled: {
          $or: [
            { $eq: ["$course.preRequisiteCourses", []] },
            {
              $setIsSubset: [
                "$course.preRequisiteCourses.course",
                "$completedCourseIds",
              ],
            },
          ],
        },

        isAlreadyEnrolled: {
          $in: [
            "$course._id",
            {
              $map: {
                input: "$enrolledCourses",
                as: "enroll",
                in: "$$enroll.course",
              },
            },
          ],
        },
      },
    },
    {
      $match: {
        isAlreadyEnrolled: false,
        isPreRequisitesFulFilled: true,
      },
    },
  ];

  const paginationQuery = [
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
  ];

  const result = await OfferedCourse.aggregate([
    ...aggregationQuery,
    ...paginationQuery,
  ]);

  const total = (await OfferedCourse.aggregate(aggregationQuery)).length;

  const totalPage = Math.ceil(result.length / limit);

  return {
    meta: {
      page,
      limit,
      total,
      totalPage,
    },
    result,
  };
};

export const OfferedCourseServices = {
  createOfferedCourseIntoDB,
  getAllOfferedCoursesFromDB,
  getSingleOfferedCourseFromDB,
  updateOfferedCourseIntoDB,
  deleteSingleOfferedCourseFromDB,
  getMyOfferedCoursesFromDB,
};
