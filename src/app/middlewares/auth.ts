import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../errors/AppError";
import httpStatus from "http-status";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { TUserRole } from "../modules/user/user.interface";

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "You are not authorized to access !",
      );
    }

    try {
      // Synchronously verify the token
      const decoded = jwt.verify(
        token,
        config.jwt_access_secret as string,
      ) as JwtPayload;

      const role = decoded?.role;

      console.log(requiredRoles);
      console.log(role);
      console.log(!requiredRoles.includes(role));

      // Check if the user role is allowed
      if (requiredRoles && !requiredRoles.includes(role)) {
        throw new AppError(
          httpStatus.UNAUTHORIZED,
          "You are not authorized to access !",
        );
      }

      // Attach decoded token data to req.user
      req.user = decoded;
      next();
    } catch (err) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "You are not authorized to access !",
      );
    }
  });
};

export default auth;
