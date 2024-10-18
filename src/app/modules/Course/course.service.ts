import QueryBuilder from "../../builder/QueryBuilder";
import { courseSearchableFields } from "./course.contant";
import { TCourse, TCourseFaculty } from "./course.interface";
import { Course, CourseFaculty } from "./course.model";

// Create a course
const createCourseIntoDB = async (course: TCourse) => {
  const result = Course.create(course);
  return result;
};

// TODO: Incomplete
// Update a course
const updateCourseIntoDB = async (id: string, payload: Partial<TCourse>) => {
  const session = await Course.startSession(); // Start a session for the transaction
  session.startTransaction(); // Start a new transaction

  try {
    const { preRequisiteCourses, ...remainingCourseData } = payload;
    console.log("id", id);
    console.log("prereq", remainingCourseData);

    // Step-01: Update Basic Information
    const updatedBasicCourseInfo = await Course.findByIdAndUpdate(
      id,
      remainingCourseData,
      {
        new: true,
        runValidators: true,
        session, // Ensure this update is part of the transaction
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

      // Remove specific courses from the prerequisiteCourses array
      await Course.findByIdAndUpdate(
        id,
        {
          $pull: {
            preRequisiteCourses: {
              course: { $in: prerequisiteCoursesToDelete },
            },
          },
        },
        { session }, // Include in the transaction
      );
    }

    // Step-03: Add new prerequisite courses
    const prerequisiteCoursesToAdd = preRequisiteCourses?.filter(
      (eachCourse) => eachCourse.course && !eachCourse.isDeleted,
    );

    if (prerequisiteCoursesToAdd && prerequisiteCoursesToAdd.length > 0) {
      await Course.findByIdAndUpdate(
        id,
        {
          $addToSet: {
            preRequisiteCourses: { $each: prerequisiteCoursesToAdd },
          },
        },
        { session }, // Include in the transaction
      );
    }

    // Step-04: Commit the transaction if everything goes well
    await session.commitTransaction();

    // Populate the result
    const result = await Course.findById(id).populate(
      "preRequisiteCourses.course",
    );

    return result;
  } catch (error) {
    // If anything fails, abort the transaction
    await session.abortTransaction();
    console.error("Transaction aborted due to error:", error);
    throw error; // Re-throw the error after aborting
  } finally {
    // End the session whether the transaction succeeded or failed
    session.endSession();
  }
};

// Assign faculties with courses
// TODO: Understand $each deeply
const assignFacultiesWithCourseIntoDB = async (
  id: string,
  payload: Partial<TCourseFaculty>,
) => {
  const result = await CourseFaculty.findByIdAndUpdate(
    id,
    {
      course: id,
      $addToSet: { faculties: { $each: payload } },
    },
    {
      upsert: true,
      new: true,
    },
  );
  return result;
};

// Get course  with faculties
const getCourseWithFacultyFromDB = async (courseId: string) => {
  const result = CourseFaculty.findOne({ course: courseId }).populate(
    "faculties",
  );
  return result;
};

// Remove faculties from courses
// TODO: Understand  $in
const removeFacultiesFromCourseFromDB = async (
  id: string,
  payload: Partial<TCourseFaculty>,
) => {
  const result = await CourseFaculty.findByIdAndUpdate(
    id,
    {
      course: id,
      $pull: { faculties: { $in: payload } },
    },
    {
      new: true,
    },
  );
  return result;
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
  assignFacultiesWithCourseIntoDB,
  getCourseWithFacultyFromDB,
  removeFacultiesFromCourseFromDB,
  getAllCoursesFromDB,
  getSingleCourseFromDB,
  deleteCourseFromDB,
  updateCourseIntoDB,
};
