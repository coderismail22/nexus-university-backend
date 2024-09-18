import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { CourseValidations } from "./course.validation";
import { CourseControllers } from "./course.controller";
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

//Get all courses
router.get("/get-all-academic-courses", CourseControllers.getAllCourses);

// Single a single course
router.get("/:id", CourseControllers.getSingleCourse);

// Delete a single course
router.delete("/:id", CourseControllers.deleteCourse);

export const AcademicCourseRoutes = router;
