import express, { NextFunction, Request, Response } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { createFacultyValidationSchema } from "../Faculty/faculty.validation";
import { createStudentValidationSchema } from "./../student/student.validation";
import { UserControllers } from "./user.controller";
import auth from "../../middlewares/auth";
import { UserValidations } from "./user.validation";
import { AdminValidations } from "../admin/admin.validation";
import { upload } from "../../utils/sendImageToCloudinary";
import { USER_ROLE } from "./user.constant";

const router = express.Router();

// create student
router.post(
  "/create-student",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(createStudentValidationSchema),
  UserControllers.createStudent,
);

// create faculty
router.post(
  "/create-faculty",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
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

router.get(
  "/me",
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.student,
    USER_ROLE.faculty,
  ),
  UserControllers.getMe,
);

export const UserRoutes = router;
