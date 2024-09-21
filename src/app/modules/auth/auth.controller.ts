import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import { User } from "../user/user.model";
import { AuthServices } from "./auth.service";
import catchAsync from "../../utils/catchAsync";

// login controller
const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUser(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Login successful",
    data: result,
  });
});

// change password controller
const changePassword = catchAsync(async (req, res) => {
  const { ...passwordData } = req.body;
  const result = await AuthServices.changePassword(req.user, passwordData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password has been updated successfully.",
    data: result,
  });
});

export const AuthControllers = {
  loginUser,
  changePassword,
};
