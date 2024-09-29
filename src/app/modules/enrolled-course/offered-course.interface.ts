import { Types } from "mongoose";

export type TDays = "A" | "B" | "C" | "D" | "F" | "NA";

export type TCourseMarks = {
  classTest1: number;
  midTerm: number;
  classTest2: number;
  finalTerm: number;
};

export type TEnroll = {
  days: TDays[];
  startTime: string;
  endTime: string;
};
