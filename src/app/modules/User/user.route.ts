import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { createFacultyValidationSchema } from "../Faculty/faculty.validation";
import { createStudentValidationSchema } from "./../student/student.validation";
import { UserControllers } from "./user.controller";
import auth from "../../middlewares/auth";
import { UserValidations } from "./user.validation";
import { AdminValidations } from "../admin/admin.validation";

const router = express.Router();

router.post(
  "/create-student",
  validateRequest(createStudentValidationSchema),
  UserControllers.createStudent,
);

router.post(
  "/create-faculty",
  validateRequest(createFacultyValidationSchema),
  UserControllers.createFaculty,
);

router.post(
  "/create-admin",
  validateRequest(AdminValidations.createAdminValidationSchema),
  UserControllers.createAdmin,
);

router.post(
  "/change-status/:id",
  auth("admin"),
  validateRequest(UserValidations.changeUserStatusValidationSchema),
  UserControllers.changeStatus,
);

router.get("/me", auth("student", "faculty", "admin"), UserControllers.getMe);

export const UserRoutes = router;
