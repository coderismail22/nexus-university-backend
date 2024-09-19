import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { TOfferedCourse } from "./offered-course.interface";
import { OfferedCourse } from "./offered-course.model";
import { AcademicDepartment } from "../academicDepartment/academicDepartment.model";
import { AcademicSemester } from "../academicSemester/academicSemester.model";
import { AcademicFaculty } from "../academicFaculty/academicFaculty.model";
import { Course, CourseFaculty } from "../Course/course.model";
import { SemesterRegistration } from "../semester-registration/semester-registration.model";

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
  const doesAcademicDepartmentExist =
    await AcademicDepartment.findById(academicDepartment);
  if (!doesAcademicDepartmentExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Academic department not found");
  }
  // 2.check semester
  const doesAcademicSemesterExist =
    await AcademicSemester.findById(academicSemester);
  if (!doesAcademicSemesterExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Academic semester not found");
  }
  // 3.check academic faculty
  const doesAcademicFacultyExist =
    await AcademicFaculty.findById(academicFaculty);
  if (!doesAcademicFacultyExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Academic faculty not found");
  }
  // 4.check course
  const doesCourseExist = await Course.findById(course);
  if (!doesCourseExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Course not found");
  }
  // 5.check registration
  const doesSemesterRegistrationExist =
    await SemesterRegistration.findById(semesterRegistration);
  if (!doesSemesterRegistrationExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Semester registration not found");
  }
  // 6.check faculty
  const doesFacultyExists = await CourseFaculty.findById(faculty);
  if (!doesFacultyExists) {
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
