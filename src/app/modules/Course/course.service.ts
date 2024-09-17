import { TCourse } from "./course.interface";
import { Course } from "./course.model";

const createCourseIntoDB = (course: TCourse) => {
  const result = Course.create(course);
  return result;
};

const getAllCoursesFromDB = () => {
  const result = Course.find();
  return result;
};

const getSingleCourseFromDB = (id: string) => {
  const result = Course.findById(id);
  return result;
};

const deleteCourseFromDB = (id: string) => {
  const result = Course.findByIdAndUpdate(
    id,
    {
      isDeleted: true,
    },
    {
      new: true,
    },
  );
  return result;
};

//TODO: Update Service To Be Added

export const CourseServices = {
  createCourseIntoDB,
  getAllCoursesFromDB,
  getSingleCourseFromDB,
  deleteCourseFromDB,
  //updateCourseIntoDB
};
