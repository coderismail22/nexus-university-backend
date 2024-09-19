import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { TOfferedCourse } from "./offered-course.interface";
import { OfferedCourse } from "./offered-course.model";
import { AcademicDepartment } from "../academicDepartment/academicDepartment.model";
import { AcademicSemester } from "../academicSemester/academicSemester.model";
import { AcademicFaculty } from "../academicFaculty/academicFaculty.model";
import { Course, CourseFaculty } from "../Course/course.model";
import { SemesterRegistration } from "../semester-registration/semester-registration.model";
import { Faculty } from "../Faculty/faculty.model";

// Create an offered course
const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
  const {
    academicDepartment,
    academicFaculty,
    course,
    semesterRegistration,
    faculty,
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
      httpStatus.NOT_FOUND,
      `This ${doesAcademicDepartmentExist.name} does not belong to ${doesAcademicFacultyExist.name}`,
    );
  }
  const result = await OfferedCourse.create({ ...payload, academicSemester });
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
