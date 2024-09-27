import { z } from "zod";
import { STATUS } from "./user.constant";

const userValidationSchema = z.object({
  password: z
    .string({
      invalid_type_error: "Password must be string",
    })
    .max(20, { message: "Password can not be more than 20 characters" })
    .optional(),
});

const changeUserStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum([...STATUS] as [string, ...string[]]),
  }),
});

export const UserValidations = {
  userValidationSchema,
  changeUserStatusValidationSchema,
};
