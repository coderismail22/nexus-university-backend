import QueryBuilder from "../../builder/QueryBuilder";
import { courseSearchableFields } from "./course.contant";
import { TCourse } from "./course.interface";
import { Course } from "./course.model";

// Create a course
const createCourseIntoDB = async (course: TCourse) => {
  const result = Course.create(course);
  return result;
};

// TODO: Incomplete
// Update a course
const updateCourseIntoDB = async (id: string, payload: Partial<TCourse>) => {
  const { preRequisiteCourses, ...remainingCourseData } = payload;
  console.log('id',id)
  console.log("prereq", remainingCourseData);
  //Step-01: Update Basic Information

  const updatedBasicCourseInfo = await Course.findByIdAndUpdate(
    id,
    remainingCourseData,
    {
      new: true,
      runValidators: true,
    },
  );
  return updatedBasicCourseInfo;
};

// Get all courses
const getAllCoursesFromDB = async (query: Record<string, unknown>) => {
  const courseQuery = new QueryBuilder(
    Course.find().populate("preRequisiteCourses.course"),
    query,
  )
    .search(courseSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await courseQuery.modelQuery;
  return result;
};

// Get a single course
const getSingleCourseFromDB = async (id: string) => {
  const result = Course.findById(id).populate("preRequisiteCourses.course");
  return result;
};

// Delete a single course
const deleteCourseFromDB = async (id: string) => {
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

export const CourseServices = {
  createCourseIntoDB,
  getAllCoursesFromDB,
  getSingleCourseFromDB,
  deleteCourseFromDB,
  updateCourseIntoDB,
};
