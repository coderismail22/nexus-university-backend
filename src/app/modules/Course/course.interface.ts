import { Types } from "mongoose";

export type TPrerequisiteCourse = {
  course: Types.ObjectId; //actually referenced id
  isDeleted: boolean;
};

export type TCourse = {
  title: string;
  prefix: string;
  code: number;
  credits: number;
  preRequisiteCourses: [TPrerequisiteCourse];
  isDeleted: boolean;
};

export type TCourseFaculty = {
  course: Types.ObjectId;
  faculties: [Types.ObjectId];
};
