import { z } from "zod";

const preRequisiteCourse = z.object({
  course: z.string(),
  isDeleted: z.boolean().optional(),
});

const createCourseValidationSchema = z.object({
  body: z.object({
    title: z.string(),
    prefix: z.string(),
    code: z.number(),
    credits: z.number(),
    preRequisiteCourses: z.array(preRequisiteCourse).optional(), // Optional , Because Some Courses Don't Have Any Prerequisite Course
    isDeleted: z.boolean().optional(),
  }),
});

// Update Course Validation Schema
const updatePreRequisiteCourse = z.object({
  course: z.string(),
  isDeleted: z.boolean().optional(),
});

const updateCourseValidationSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    prefix: z.string().optional(),
    code: z.number().optional(),
    credits: z.number().optional(),
    preRequisiteCourses: z.array(updatePreRequisiteCourse).optional(), // Optional , Because Some Courses Don't Have Any Prerequisite Course
    isDeleted: z.boolean().optional(),
  }),
});

// CourseFaculty Validation Schema
const assignFacultiesWithCourseValidationSchema = z.object({
  body: z.object({
    faculties: z.array(z.string()),
  }),
});

export const CourseValidations = {
  createCourseValidationSchema,
  updateCourseValidationSchema,
  assignFacultiesWithCourseValidationSchema,
};
