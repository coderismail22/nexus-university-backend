import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import bcrypt from "bcrypt";
import { UserRoutes } from "../user/user.route";
import { TLoginUser } from "./auth.interface";
// login
const loginUser = async (payload: TLoginUser) => {
  console.log(payload);

  // check: does the user exist
  const doesUserExist = await User.doesUserExistByCustomId(payload?.id);
  if (!doesUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User does not exist.");
  }

  // check: is the user deleted
  // const isUserDeleted = doesUserExist?.isDeleted;
  // if (isUserDeleted) {
  //   throw new AppError(
  //     httpStatus.NOT_FOUND,
  //     "The user has been deleted exist.",
  //   );
  // }

  // check: userStatus
  // const userStatus = doesUserExist?.status;
  // if (userStatus === "blocked") {
  //   throw new AppError(httpStatus.FORBIDDEN, "The user has been blocked.");
  // }

  // check: doesPasswordMatch
  const doesPasswordMatch = await bcrypt.compare(
    payload?.password,
    doesUserExist?.password,
  );

  // if (!doesPasswordMatch) {
  //   throw new AppError(httpStatus.FORBIDDEN, "Passwords is incorrect.");
  // }
  //   TODO: send access and refresh token
  // result
  // return result
};

export const AuthServices = {
  loginUser,
};
