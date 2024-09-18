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
  console.log("id", id);
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

  // Step-02: Check if there are any prerequisiteCourses
  if (preRequisiteCourses && preRequisiteCourses.length > 0) {
    // Filter out the deleted prerequisite courses and get an array of Id strings
    const prerequisiteCoursesToDelete = preRequisiteCourses
      .filter(
        (eachPreReqCourse) =>
          eachPreReqCourse.course && eachPreReqCourse.isDeleted,
      )
      .map((eachCourse) => eachCourse.course);
    console.log(prerequisiteCoursesToDelete);

    // Remove specific fields from the prerequisiteCourses array
    [{ course: "66ea1f6b7c6a880120aa14fb", isDeleted: true }];
    ["66ea1f6b7c6a880120aa14fb"];
    const deletedPrerequisiteCourse = await Course.findByIdAndUpdate(id, {
      $pull: {
        preRequisiteCourses: { course: { $in: prerequisiteCoursesToDelete } },
      },
    });
  }
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
