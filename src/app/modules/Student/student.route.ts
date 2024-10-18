import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { StudentControllers } from "./student.controller";
import { updateStudentValidationSchema } from "./student.validation";
import { USER_ROLE } from "../user/user.constant";
import auth from "../../middlewares/auth";

const router = express.Router();

router.get(
  "/",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  StudentControllers.getAllStudents,
);

router.get("/:id", StudentControllers.getSingleStudent);

router.patch(
  "/:id",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty),
  validateRequest(updateStudentValidationSchema),
  StudentControllers.updateStudent,
);

router.delete(
  "/:id",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  StudentControllers.deleteStudent,
);

export const StudentRoutes = router;
