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

const updateSingleOfferedCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await OfferedCourseServices.updateOfferedCourseIntoDB(
    id,
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Offered course updated successfully",
    data: result,
  });
});

// Get all
const getAllOfferedCourses = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await OfferedCourseServices.getAllOfferedCoursesFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Retrieved all the offered courses successfully",
    data: result,
  });
});

// Get a single
const getSingleOfferedCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await OfferedCourseServices.getSingleOfferedCourseFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Retrieved offered course successfully",
    data: result,
  });
});

// Delete a single
const deleteSingleOfferedCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result =
    await OfferedCourseServices.deleteSingleOfferedCourseFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Deleted offered course successfully.",
    data: result,
  });
});

export const OfferedCourseControllers = {
  createOfferedCourse,
  getAllOfferedCourses,
  getSingleOfferedCourse,
  updateSingleOfferedCourse,
  deleteSingleOfferedCourse,
};
