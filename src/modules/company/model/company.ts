import type { TCompany } from "@/company/interface/company.js";
import { COMPANY_STATUS } from "@/company/validation/company.js";
import { model, Schema, type PaginateModel } from "mongoose";
import paginate from "mongoose-paginate-v2";

const schema = new Schema<TCompany>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
      toLowerCase: true,
    },

    logo: {
      type: String,
      trim: true,
      default: "",
    },

    website: {
      type: String,
      trim: true,
      default: "",
    },

    industry: {
      type: String,
      trim: true,
      default: "",
    },

    about: {
      type: String,
      trim: true,
      default: "",
    },

    location: {
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      country: { type: String, trim: true },
    },

    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    maxRecruiters: {
      type: Number,
      required: true,
      default: 5,
    },

    recruiterCount: {
      type: Number,
      required: true,
      default: 1,
    },

    status: {
      type: String,
      enum: Object.values(COMPANY_STATUS),
      default: COMPANY_STATUS.ACTIVE,
    },

    isVerified: {
      type: Boolean,
      default: false,
      required: true,
      index: true,
    },
  },

  {
    timestamps: true,
    versionKey: false,
    collection: "company",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: true,
  },
);

schema.index({ name: "text", industry: "text" });

schema.index({ ownerId: 1 });

schema.plugin(paginate);

const Company = model<TCompany, PaginateModel<TCompany>>("Company", schema);

export default Company;
