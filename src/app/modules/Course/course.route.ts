import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { CourseValidations } from "./course.validation";
import { CourseServices } from "./course.service";
const router = express.Router();

router.post(
  "/create-academic-course",
  validateRequest(CourseValidations.createCourseValidationSchema),
  CourseServices.createCourseIntoDB,
);

router.get("/get-all-academic-courses", CourseServices.getAllCoursesFromDB);
router.get("/:courseId", CourseServices.getSingleCourseFromDB);
router.patch("/:courseId", CourseServices.deleteCourseFromDB);

export const AcademicCourseRoutes = router;
