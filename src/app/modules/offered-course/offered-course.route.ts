import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { OfferedCourseValidations } from "./offered-course.validation";
import { OfferedCourseControllers } from "./offered-course.controller";
const router = express.Router();

// Create an offered course
router.post(
  "/create-offered-course",
  validateRequest(OfferedCourseValidations.createOfferedCourseValidationSchema),
  OfferedCourseControllers.createOfferedCourse,
);

// Get all the offered courses
router.get(
  "/get-all-offered-courses",
  OfferedCourseControllers.getAllOfferedCourses,
);

// Get a single offered course
router.get("/:id", OfferedCourseControllers.getSingleOfferedCourse);

// Update an offered course
router.patch(
  "/:id",
  validateRequest(OfferedCourseValidations.updateOfferedCourseValidationSchema),
  OfferedCourseControllers.updateSingleOfferedCourse,
);

export const OfferedCourseRoutes = router;
