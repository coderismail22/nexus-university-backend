import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { TOfferedCourse } from "./offered-course.interface";
import { OfferedCourse } from "./offered-course.model";

// Create an offered course
const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
  const {
    academicDepartment,
    academicSemester,
    academicFaculty,
    course,
    semesterRegistration,
    faculty,
  } = payload;

  // 1.check department
  if (!academicDepartment) {
    throw new AppError(httpStatus.NOT_FOUND, "Academic department not found");
  }
  // 2.check semester
  if (!academicSemester) {
    throw new AppError(httpStatus.NOT_FOUND, "Academic semester not found");
  }
  // 3.check academic faculty
  if (!academicFaculty) {
    throw new AppError(httpStatus.NOT_FOUND, "Academic faculty not found");
  }
  // 4.check course
  if (!course) {
    throw new AppError(httpStatus.NOT_FOUND, "Course not found");
  }
  // 5.check registration
  if (!semesterRegistration) {
    throw new AppError(httpStatus.NOT_FOUND, "Semester registration not found");
  }
  // 6.check faculty
  if (!faculty) {
    throw new AppError(httpStatus.NOT_FOUND, "Faculty not found");
  }
  const result = await OfferedCourse.create(payload);
  return result;
};
// Get all offered courses
const getAllOfferedCoursesFromDB = async () => {};
// Get a single offered course
const getSingleOfferedCourseFromDB = async () => {};
// Update a single offered course
const updateOfferedCourseIntoDB = async () => {};

export const OfferedCourseServices = {
  createOfferedCourseIntoDB,
  getAllOfferedCoursesFromDB,
  getSingleOfferedCourseFromDB,
  updateOfferedCourseIntoDB,
};
