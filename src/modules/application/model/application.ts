import type { TApplication } from "@/application/interface/application.js";
import { APPLICATION_STATUS } from "@/application/validation/application.js";
import { model, Schema, type PaginateModel } from "mongoose";
import paginate from "mongoose-paginate-v2";

const schema = new Schema<TApplication>(
  {
    jobId: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    applicantId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    resumeUrl: {
      type: String,
      required: true,
      trim: true,
    },

    coverLetter: {
      type: String,
      trim: true,
    },

    expectedSalary: {
      type: Number,
    },

    status: {
      type: String,
      enum: Object.values(APPLICATION_STATUS),
      default: APPLICATION_STATUS.PENDING,
    },
  },

  {
    timestamps: true,
    versionKey: false,
    collection: "application",
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    id: true,
  },
);

schema.index({ jobId: 1, applicantId: 1 }, { unique: true });

schema.index({ jobId: 1, status: 1, createdAt: -1 });

schema.index({ applicantId: 1, createdAt: -1 });

schema.plugin(paginate);

const Application = model<TApplication, PaginateModel<TApplication>>(
  "Application",
  schema,
);

export default Application;
