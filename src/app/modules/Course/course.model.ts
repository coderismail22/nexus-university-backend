import { Schema, model } from "mongoose";
import {
  TCourse,
  TCourseFaculty,
  TPrerequisiteCourse,
} from "./course.interface";

// preRequisiteCourseSchema
const preRequisiteCourseSchema = new Schema<TPrerequisiteCourse>({
  course: { type: Schema.Types.ObjectId, ref: "Course" },
  isDeleted: {
    type: "boolean",
    default: false,
  },
});

// courseSchema
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
  preRequisiteCourses: [preRequisiteCourseSchema],
  isDeleted: { type: Boolean, default: false },
});

export const Course = model<TCourse>("Course", courseSchema);

// courseFacultySchema
const courseFacultySchema = new Schema<TCourseFaculty>({
  course: {
    type: Schema.Types.ObjectId,
    ref: "Course",
    unique: true,
  },
  faculties: [{ type: Schema.Types.ObjectId, ref: "Faculty" }],
});

export const CourseFaculty = model<TCourseFaculty>(
  "CourseFaculty",
  courseFacultySchema,
);
