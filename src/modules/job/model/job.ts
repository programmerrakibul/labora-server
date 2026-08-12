import type { TJob } from "@/job/interface/job.js";
import {
  CURRENCY_TYPE,
  EXPERIENCE_LEVEL,
  JOB_STATUS,
  JOB_TYPE,
  LOCATION_TYPE,
} from "@/job/validation/job.js";
import { model, Schema, type PaginateModel } from "mongoose";
import paginate from "mongoose-paginate-v2";

const schema = new Schema<TJob>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    company: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    requirements: {
      type: [String],
      default: [],
    },

    responsibilities: {
      type: [String],
      default: [],
    },

    skills: {
      type: [String],
      default: [],
    },

    jobType: {
      type: String,
      enum: Object.values(JOB_TYPE),
      required: true,
    },

    workLocationType: {
      type: String,
      enum: Object.values(LOCATION_TYPE),
      required: true,
    },

    experienceLevel: {
      type: String,
      enum: Object.values(EXPERIENCE_LEVEL),
      required: true,
    },

    location: {
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      country: { type: String, trim: true },
    },

    salary: {
      min: { type: Number },
      max: { type: Number },
      currency: {
        type: String,
        default: CURRENCY_TYPE.BDT,
        uppercase: true,
        enum: Object.values(CURRENCY_TYPE),
      },
      isNegotiable: { type: Boolean, default: false },
    },

    category: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    tags: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: Object.values(JOB_STATUS),
      default: JOB_STATUS.ACTIVE,
    },

    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      default: null,
    },

    postedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    expiresAt: {
      type: Date,
    },
  },

  {
    timestamps: true,
    versionKey: false,
    collection: "job",
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    id: true,
  },
);

schema.index({
  title: "text",
  description: "text",
  company: "text",
  skills: "text",
});

schema.index({ status: 1, category: 1, createdAt: -1 });
schema.index({ status: 1, workLocationType: 1, jobType: 1 });

schema.index({ postedBy: 1, status: 1 });

schema.index({ companyId: 1, status: 1 });

schema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

schema.plugin(paginate);

const Job = model<TJob, PaginateModel<TJob>>("Job", schema);

export default Job;
