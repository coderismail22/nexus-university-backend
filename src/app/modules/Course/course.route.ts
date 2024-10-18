import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { CourseValidations } from "./course.validation";
import { CourseControllers } from "./course.controller";
import { CourseFaculty } from "./course.model";
import { USER_ROLE } from "../user/user.constant";
import auth from "../../middlewares/auth";
const router = express.Router();

// Create a course
router.post(
  "/create-academic-course",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(CourseValidations.createCourseValidationSchema),
  CourseControllers.createCourse,
);

// Update a course
router.patch(
  "/:id",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(CourseValidations.updateCourseValidationSchema),
  CourseControllers.updateCourse,
);

// Assign Faculties With Course
router.put(
  "/:courseId/assign-faculties",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(CourseValidations.facultiesWithCourseValidationSchema),
  CourseControllers.assignFacultiesWithCourseIntoDB,
);

// Get Faculties With Course
router.get(
  "/:courseId/get-faculties",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  CourseControllers.getFacultiesWithCourseFromDB,
);

// Discharge Faculties From Course
router.delete(
  "/:courseId/remove-faculties",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),

  validateRequest(CourseValidations.facultiesWithCourseValidationSchema),
  CourseControllers.removeFacultiesFromCourseFromDB,
);

//Get all courses
router.get(
  "/get-all-academic-courses",
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.faculty,
    USER_ROLE.student,
  ),
  CourseControllers.getAllCourses,
);

// Single a single course
router.get(
  "/:id",
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.faculty,
    USER_ROLE.student,
  ),
  CourseControllers.getSingleCourse,
);

// Delete a single course
router.delete(
  "/:id",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  CourseControllers.deleteCourse,
);

export const AcademicCourseRoutes = router;
