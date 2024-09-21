import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import bcrypt from "bcrypt";
import { UserRoutes } from "../user/user.route";
import { TLoginUser } from "./auth.interface";
import jwt from "jsonwebtoken";
import config from "../../config";
// login
const loginUser = async (payload: TLoginUser) => {
  console.log(payload);

  // check: does the user exist
  const user = await User.doesUserExistByCustomId(payload?.id);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User does not exist.");
  }

  // check: is the user deleted
  const isUserDeleted = user?.isDeleted;
  if (isUserDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "The user has been deleted.");
  }

  // check: userStatus
  const userStatus = user?.status;
  if (userStatus === "blocked") {
    throw new AppError(httpStatus.FORBIDDEN, "The user has been blocked.");
  }

  // check: doesPasswordMatch
  const doesPasswordMatch = await User.doPasswordsMatch(
    payload?.password,
    user?.password,
  );

  if (!doesPasswordMatch) {
    throw new AppError(httpStatus.FORBIDDEN, "Passwords is incorrect.");
  }
  //   TODO: send access and refresh token

  // create token and send to the cl
  const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: "10d",
  });

  return { accessToken, needsPasswordChange: user?.needsPasswordChange };
};

export const AuthServices = {
  loginUser,
};
