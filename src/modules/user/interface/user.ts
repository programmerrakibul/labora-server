import type { Document } from "mongoose";

export enum Role {
  JOB_SEEKER = "JOB_SEEKER",
  RECRUITER = "RECRUITER",
  ADMIN = "ADMIN",
}

export type TUser = Document & {
  name: string;
  email: string;
  image?: string;
  emailVerified: boolean;
  role: Role;
  phoneNumber?: string;
  address?: string;
  city?: string;
  country?: string;
  isActive: boolean;
};
