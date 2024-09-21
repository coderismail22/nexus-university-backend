import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { FacultyControllers } from "./faculty.controller";
import { updateFacultyValidationSchema } from "./faculty.validation";
import auth from "../../middlewares/auth";

const router = express.Router();

// Get All
router.get("/", auth(), FacultyControllers.getAllFaculties);

// Get one
router.get("/:id", FacultyControllers.getSingleFaculty);

// Update one
router.patch(
  "/:id",
  validateRequest(updateFacultyValidationSchema),
  FacultyControllers.updateFaculty,
);

// Delete one
router.delete("/:id", FacultyControllers.deleteFaculty);

export const FacultyRoutes = router;
