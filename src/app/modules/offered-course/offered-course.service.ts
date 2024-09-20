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
import { hasTimeConflict } from "./offered-course.util";

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
const getSingleOfferedCourseFromDB = async () => {};

// Delete a single offered course
const deleteSingleOfferedCourseFromDB = async () => {};

export const OfferedCourseServices = {
  createOfferedCourseIntoDB,
  getAllOfferedCoursesFromDB,
  getSingleOfferedCourseFromDB,
  updateOfferedCourseIntoDB,
  deleteSingleOfferedCourseFromDB,
};
