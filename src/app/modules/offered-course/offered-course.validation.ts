import { z } from "zod";
import { Days } from "./offered-course.constant";

const createOfferedCourseValidationSchema = z.object({
  body: z.object({
    semesterRegistration: z.string(),
    academicFaculty: z.string(),
    academicDepartment: z.string(),
    course: z.string(),
    faculty: z.string(),
    maxCapacity: z.number(),
    section: z.number(),
    days: z.array(z.enum([...Days] as [string, ...string[]])),
    // add HH:MM string formatting for time
    startTime: z.string().refine(
      (time) => {
        const regex = /^([01]\d|2[0-3]):[0-5]\d$/;
        return regex.test(time);
      },
      {
        message: "Invalid time format, expected HH:MM in 24 hour format.",
      },
    ),
    endTime: z.string().refine(
      (time) => {
        const regex = /^([01]\d|2[0-3]):[0-5]\d$/;
        return regex.test(time);
      },
      {
        message: "Invalid time format, expected HH:MM in 24 hour format.",
      },
    ),
  }),
});
const updateOfferedCourseValidationSchema = z.object({
  body: z.object({
    faculty: z.string(),
    maxCapacity: z.number(),
    days: z.enum([...Days] as [string, ...string[]]),
    startTime: z.string(),
    endTime: z.string(),
  }),
});

export const OfferedCourseValidations = {
  createOfferedCourseValidationSchema,
  updateOfferedCourseValidationSchema,
};
