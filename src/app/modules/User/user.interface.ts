import { Model } from "mongoose";

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
  doesUserExistByCustomId(id: string): Promise<IUser>;
}
