import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { SemesterRegistrationControllers } from "./semester-registration.controller";
import { SemesterRegistrationValidations } from "./semester-registration.validation";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";

const router = express.Router();

// Register
router.post(
  "/create-academic-registration",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(
    SemesterRegistrationValidations.createSemesterRegistrationValidationSchema,
  ),
  SemesterRegistrationControllers.createSemesterRegistration,
);

// Get All Registrations
router.get(
  "/get-all-semester-registrations",
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.faculty,
    USER_ROLE.student,
  ),
  SemesterRegistrationControllers.getAllSemesterRegistrations,
);

// Get A Single Registration
router.get(
  "/:id",
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.faculty,
    USER_ROLE.student,
  ),
  SemesterRegistrationControllers.getSingleSemesterRegistration,
);

// Update A Single Registration
router.patch(
  "/:id",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(
    SemesterRegistrationValidations.updateSemesterRegistrationValidationSchema,
  ),
  SemesterRegistrationControllers.updateSingleSemesterRegistration,
);

// Delete A Single Registration
router.delete(
  "/:id",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  SemesterRegistrationControllers.deleteSemesterRegistrationAndAllAssociatedOfferedCourses,
);

export const AcademicSemesterRegistrationRoutes = router;
