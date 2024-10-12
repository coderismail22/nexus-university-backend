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

const createEnrolledCourseIntoDB = async (
  user: JwtPayload,
  payload: TEnrolledCourse,
) => {
  // Steps for validations:
  /**
   * 1. does the course exist
   * 2. has the student already enrolled
   * 3. create an enrolled course
   */

  const { offeredCourse } = payload;
  // Does the course exist
  const doesOfferedCourseExist = await OfferedCourse.findById(offeredCourse);
  if (!doesOfferedCourseExist) {
    throw new AppError(httpStatus.NOT_FOUND, "OfferedCourse not found");
  }

  // Check max capacity
  if (doesOfferedCourseExist?.maxCapacity <= 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "No seats left.");
  }

  // Find student
  const student = await Student.findOne({ id: user?.id }).select("id");
  if (!student) {
    throw new AppError(httpStatus.NOT_FOUND, "Student not found");
  }

  // Has the student already enrolled in the course
  const hasStudentEnrolledAlready = await OfferedCourse.findOne({
    semesterRegistration: doesOfferedCourseExist?.semesterRegistration,
    offeredCourse,
    student: student.id,
  });
  if (hasStudentEnrolledAlready) {
    throw new AppError(httpStatus.CONFLICT, "Student has already enrolled.");
  }
};

const getMyEnrolledCoursesFromDB = async () => {};

const updateEnrolledCourseMarksIntoDB = async () => {};

export const EnrolledCourseServices = {
  createEnrolledCourseIntoDB,
  getMyEnrolledCoursesFromDB,
  updateEnrolledCourseMarksIntoDB,
};
