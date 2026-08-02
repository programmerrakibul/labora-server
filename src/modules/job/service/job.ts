import type { TJob } from "@/job/interface/job.js";
import Job from "@/job/model/job.js";
import {
  CreateJobSchema,
  JOB_STATUS,
  JobQuerySchema,
  UpdateJobSchema,
  UpdateJobStatusSchema,
} from "@/job/validation/job.js";
import { getPaginateData } from "@/utils/getPaginateData.js";
import {
  double,
  parseOrThrow,
  transformToObjectId,
  validateObjectId,
} from "@/utils/utils.js";
import { BadRequestError, NotFoundError } from "http-errors-enhanced";

const createJob = async (data: unknown, postedById: string) => {
  const validatedData = parseOrThrow(CreateJobSchema, data);

  if (validatedData.salary) {
    validatedData.salary.min = double(validatedData.salary.min);
    validatedData.salary.max = double(validatedData.salary.max);
  }

  const job = await Job.create({
    ...validatedData,
    postedBy: transformToObjectId(postedById),
  });

  return job;
};

const getJobs = async (query: unknown) => {
  const validatedQuery = parseOrThrow(JobQuerySchema, query);

  const filter: Record<string, unknown> = { status: JOB_STATUS.ACTIVE };

  if (validatedQuery.search) {
    filter.$text = { $search: validatedQuery.search };
  }

  if (validatedQuery.category) {
    filter.category = validatedQuery.category.toLowerCase();
  }

  if (validatedQuery.experienceLevel) {
    filter.experienceLevel = validatedQuery.experienceLevel;
  }

  if (validatedQuery.jobType) {
    filter.jobType = validatedQuery.jobType;
  }

  if (validatedQuery.workLocationType) {
    filter.workLocationType = validatedQuery.workLocationType;
  }

  if (validatedQuery.status) {
    filter.status = validatedQuery.status;
  }

  if (validatedQuery.minSalary || validatedQuery.maxSalary) {
    const salaryFilter: Record<string, number> = {};
    if (validatedQuery.minSalary) {
      salaryFilter.$gte = validatedQuery.minSalary;
    }
    if (validatedQuery.maxSalary) {
      salaryFilter.$lte = validatedQuery.maxSalary;
    }
    filter["salary.min"] = salaryFilter;
  }

  const sort: Record<string, 1 | -1> = {};
  const sortBy = validatedQuery.sortBy || "createdAt";
  const sortOrder = validatedQuery.sortOrder === "asc" ? 1 : -1;
  sort[sortBy] = sortOrder;

  const page = validatedQuery.page || 1;
  const limit = validatedQuery.limit || 10;

  const jobs = await Job.paginate(filter, {
    sort,
    page,
    limit,
    populate: { path: "postedBy", select: "name email image" },
  });

  return getPaginateData<TJob>(jobs);
};

const getJobsByUser = async (userId: string, query: unknown) => {
  const validatedQuery = parseOrThrow(JobQuerySchema, query);

  const filter: Record<string, unknown> = {
    postedBy: transformToObjectId(userId),
  };

  if (validatedQuery.status) {
    filter.status = validatedQuery.status;
  }

  const sort: Record<string, 1 | -1> = {};
  const sortBy = validatedQuery.sortBy || "createdAt";
  const sortOrder = validatedQuery.sortOrder === "asc" ? 1 : -1;
  sort[sortBy] = sortOrder;

  const page = validatedQuery.page || 1;
  const limit = validatedQuery.limit || 10;

  const jobs = await Job.paginate(filter, {
    sort,
    page,
    limit,
  });

  return getPaginateData<TJob>(jobs);
};

const getJobById = async (id: string) => {
  if (!validateObjectId(id)) {
    throw new BadRequestError("Invalid job ID.");
  }

  const job = await Job.findById(id)
    .populate("postedBy", "name email image")
    .lean()
    .exec();

  if (!job) throw new NotFoundError("Job not found.");

  return job;
};

const updateJob = async (id: string, data: unknown, userId: string) => {
  if (!validateObjectId(id)) {
    throw new NotFoundError("Invalid job ID.");
  }

  const validatedData = parseOrThrow(UpdateJobSchema, data);

  if (validatedData.salary) {
    if (validatedData.salary.min !== undefined) {
      validatedData.salary.min = double(validatedData.salary.min);
    }
    if (validatedData.salary.max !== undefined) {
      validatedData.salary.max = double(validatedData.salary.max);
    }
  }

  const job = await Job.findOne({
    _id: id,
    postedBy: userId,
  })
    .lean()
    .exec();

  if (!job) throw new NotFoundError("Job not found.");

  const updatedJob = await Job.findByIdAndUpdate(id, validatedData, {
    runValidators: true,
    returnDocument: "after",
  })
    .populate("postedBy", "name email image")
    .lean()
    .exec();

  return updatedJob;
};

const deleteJob = async (id: string, userId: string) => {
  if (!validateObjectId(id)) {
    throw new NotFoundError("Invalid job ID.");
  }

  const job = await Job.findOne({
    _id: id,
    postedBy: userId,
  })
    .lean()
    .exec();

  if (!job) throw new NotFoundError("Job not found.");

  await Job.findByIdAndDelete(id);

  return { message: "Job deleted successfully." };
};

const updateJobStatus = async (id: string, data: unknown, userId: string) => {
  if (!validateObjectId(id)) {
    throw new NotFoundError("Invalid job ID.");
  }

  const validatedData = parseOrThrow(UpdateJobStatusSchema, data);

  const job = await Job.findOne({
    _id: id,
    postedBy: userId,
  })
    .lean()
    .exec();

  if (!job) throw new NotFoundError("Job not found.");

  const updatedJob = await Job.findByIdAndUpdate(
    id,
    { status: validatedData.status },
    { new: true, runValidators: true },
  )
    .populate("postedBy", "name email image")
    .lean()
    .exec();

  return updatedJob;
};

const services = {
  createJob,
  getJobs,
  getJobsByUser,
  getJobById,
  updateJob,
  deleteJob,
  updateJobStatus,
};

export default services;
