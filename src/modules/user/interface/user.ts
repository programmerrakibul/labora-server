import type { Document, Types } from "mongoose";

export enum Role {
  JOB_SEEKER = "JOB_SEEKER",
  COMPANY_MEMBER = "COMPANY_MEMBER",
  COMPANY_OWNER = "COMPANY_OWNER",
  ADMIN = "ADMIN",
}

export type TUser = Document & {
  name: string;
  email: string;
  image?: string;
  emailVerified: boolean;
  role: Role;
  companyId: Types.ObjectId | null;
  phoneNumber?: string;
  address?: string;
  city?: string;
  country?: string;
  isActive: boolean;
};

export type TTokenUser = Pick<TUser, "email" | "role"> & {
  id: string;
  companyId: string | null;
};
