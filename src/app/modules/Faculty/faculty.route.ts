import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { FacultyControllers } from "./faculty.controller";
import { updateFacultyValidationSchema } from "./faculty.validation";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.contant";

const router = express.Router();

// Get All
router.get("/", auth(USER_ROLE.admin), FacultyControllers.getAllFaculties);

// Get one
router.get("/:id", auth(USER_ROLE.admin), FacultyControllers.getSingleFaculty);

// Update one
router.patch(
  "/:id",
  auth(USER_ROLE.admin),
  validateRequest(updateFacultyValidationSchema),
  FacultyControllers.updateFaculty,
);

// Delete one
router.delete("/:id", auth(USER_ROLE.admin), FacultyControllers.deleteFaculty);

export const FacultyRoutes = router;
