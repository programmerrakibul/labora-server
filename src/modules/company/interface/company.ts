import type {
  TCompanyStatus,
  TCreateCompanyInput,
  TMembershipStatus,
} from "@/company/validation/company.js";
import type { Prettify } from "@/types/index.js";
import type { Role } from "@/user/interface/user.js";
import type { Document, Types } from "mongoose";

export type TCompany = Prettify<
  Document &
    TCreateCompanyInput & {
      ownerId: Types.ObjectId;
      maxRecruiters: number;
      recruiterCount: number;
      status: TCompanyStatus;
      isVerified: boolean;
    }
>;

export type TCompanyMembership = Prettify<
  Document & {
    companyId: Types.ObjectId;
    userId: Types.ObjectId;
    role: Role.COMPANY_OWNER | Role.COMPANY_MEMBER;
    status: TMembershipStatus;
    respondedBy?: Types.ObjectId;
    respondedAt?: Date;
  }
>;
