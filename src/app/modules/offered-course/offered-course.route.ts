import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { OfferedCourseValidations } from "./offered-course.validation";
import { OfferedCourseControllers } from "./offered-course.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";
const router = express.Router();

// Create an offered course
router.post(
  "/create-offered-course",
  validateRequest(OfferedCourseValidations.createOfferedCourseValidationSchema),
  OfferedCourseControllers.createOfferedCourse,
);

// Update an offered course
router.patch(
  "/:id",
  validateRequest(OfferedCourseValidations.updateOfferedCourseValidationSchema),
  OfferedCourseControllers.updateSingleOfferedCourse,
);

// Get all the offered courses
router.get(
  "/get-all-offered-courses",
  OfferedCourseControllers.getAllOfferedCourses,
);
// Get my  offered courses
router.get(
  "/get-my-offered-courses",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.student),
  OfferedCourseControllers.getMyOfferedCourseFromDB,
);

// Get a single offered course
router.get("/:id", OfferedCourseControllers.getSingleOfferedCourse);

// Delete a single offered course
router.delete("/:id", OfferedCourseControllers.deleteSingleOfferedCourse);

export const OfferedCourseRoutes = router;
