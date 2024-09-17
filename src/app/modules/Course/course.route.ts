import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { CourseValidations } from "./course.validation";
import { CourseControllers } from "./course.controller";
const router = express.Router();

router.post(
  "/create-academic-course",
  validateRequest(CourseValidations.createCourseValidationSchema),
  CourseControllers.createCourse,
);

router.get("/get-all-academic-courses", CourseControllers.getAllCourses);
router.get("/:id", CourseControllers.getSingleCourse);
router.patch("/:id", CourseControllers.deleteCourse);

export const AcademicCourseRoutes = router;
