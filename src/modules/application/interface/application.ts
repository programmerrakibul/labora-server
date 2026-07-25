import type { Document, Types } from "mongoose";
import type { TCreateApplicationInput } from "../validation/application.js";

export type TApplication = Document &
  TCreateApplicationInput & {
    applicantId: Types.ObjectId;
  };
