import type {
  TApplication,
  TApplicationModel,
} from "@/application/interface/application.js";
import { APPLICATION_STATUS } from "@/application/validation/application.js";
import { model, Schema } from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
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
schema.plugin(aggregatePaginate);

const Application = model<TApplication, TApplicationModel>(
  "Application",
  schema,
);

export default Application;
