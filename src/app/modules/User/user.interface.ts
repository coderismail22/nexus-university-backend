import { Model } from "mongoose";
import { USER_ROLE } from "./user.contant";

export interface IUser {
  id: string;
  password: string;
  needsPasswordChange: boolean;
  role: "admin" | "student" | "faculty";
  status: "in-progress" | "blocked";
  isDeleted: boolean;
}

export interface UserModel extends Model<IUser> {
  //Static method type declaration : function-name(parameter):return

  // doesUserExistByCustomId
  doesUserExistByCustomId(id: string): Promise<IUser>;

  // doPasswordsMatch
  doPasswordsMatch(
    plaintextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;

  // isUserDeleted
  isUserDeleted(id: string): Promise<boolean>;
}

export type TUserRole = keyof typeof USER_ROLE;
