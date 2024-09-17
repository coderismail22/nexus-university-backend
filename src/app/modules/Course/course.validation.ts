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
    credits: z.string(),
    preRequisiteCourses: z.array(preRequisiteCourse),
  }),
});

export const CourseValidations = {
  createCourseValidationSchema,
};
