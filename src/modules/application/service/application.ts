import type { TApplication } from "@/application/interface/application.js";
import Application from "@/application/model/application.js";
import { getPaginateData } from "@/utils/getPaginateData.js";
import { parseOrThrow, transformToObjectId, validateObjectId } from "@/utils/utils.js";
import {
  CreateApplicationSchema,
  ApplicationQuerySchema,
  UpdateApplicationStatusSchema,
} from "@/application/validation/application.js";
import { ConflictError, ForbiddenError, NotFoundError } from "http-errors-enhanced";

const createApplication = async (data: unknown, applicantId: string) => {
  const validatedData = parseOrThrow(CreateApplicationSchema, data);

  const existingApplication = await Application.findOne({
    jobId: validatedData.jobId,
    applicantId: transformToObjectId(applicantId),
  })
    .lean()
    .exec();

  if (existingApplication) {
    throw new ConflictError("You have already applied to this job.");
  }

  const application = await Application.create({
    ...validatedData,
    applicantId: transformToObjectId(applicantId),
  });

  return application;
};

const getApplications = async (query: unknown, userId: string, role: string) => {
  const validatedQuery = parseOrThrow(ApplicationQuerySchema, query);

  const filter: Record<string, unknown> = {};

  if (role === "JOB_SEEKER") {
    filter.applicantId = transformToObjectId(userId);
  } else if (role === "RECRUITER") {
    filter.$expr = {
      $eq: ["$jobId.postedBy", transformToObjectId(userId)],
    };
  }

  if (validatedQuery.status) {
    filter.status = validatedQuery.status;
  }

  if (validatedQuery.jobId) {
    filter.jobId = transformToObjectId(validatedQuery.jobId);
  }

  const sort: Record<string, 1 | -1> = {};
  const sortBy = validatedQuery.sortBy || "createdAt";
  const sortOrder = validatedQuery.sortOrder === "asc" ? 1 : -1;
  sort[sortBy] = sortOrder;

  const page = validatedQuery.page || 1;
  const limit = validatedQuery.limit || 10;

  const applications = await Application.paginate(filter, {
    sort,
    page,
    limit,
    populate: [
      { path: "jobId", select: "title company" },
      { path: "applicantId", select: "name email image" },
    ],
  });

  return getPaginateData<TApplication>(applications);
};

const getApplicationById = async (id: string) => {
  if (!validateObjectId(id)) {
    throw new NotFoundError("Invalid application ID.");
  }

  const application = await Application.findById(id)
    .populate("jobId", "title company")
    .populate("applicantId", "name email image")
    .lean()
    .exec();

  if (!application) throw new NotFoundError("Application not found.");

  return application;
};

const updateApplicationStatus = async (
  id: string,
  data: unknown,
  _userId: string,
  _role: string,
) => {
  if (!validateObjectId(id)) {
    throw new NotFoundError("Invalid application ID.");
  }

  const validatedData = parseOrThrow(UpdateApplicationStatusSchema, data);

  const application = await Application.findById(id).lean().exec();

  if (!application) throw new NotFoundError("Application not found.");

  const updatedApplication = await Application.findByIdAndUpdate(
    id,
    { status: validatedData.status },
    { new: true, runValidators: true },
  )
    .populate("jobId", "title company")
    .populate("applicantId", "name email image")
    .lean()
    .exec();

  return updatedApplication;
};

const withdrawApplication = async (id: string, userId: string) => {
  if (!validateObjectId(id)) {
    throw new NotFoundError("Invalid application ID.");
  }

  const application = await Application.findById(id).lean().exec();

  if (!application) throw new NotFoundError("Application not found.");

  if (application.applicantId.toString() !== userId) {
    throw new ForbiddenError(
      "You are not authorized to withdraw this application.",
    );
  }

  const updatedApplication = await Application.findByIdAndUpdate(
    id,
    { status: "WITHDRAWN" },
    { new: true, runValidators: true },
  )
    .lean()
    .exec();

  return updatedApplication;
};

const services = {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplicationStatus,
  withdrawApplication,
};

export default services;
