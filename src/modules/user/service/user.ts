import type { TUser } from "@/user/interface/user.js";
import User from "@/user/model/user.js";
import { getPaginateData } from "@/utils/getPaginateData.js";
import { NotFoundError } from "http-errors-enhanced";

const getUsers = async () => {
  const users = await User.paginate(
    {},
    {
      sort: { createdAt: -1 },
    },
  );

  return getPaginateData<TUser>(users);
};

const getUserById = async (id: string) => {
  const user: TUser | null = await User.findById(id).lean().exec();

  if (!user) throw new NotFoundError("This user does not exist.");

  return user;
};

const services = {
  getUserById,
  getUsers,
};

export default services;
