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

export const AuthControllers = {
  loginUser,
};
