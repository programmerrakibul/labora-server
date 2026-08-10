import type { Document, Types } from "mongoose";
import type { TCreateJobInput } from "../validation/job.js";

export type TJob = Document &
  TCreateJobInput & {
    company: string;
    companyId: Types.ObjectId | null;
    postedBy: Types.ObjectId;
  };
