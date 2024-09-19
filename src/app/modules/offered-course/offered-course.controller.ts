import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import { OfferedCourseServices } from "./offered-course.service";
import catchAsync from "../../utils/catchAsync";

const createOfferedCourse = catchAsync(async (req, res) => {
  const result = await OfferedCourseServices.createOfferedCourseIntoDB(
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Offered course created successfully",
    data: result,
  });
});
const getAllOfferedCourses = async () => {};
const getSingleOfferedCourse = async () => {};
const updateSingleOfferedCourse = async () => {};

export const OfferedCourseControllers = {
  createOfferedCourse,
  getAllOfferedCourses,
  getSingleOfferedCourse,
  updateSingleOfferedCourse,
};
