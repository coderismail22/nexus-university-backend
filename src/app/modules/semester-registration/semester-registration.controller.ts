import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AcademicSemesterServices } from "../academicSemester/academicSemester.service";
import { SemesterRegistrationServices } from "./semester-registration.service";

// Register to the semester
const createSemesterRegistration = catchAsync(async (req, res) => {
  const result =
    await SemesterRegistrationServices.createSemesterRegistrationIntoDB(
      req.body,
    );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Successfully registered to the semester",
    data: result,
  });
});

// Get all the registration
const getAllSemesterRegistrations = catchAsync(async (req, res) => {
  const result =
    await SemesterRegistrationServices.getAllSemesterRegistrationsFromDB(
      req.query,
    );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Successfully retrieved all the semester registrations",
    data: result,
  });
});

// Get a single registration
const getSingleSemesterRegistration = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result =
    await SemesterRegistrationServices.getSingleSemesterRegistrationFromDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Successfully retrieved the semester registration",
    data: result,
  });
});

// Update a single registration
const updateSingleSemesterRegistration = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result =
    await SemesterRegistrationServices.updateSemesterRegistrationIntoDB(
      id,
      req.body,
    );
  console.log("🚀 ~ updateSingleSemesterRegistration ~ result:", req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Successfully updated the semester registration",
    data: result,
  });
});

// Delete semester registration and associated offered courses
const deleteSemesterRegistrationAndAllAssociatedOfferedCourses = catchAsync(
  async (req, res) => {
    const { id } = req.params;
    const result =
      await SemesterRegistrationServices.deleteSemesterRegistrationAndAllAssociatedOfferedCoursesFromDB(
        id,
      );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Deleted the semester registration successfully along with it's associated offered courses.",
      data: result,
    });
  },
);

export const SemesterRegistrationControllers = {
  createSemesterRegistration,
  getAllSemesterRegistrations,
  getSingleSemesterRegistration,
  updateSingleSemesterRegistration,
  deleteSemesterRegistrationAndAllAssociatedOfferedCourses,
};
