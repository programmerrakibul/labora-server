import type { Document, Types } from "mongoose";
import type { TCreateJobInput } from "../validation/job.js";

export type TJob = Document &
  TCreateJobInput & {
    postedBy: Types.ObjectId;
  };
