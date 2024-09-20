import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { TSemesterRegistration } from "./semester-registration.interface";
import { SemesterRegistration } from "./semester-registration.model";
import QueryBuilder from "../../builder/QueryBuilder";
import { RegistrationStatus } from "./semester-registration.contant";
import { OfferedCourse } from "../offered-course/offered-course.model";
import mongoose from "mongoose";

// 1.Create semester registration
const createSemesterRegistrationIntoDB = async (
  payload: TSemesterRegistration,
) => {
  const academicSemester = payload?.academicSemester;

  // check if there's already a semester having "UPCOMING" or "ONGOING" semester
  const isThereAnyUpcomingOrOngoingSemester =
    await SemesterRegistration.findOne({
      $or: [
        { status: RegistrationStatus.ONGOING },
        { status: RegistrationStatus.UPCOMING },
      ],
    });

  if (isThereAnyUpcomingOrOngoingSemester) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `The semester status is already ${isThereAnyUpcomingOrOngoingSemester.status}`,
    );
  }

  // check whether the semester exists or not
  if (!academicSemester) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "The specified academic semester registration not found",
    );
  }

  // check whether the semester is already registered
  const isSemesterAlreadyRegistered = await SemesterRegistration.findOne({
    academicSemester,
  });
  if (isSemesterAlreadyRegistered) {
    throw new AppError(
      httpStatus.CONFLICT,
      "The specified semester has already been registered",
    );
  }

  // If both of the above conditions are false, start  the semester registration:
  const result = await SemesterRegistration.create(payload);
  return result;
};

// 2.Get all semester registrations
const getAllSemesterRegistrationsFromDB = async (
  query: Record<string, unknown>,
) => {
  const semesterRegistrationQuery = new QueryBuilder(
    SemesterRegistration.find().populate("academicSemester"),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await semesterRegistrationQuery.modelQuery;
  return result;
};

// 3.Get a single semester registration
const getSingleSemesterRegistrationFromDB = async (id: string) => {
  const result =
    await SemesterRegistration.findById(id).populate("academicSemester");
  return result;
};

// 4.Update semester registration
const updateSemesterRegistrationIntoDB = async (
  id: string,
  payload: Partial<TSemesterRegistration>,
) => {
  //check if the requested semester registration exists in the database
  const requestedSemester = await SemesterRegistration.findById(id);

  if (!requestedSemester) {
    throw new AppError(httpStatus.BAD_REQUEST, "This semester does not exist.");
  }

  // if the registered course has ended, no need to update anything.
  const currentSemesterStatus = requestedSemester?.status;
  const requestedSemesterStatus = payload?.status;

  if (currentSemesterStatus === RegistrationStatus.ENDED) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `This semester has already been ${currentSemesterStatus}.`,
    );
  }

  // MAKE SURE TO FOLLOW THIS FLOW STRICTLY WHILE UPDATING:
  // UPCOMING->ONGOING->ENDED ✅
  // UPCOMING->ENDED ❌
  // ENDED -> ONGOING -> UPCOMING ❌

  // TODO: IMPLEMENT STRICT FLOW OF UPDATING
  // STOP UPCOMING TO ENDED
  if (
    currentSemesterStatus === RegistrationStatus.UPCOMING &&
    requestedSemesterStatus === RegistrationStatus.ENDED
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You cannot directly change status from ${currentSemesterStatus} to ${requestedSemesterStatus}`,
    );
  }
  // STOP ONGOING TO UPCOMING
  if (
    currentSemesterStatus === RegistrationStatus.ONGOING &&
    requestedSemesterStatus === RegistrationStatus.UPCOMING
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You cannot change status from ${currentSemesterStatus} to ${requestedSemesterStatus}`,
    );
  }
  const result = await SemesterRegistration.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};
// 5.Delete semester registration and associated offered courses
const deleteSemesterRegistrationAndAllAssociatedOfferedCoursesFromDB = async (
  id: string,
) => {
  const session = await mongoose.startSession(); // Start the session
  try {
    session.startTransaction(); // Start the transaction

    // Check the semester registration status
    const semesterRegistration = await SemesterRegistration.findById(id)
      .session(session)
      .select("-_id status");

    if (!semesterRegistration) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        "Could not find the semester registration.",
      );
    }

    if (semesterRegistration.status !== "UPCOMING") {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Cannot delete semester registration since the status is ${semesterRegistration.status}`,
      );
    }

    // Find associated offered courses
    const associatedOfferedCourses = await OfferedCourse.find({
      semesterRegistration: id,
    }).session(session);

    // Delete all offered courses associated with the semester registration
    if (associatedOfferedCourses.length > 0) {
      await OfferedCourse.deleteMany({ semesterRegistration: id }, { session });
    }

    // Delete the semester registration
    const result = await SemesterRegistration.findByIdAndDelete(id, {
      new: true,
      session,
    });

    if (!result) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        "Semester registration not found!",
      );
    }

    await session.commitTransaction(); // Commit the transaction if successful
    return result;
  } catch (error) {
    await session.abortTransaction(); // Rollback the transaction on error

    // Narrow the error type
    if (error instanceof Error) {
      console.error("Transaction failed. Error message:", error.message);
      console.error("Error stack trace:", error.stack); // Log full error stack for debugging
    } else {
      console.error("Transaction failed. Unknown error:", error);
    }

    // Return appropriate error message based on the errorf
    throw new AppError(
      httpStatus.CONFLICT,
      `${error instanceof Error ? error.message : "Unknown error occurred while deleting the semester registration."}`,
    );
  } finally {
    session.endSession(); // End the session
  }
};

export const SemesterRegistrationServices = {
  createSemesterRegistrationIntoDB,
  getAllSemesterRegistrationsFromDB,
  getSingleSemesterRegistrationFromDB,
  updateSemesterRegistrationIntoDB,
  deleteSemesterRegistrationAndAllAssociatedOfferedCoursesFromDB,
};
