import type {
  TCompany,
  TCompanyMembership,
} from "@/company/interface/company.js";
import CompanyMembership from "@/company/model/company-membership.js";
import Company from "@/company/model/company.js";
import {
  COMPANY_STATUS,
  CompanyQuerySchema,
  CreateCompanySchema,
  MEMBERSHIP_STATUS,
  PageLimitSchema,
  RespondToRequestSchema,
  UpdateCompanySchema,
  UpdateCompanyStatusSchema,
} from "@/company/validation/company.js";
import { Role, type TTokenUser } from "@/user/interface/user.js";
import User from "@/user/model/user.js";
import { getPaginateData } from "@/utils/getPaginateData.js";
import {
  parseOrThrow,
  transformToObjectId,
  validateObjectId,
} from "@/utils/utils.js";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnprocessableEntityError,
} from "http-errors-enhanced";
import mongoose from "mongoose";

const createCompany = async (data: unknown, user: TTokenUser) => {
  const validatedData = parseOrThrow(CreateCompanySchema, data);

  if (user.role !== Role.JOB_SEEKER) {
    throw new BadRequestError(
      "You must be a job seeker with no company affiliation to create a company.",
    );
  }

  const userObjectId = transformToObjectId(user.id);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const createdCompany = new Company({
      ...validatedData,
      ownerId: userObjectId,
      recruiterCount: 1,
    });
    await createdCompany.save({ session });

    const ownerMembership = new CompanyMembership({
      companyId: createdCompany._id,
      userId: userObjectId,
      role: Role.COMPANY_OWNER,
      status: MEMBERSHIP_STATUS.APPROVED,
      respondedBy: userObjectId,
      respondedAt: new Date(),
    });

    await ownerMembership.save({ session });

    await User.updateOne(
      { _id: userObjectId },
      { role: Role.COMPANY_OWNER, companyId: createdCompany._id },
      { session },
    );

    await session.commitTransaction();

    return createdCompany;
  } catch (error: unknown) {
    await session.abortTransaction();

    throw error;
  } finally {
    await session.endSession();
  }
};

const getCompanies = async (query: unknown, role?: Role) => {
  const validatedQuery = parseOrThrow(CompanyQuerySchema, query);

  const filter: Record<string, unknown> = { status: COMPANY_STATUS.ACTIVE };

  if (validatedQuery.isAdmin && role === Role.ADMIN) {
    if (validatedQuery.status) {
      filter.status = validatedQuery.status;
    } else {
      delete filter.status;
    }
  }

  if (validatedQuery.search) {
    filter.$or = [
      { name: { $regex: validatedQuery.search, $options: "i" } },
      { email: { $regex: validatedQuery.search, $options: "i" } },
      { industry: { $regex: validatedQuery.search, $options: "i" } },
    ];
  }

  if (validatedQuery.status) {
    filter.status = validatedQuery.status;
  }

  const sort: Record<string, 1 | -1> = {};
  const sortBy = validatedQuery.sortBy || "createdAt";
  const sortOrder = validatedQuery.sortOrder === "asc" ? 1 : -1;
  sort[sortBy] = sortOrder;

  const page = validatedQuery.page || 1;
  const limit = validatedQuery.limit || 10;

  const companies = await Company.paginate(filter, {
    sort,
    page,
    limit,
    populate: { path: "ownerId", select: "name email image" },
  });

  return getPaginateData<TCompany>(companies);
};

const getCompanyById = async (id: string) => {
  if (!validateObjectId(id)) {
    throw new BadRequestError("Invalid company ID.");
  }

  const company = await Company.findById(id)
    .populate("ownerId", "name email image")
    .lean()
    .exec();

  if (!company) throw new NotFoundError("Company not found.");

  return company;
};

const updateCompany = async (id: string, data: unknown, userId: string) => {
  if (!validateObjectId(id)) {
    throw new NotFoundError("Invalid company ID.");
  }

  const validatedData = parseOrThrow(UpdateCompanySchema, data);

  const company = await Company.findOne({
    _id: id,
    ownerId: userId,
  })
    .lean()
    .exec();

  if (!company) throw new NotFoundError("Company not found.");

  const updatedCompany = await Company.findByIdAndUpdate(id, validatedData, {
    runValidators: true,
    returnDocument: "after",
  })
    .lean()
    .exec();

  return updatedCompany;
};

const updateCompanyStatus = async (id: string, payload: unknown) => {
  if (!validateObjectId(id)) {
    throw new UnprocessableEntityError("Invalid company ID.");
  }

  const _id = transformToObjectId(id);

  const { status } = parseOrThrow(UpdateCompanyStatusSchema, payload);

  const company = await Company.exists({ _id });
  if (!company) throw new NotFoundError("Company not found.");

  const updatedCompany = await Company.findByIdAndUpdate(
    _id,
    { status },
    { runValidators: true, returnDocument: "after" },
  )
    .lean()
    .exec();

  return updatedCompany;
};

const requestJoin = async (companyId: string, userId: string) => {
  if (!validateObjectId(companyId)) {
    throw new BadRequestError("Invalid company ID.");
  }

  const user = await User.findById(userId).lean().exec();
  if (!user) throw new NotFoundError("User not found.");

  if (user.role !== Role.JOB_SEEKER) {
    throw new BadRequestError(
      "You must be a job seeker with no company affiliation to request joining a company.",
    );
  }

  const company = await Company.findById(companyId).lean().exec();
  if (!company) throw new NotFoundError("Company not found.");

  if (company.status !== COMPANY_STATUS.ACTIVE) {
    throw new BadRequestError("This company is not accepting join requests.");
  }

  try {
    const membership = await CompanyMembership.create({
      companyId: transformToObjectId(companyId),
      userId: transformToObjectId(userId),
      role: Role.COMPANY_MEMBER,
      status: MEMBERSHIP_STATUS.PENDING,
    });

    return membership;
  } catch (error) {
    if ((error as { code?: number }).code === 11000) {
      throw new ConflictError(
        "You already have a pending request to this company.",
      );
    }
    throw error;
  }
};

const cancelJoinRequest = async (companyId: string, userId: string) => {
  if (!validateObjectId(companyId)) {
    throw new BadRequestError("Invalid company ID.");
  }

  const membership = await CompanyMembership.findOneAndUpdate(
    {
      companyId: transformToObjectId(companyId),
      userId: transformToObjectId(userId),
      status: MEMBERSHIP_STATUS.PENDING,
    },
    {
      status: MEMBERSHIP_STATUS.REMOVED,
      respondedBy: transformToObjectId(userId),
      respondedAt: new Date(),
    },
    { runValidators: true, returnDocument: "after" },
  )
    .lean()
    .exec();

  if (!membership) throw new NotFoundError("Pending join request not found.");

  return membership;
};

const getJoinRequests = async (
  companyId: string,
  userId: string,
  query: unknown,
) => {
  if (!validateObjectId(companyId)) {
    throw new BadRequestError("Invalid company ID.");
  }

  const company = await Company.findOne({
    _id: companyId,
    ownerId: userId,
  })
    .lean()
    .exec();

  if (!company) throw new NotFoundError("Company not found.");

  const validatedQuery = parseOrThrow(PageLimitSchema, query);
  const page = validatedQuery.page || 1;
  const limit = validatedQuery.limit || 10;

  const requests = await CompanyMembership.paginate(
    {
      companyId: transformToObjectId(companyId),
      status: MEMBERSHIP_STATUS.PENDING,
    },
    {
      sort: { createdAt: -1 },
      page,
      limit,
      populate: { path: "userId", select: "name email image" },
    },
  );

  return getPaginateData<TCompanyMembership>(requests);
};

const respondToRequest = async (
  companyId: string,
  requestId: string,
  data: unknown,
  userId: string,
) => {
  if (!validateObjectId(companyId) || !validateObjectId(requestId)) {
    throw new BadRequestError("Invalid company or request ID.");
  }

  const validatedData = parseOrThrow(RespondToRequestSchema, data);
  const companyObjectId = transformToObjectId(companyId);

  const company = await Company.findOne({
    _id: companyObjectId,
    ownerId: userId,
  })
    .lean()
    .exec();

  if (!company) throw new NotFoundError("Company not found.");

  const membership = await CompanyMembership.findOne({
    _id: requestId,
    companyId: companyObjectId,
    status: MEMBERSHIP_STATUS.PENDING,
  })
    .lean()
    .exec();

  if (!membership) {
    throw new NotFoundError("Request not found or already resolved.");
  }

  if (validatedData.status === MEMBERSHIP_STATUS.APPROVED) {
    const updatedCompany = await Company.findOneAndUpdate(
      {
        _id: companyObjectId,
        $expr: { $lt: ["$recruiterCount", "$maxRecruiters"] },
      },
      { $inc: { recruiterCount: 1 } },
      { new: true },
    )
      .lean()
      .exec();

    if (!updatedCompany) {
      throw new ConflictError("This company has reached its recruiter limit.");
    }

    await CompanyMembership.updateOne(
      { _id: requestId },
      {
        status: MEMBERSHIP_STATUS.APPROVED,
        respondedBy: transformToObjectId(userId),
        respondedAt: new Date(),
      },
    );

    await User.updateOne(
      { _id: membership.userId },
      {
        role: Role.COMPANY_MEMBER,
        companyId: companyObjectId,
      },
    );

    await CompanyMembership.updateMany(
      {
        userId: membership.userId,
        status: MEMBERSHIP_STATUS.PENDING,
        _id: { $ne: requestId },
      },
      { status: MEMBERSHIP_STATUS.REJECTED, respondedAt: new Date() },
    );
  } else {
    await CompanyMembership.updateOne(
      { _id: requestId },
      {
        status: MEMBERSHIP_STATUS.REJECTED,
        respondedBy: transformToObjectId(userId),
        respondedAt: new Date(),
      },
    );
  }

  return CompanyMembership.findById(requestId)
    .populate("userId", "name email image")
    .lean()
    .exec();
};

const getMembers = async (
  companyId: string,
  userId: string,
  query: unknown,
) => {
  if (!validateObjectId(companyId)) {
    throw new BadRequestError("Invalid company ID.");
  }

  const company = await Company.findOne({
    _id: companyId,
    ownerId: userId,
  })
    .lean()
    .exec();

  if (!company) throw new NotFoundError("Company not found.");

  const validatedQuery = parseOrThrow(PageLimitSchema, query);
  const page = validatedQuery.page || 1;
  const limit = validatedQuery.limit || 10;

  const members = await CompanyMembership.paginate(
    {
      companyId: transformToObjectId(companyId),
      status: MEMBERSHIP_STATUS.APPROVED,
    },
    {
      sort: { createdAt: 1 },
      page,
      limit,
      populate: { path: "userId", select: "name email image role" },
    },
  );

  return getPaginateData<TCompanyMembership>(members);
};

const removeMember = async (
  companyId: string,
  userId: string,
  memberUserId: string,
) => {
  if (!validateObjectId(companyId) || !validateObjectId(memberUserId)) {
    throw new BadRequestError("Invalid company or member ID.");
  }

  const company = await Company.findOne({
    _id: companyId,
    ownerId: userId,
  })
    .lean()
    .exec();

  if (!company) throw new NotFoundError("Company not found.");

  const ownerObjectId = transformToObjectId(userId);
  const memberObjectId = transformToObjectId(memberUserId);

  if (ownerObjectId.equals(memberObjectId)) {
    throw new BadRequestError(
      "Owners cannot remove themselves. Delete the company instead.",
    );
  }

  const membership = await CompanyMembership.findOneAndUpdate(
    {
      companyId: transformToObjectId(companyId),
      userId: memberObjectId,
      status: MEMBERSHIP_STATUS.APPROVED,
    },
    {
      status: MEMBERSHIP_STATUS.REMOVED,
      respondedBy: ownerObjectId,
      respondedAt: new Date(),
    },
    { runValidators: true, returnDocument: "after" },
  )
    .lean()
    .exec();

  if (!membership) throw new NotFoundError("Member not found.");

  await User.updateOne(
    { _id: memberObjectId },
    { role: Role.JOB_SEEKER, companyId: null },
  );

  await Company.updateOne({ _id: companyId }, { $inc: { recruiterCount: -1 } });

  return membership;
};

const leaveCompany = async (userId: string, companyId: string | null) => {
  if (!companyId) {
    throw new BadRequestError("You are not affiliated with any company.");
  }

  if (!validateObjectId(companyId)) {
    throw new BadRequestError("Invalid company ID.");
  }

  const userObjectId = transformToObjectId(userId);
  const companyObjectId = transformToObjectId(companyId);

  const membership = await CompanyMembership.findOneAndUpdate(
    {
      companyId: companyObjectId,
      userId: userObjectId,
      status: MEMBERSHIP_STATUS.APPROVED,
    },
    {
      status: MEMBERSHIP_STATUS.REMOVED,
      respondedBy: userObjectId,
      respondedAt: new Date(),
    },
    { runValidators: true, returnDocument: "after" },
  )
    .lean()
    .exec();

  if (!membership) throw new NotFoundError("Membership not found.");

  await User.updateOne(
    { _id: userObjectId },
    { role: Role.JOB_SEEKER, companyId: null },
  );

  await Company.updateOne(
    { _id: companyObjectId },
    { $inc: { recruiterCount: -1 } },
  );

  return membership;
};

const deleteCompany = async (id: string, user: TTokenUser) => {
  if (!validateObjectId(id)) {
    throw new UnprocessableEntityError("Invalid company ID.");
  }

  const query: Record<string, string> = {
    _id: id,
  };

  if (user.role !== Role.ADMIN) {
    query.ownerId = user.id;
  }

  const company = await Company.findOne(query).lean().exec();

  if (!company) throw new NotFoundError("Company not found.");

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const approvedMembers = await CompanyMembership.find({
      companyId: company._id,
      status: MEMBERSHIP_STATUS.APPROVED,
    })
      .select("userId")
      .lean()
      .exec();

    const memberIds = approvedMembers.map((m) => m.userId);

    await CompanyMembership.updateMany(
      {
        companyId: company._id,
        status: MEMBERSHIP_STATUS.APPROVED,
      },
      { status: MEMBERSHIP_STATUS.REMOVED, respondedAt: new Date() },
      { session },
    );

    await CompanyMembership.updateMany(
      {
        companyId: company._id,
        status: MEMBERSHIP_STATUS.PENDING,
      },
      { status: MEMBERSHIP_STATUS.REJECTED, respondedAt: new Date() },
      { session },
    );

    await User.updateMany(
      { _id: { $in: memberIds } },
      { role: Role.JOB_SEEKER, companyId: null },
      { session },
    );

    await Company.findByIdAndUpdate(
      company._id,
      { status: COMPANY_STATUS.SUSPENDED },
      { session },
    );

    await session.commitTransaction();
  } catch (error: unknown) {
    await session.abortTransaction();

    throw error;
  } finally {
    await session.endSession();
  }

  return { message: "Company deleted successfully." };
};

const getMyMembership = async (userId: string) => {
  const user = await User.findById(userId).lean().exec();
  if (!user) throw new NotFoundError("User not found.");

  if (
    (user.role === Role.COMPANY_OWNER || user.role === Role.COMPANY_MEMBER) &&
    user.companyId
  ) {
    const company = await Company.findById(user.companyId)
      .select("name logo")
      .lean()
      .exec();

    return {
      status: "active",
      role: user.role,
      companyId: user.companyId,
      company,
    };
  }

  const pendingRequest = await CompanyMembership.findOne({
    userId: transformToObjectId(userId),
    status: MEMBERSHIP_STATUS.PENDING,
  })
    .select("companyId")
    .lean()
    .exec();

  if (pendingRequest) {
    const company = await Company.findById(pendingRequest.companyId)
      .select("name logo")
      .lean()
      .exec();

    return {
      status: "pending",
      companyId: pendingRequest.companyId,
      company,
    };
  }

  return { status: "none" };
};

const services = {
  createCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
  updateCompanyStatus,
  deleteCompany,
  requestJoin,
  cancelJoinRequest,
  getJoinRequests,
  respondToRequest,
  getMembers,
  removeMember,
  leaveCompany,
  getMyMembership,
};

export default services;
