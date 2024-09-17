import { z } from "zod";

const preRequisiteCourse = z.object({
  course: z.string(),
  isDeleted: z.boolean(),
});

const createCourseValidationSchema = z.object({
  body: z.object({
    title: z.string(),
    prefix: z.string(),
    code: z.number(),
    credits: z.number(),
    preRequisiteCourses: z.array(preRequisiteCourse).optional(), // Optional , Because Some Courses Don't Have Any Prerequisite Course
  }),
});

export const CourseValidations = {
  createCourseValidationSchema,
};
