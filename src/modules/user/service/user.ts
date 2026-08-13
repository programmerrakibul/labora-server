import { Role, type TUser } from "@/user/interface/user.js";
import User from "@/user/model/user.js";
import {
  UpdateProfileSchema,
  UpdateUserRoleSchema,
  UpdateUserStatusSchema,
  UserQuerySchema,
} from "@/user/validation/user.js";
import { getPaginateData } from "@/utils/getPaginateData.js";
import { parseOrThrow, validateObjectId } from "@/utils/utils.js";
import { BadRequestError, NotFoundError } from "http-errors-enhanced";

const getUsers = async (query: unknown) => {
  const validatedQuery = parseOrThrow(UserQuerySchema, query);

  const filter: Record<string, unknown> = {};

  if (validatedQuery.search) {
    filter.$or = [
      { name: { $regex: validatedQuery.search, $options: "i" } },
      { email: { $regex: validatedQuery.search, $options: "i" } },
    ];
  }

  if (validatedQuery.role) {
    filter.role = validatedQuery.role;
  }

  if (validatedQuery.isActive !== undefined) {
    filter.isActive = validatedQuery.isActive;
  }

  const sort: Record<string, 1 | -1> = {};
  const sortBy = validatedQuery.sortBy || "createdAt";
  const sortOrder = validatedQuery.sortOrder === "asc" ? 1 : -1;
  sort[sortBy] = sortOrder;

  const page = validatedQuery.page || 1;
  const limit = validatedQuery.limit || 10;

  const users = await User.paginate(filter, {
    sort,
    page,
    limit,
  });

  return getPaginateData<TUser>(users);
};

const getUserById = async (id: string) => {
  if (!validateObjectId(id)) {
    throw new NotFoundError("Invalid user ID.");
  }

  const user: TUser | null = await User.findById(id).lean().exec();

  if (!user) throw new NotFoundError("User not found.");

  return user;
};

const updateProfile = async (userId: string, data: unknown) => {
  const validatedData = parseOrThrow(UpdateProfileSchema, data);

  const user = await User.findById(userId).lean().exec();

  if (!user) throw new NotFoundError("User not found.");

  const updatedUser = await User.findByIdAndUpdate(userId, validatedData, {
    new: true,
    runValidators: true,
  })
    .lean()
    .exec();

  return updatedUser;
};

const updateUserStatus = async (id: string, data: unknown) => {
  if (!validateObjectId(id)) {
    throw new BadRequestError("Invalid user ID.");
  }

  const validatedData = parseOrThrow(UpdateUserStatusSchema, data);

  const user = await User.findById(id).lean().exec();

  if (!user) throw new NotFoundError("User not found.");

  const updatedUser = await User.findByIdAndUpdate(
    id,
    { isActive: validatedData.isActive },
    { runValidators: true, returnDocument: "after" },
  )
    .lean()
    .exec();

  return updatedUser;
};

const updateUserRole = async (id: string, payload: unknown) => {
  if (!validateObjectId(id)) {
    throw new BadRequestError("Invalid user ID.");
  }

  const { role } = parseOrThrow(UpdateUserRoleSchema, payload);

  const user = await User.findById(id);

  if (!user) throw new NotFoundError("User not found.");

  if ([Role.ADMIN, Role.JOB_SEEKER].includes(role)) {
    user.companyId = null;
  }

  user.role = role;
  await user.save();

  return user;
};

const deleteUser = async (id: string) => {
  if (!validateObjectId(id)) {
    throw new NotFoundError("Invalid user ID.");
  }

  const user = await User.findById(id).lean().exec();

  if (!user) throw new NotFoundError("User not found.");

  await User.findByIdAndDelete(id);

  return { message: "User deleted successfully." };
};

const services = {
  getUsers,
  getUserById,
  updateProfile,
  updateUserStatus,
  updateUserRole,
  deleteUser,
};

export default services;
