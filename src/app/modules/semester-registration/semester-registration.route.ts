import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { SemesterRegistrationControllers } from "./semester-registration.controller";
import { SemesterRegistrationValidations } from "./semester-registration.validation";

const router = express.Router();

// Register
router.post(
  "/create-academic-registration",
  validateRequest(
    SemesterRegistrationValidations.createSemesterRegistrationValidationSchema,
  ),
  SemesterRegistrationControllers.createSemesterRegistration,
);

// Get All Registrations
router.get(
  "/get-all-semester-registrations",
  SemesterRegistrationControllers.getAllSemesterRegistrations,
);

// Get A Single Registration
router.get(
  "/:id",
  SemesterRegistrationControllers.getSingleSemesterRegistration,
);

// Update A Single Registration
router.patch(
  "/:id",
  validateRequest(
    SemesterRegistrationValidations.updateSemesterRegistrationValidationSchema,
  ),
  SemesterRegistrationControllers.updateSingleSemesterRegistration,
);

export const AcademicSemesterRegistrationRoutes = router;
