import { z } from "zod";
import { Days } from "./offered-course.constant";
const timeStringFormatSchema = z.string().refine(
  (time) => {
    const regex = /^([01]\d|2[0-3]):[0-5]\d$/;
    return regex.test(time);
  },
  {
    message: "Invalid time format, expected HH:MM in 24 hour format.",
  },
);
const createOfferedCourseValidationSchema = z.object({
  body: z
    .object({
      semesterRegistration: z.string(),
      academicFaculty: z.string(),
      academicDepartment: z.string(),
      course: z.string(),
      faculty: z.string(),
      maxCapacity: z.number(),
      section: z.number(),
      days: z.array(z.enum([...Days] as [string, ...string[]])),
      // add HH:MM string formatting for time
      startTime: timeStringFormatSchema,
      endTime: timeStringFormatSchema,
    })
    .refine(
      (body) => {
        // start time 10:30 => 1970-01-01T10:30
        // end time 12:30 => 1970-01-01T12:30

        const start = new Date(`1970-01-01T${body.startTime}:00`);
        const end = new Date(`1970-01-01T${body.endTime}:00`);
        return end > start;
      },
      {
        message: "End time cannot be before start time !",
      },
    ),
});
const updateOfferedCourseValidationSchema = z.object({
  body: z
    .object({
      faculty: z.string(),
      maxCapacity: z.number(),
      days: z.array(z.enum([...Days] as [string, ...string[]])),
      // add HH:MM string formatting for time
      startTime: timeStringFormatSchema,
      endTime: timeStringFormatSchema,
    })
    .refine(
      (body) => {
        // start time 10:30 => 1970-01-01T10:30
        // end time 12:30 => 1970-01-01T12:30

        const start = new Date(`1970-01-01T${body.startTime}:00`);
        const end = new Date(`1970-01-01T${body.endTime}:00`);
        return end > start;
      },
      {
        message: "End time cannot be before start time !",
      },
    ),
});

export const OfferedCourseValidations = {
  createOfferedCourseValidationSchema,
  updateOfferedCourseValidationSchema,
};
