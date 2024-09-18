import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { TSemesterRegistration } from "./semester-registration.interface";
import { SemesterRegistration } from "./semester-registration.model";
import QueryBuilder from "../../builder/QueryBuilder";

// 1.Create semester registration
const createSemesterRegistrationIntoDB = async (
  payload: TSemesterRegistration,
) => {
  const academicSemester = payload?.academicSemester;

  // check if there's already a semester having "UPCOMING" or "ONGOING" semester
  const isThereAnyUpcomingOrOngoingSemester =
    await SemesterRegistration.findOne({
      $or: [{ status: "ONGOING" }, { status: "UPCOMING" }],
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
  payload: TSemesterRegistration,
) => {
  const result = await SemesterRegistration.findByIdAndUpdate(
    id,
    {
      payload,
    },
    {
      new: true,
      runValidators: true,
    },
  );
};

export const SemesterRegistrationServices = {
  createSemesterRegistrationIntoDB,
  getAllSemesterRegistrationsFromDB,
  getSingleSemesterRegistrationFromDB,
  updateSemesterRegistrationIntoDB,
};
