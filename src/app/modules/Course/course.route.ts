import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { CourseValidations } from "./course.validation";
import { CourseControllers } from "./course.controller";
import { CourseFaculty } from "./course.model";
const router = express.Router();

// Create a course
router.post(
  "/create-academic-course",
  validateRequest(CourseValidations.createCourseValidationSchema),
  CourseControllers.createCourse,
);

// Update a course
router.patch(
  "/:id",
  validateRequest(CourseValidations.updateCourseValidationSchema),
  CourseControllers.updateCourse,
);

// Assign Faculties With Course
router.put(
  "/:courseId/assign-faculties",
  validateRequest(CourseValidations.facultiesWithCourseValidationSchema),
  CourseControllers.assignFacultiesWithCourseIntoDB,
);

// Discharge Faculties From Course
router.delete(
  "/:courseId/remove-faculties",
  validateRequest(CourseValidations.facultiesWithCourseValidationSchema),
  CourseControllers.removeFacultiesFromCourseFromDB,
);

//Get all courses
router.get("/get-all-academic-courses", CourseControllers.getAllCourses);

// Single a single course
router.get("/:id", CourseControllers.getSingleCourse);

// Delete a single course
router.delete("/:id", CourseControllers.deleteCourse);

export const AcademicCourseRoutes = router;
