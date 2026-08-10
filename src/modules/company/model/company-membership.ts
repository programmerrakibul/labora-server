import type { TCompanyMembership } from "@/company/interface/company.js";
import { MEMBERSHIP_STATUS } from "@/company/validation/company.js";
import { Role } from "@/user/interface/user.js";
import { model, Schema, type PaginateModel } from "mongoose";
import paginate from "mongoose-paginate-v2";

const schema = new Schema<TCompanyMembership>(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    role: {
      type: String,
      enum: [Role.COMPANY_OWNER, Role.COMPANY_MEMBER],
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(MEMBERSHIP_STATUS),
      required: true,
      default: MEMBERSHIP_STATUS.PENDING,
    },

    respondedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    respondedAt: {
      type: Date,
    },
  },

  {
    timestamps: true,
    versionKey: false,
    collection: "company_membership",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: true,
  },
);

schema.index(
  { companyId: 1, userId: 1 },
  { unique: true, partialFilterExpression: { status: "PENDING" } },
);

schema.index({ userId: 1, status: 1 });

schema.index({ companyId: 1, status: 1 });

schema.plugin(paginate);

const CompanyMembership = model<
  TCompanyMembership,
  PaginateModel<TCompanyMembership>
>("CompanyMembership", schema);

export default CompanyMembership;
