import { Schema, model } from "mongoose";
import { TCourse, TPrerequisiteCourse } from "./course.interface";

const preRequisiteCourse = new Schema<TPrerequisiteCourse>({
  course: Schema.Types.ObjectId,
  isDeleted: {
    type: "boolean",
    default: false,
  },
});

const courseSchema = new Schema<TCourse>({
  title: {
    type: String,
    trim: true,
    unique: true,
    required: true,
  },
  prefix: {
    type: String,
    trim: true,
    required: true,
  },
  code: {
    type: Number,
    trim: true,
    required: true,
  },
  credits: {
    type: Number,
    trim: true,
    required: true,
  },
  preRequisiteCourses: [preRequisiteCourse],
});

export const Course = model<TCourse>("Course", courseSchema);
