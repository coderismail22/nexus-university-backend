import { z } from "zod";

const loginValidationSchema = z.object({
  body: z.object({
    id: z.string({ required_error: "id is required" }),
    password: z.string({ required_error: "password is required" }),
  }),
});

const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z.string({ required_error: "old password is required" }),
    newPassword: z.string({ required_error: "new password is required" }),
  }),
});

const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({ required_error: "Access token is required" }),
  }),
});

const forgotPasswordValidationSchema = z.object({
  body: z.object({
    id: z.string({ required_error: "User id is required" }),
  }),
});

const resetPasswordValidationSchema = z.object({
  body: z.object({
    id: z.string({ required_error: "User id is required" }),
    newPassword: z.string({ required_error: "New password  id is required" }),
  }),
});

export const AuthValidations = {
  loginValidationSchema,
  changePasswordValidationSchema,
  refreshTokenValidationSchema,
  forgotPasswordValidationSchema,
  resetPasswordValidationSchema,
};
