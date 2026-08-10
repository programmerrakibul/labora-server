import type { Role } from "@/user/interface/user.js";
import type { Document, Types } from "mongoose";
import type { TCompanyStatus, TMembershipStatus } from "../validation/company.js";

export type TCompany = Document & {
  name: string;
  logo?: string;
  website?: string;
  industry?: string;
  about?: string;
  location?: {
    city?: string;
    state?: string;
    country?: string;
  };
  ownerId: Types.ObjectId;
  maxRecruiters: number;
  recruiterCount: number;
  status: TCompanyStatus;
};

export type TCompanyMembership = Document & {
  companyId: Types.ObjectId;
  userId: Types.ObjectId;
  role: Role.COMPANY_OWNER | Role.COMPANY_MEMBER;
  status: TMembershipStatus;
  respondedBy?: Types.ObjectId;
  respondedAt?: Date;
};
