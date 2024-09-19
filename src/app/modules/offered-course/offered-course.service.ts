import { TOfferedCourse } from "./offered-course.interface";
import { OfferedCourse } from "./offered-course.model";

// Create an offered course
const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
  
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
