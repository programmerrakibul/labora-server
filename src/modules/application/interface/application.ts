import type {
  AggregatePaginateModel,
  Document,
  PaginateModel,
  Types,
} from "mongoose";
import type { TCreateApplicationInput } from "../validation/application.js";

export type TApplication = Document &
  TCreateApplicationInput & {
    applicantId: Types.ObjectId;
  };

export type TApplicationModel = PaginateModel<TApplication> &
  AggregatePaginateModel<TApplication> & {};
