import { Role, type TUser } from "@/user/interface/user.js";
import { model, Schema, type PaginateModel } from "mongoose";
import paginate from "mongoose-paginate-v2";

const schema = new Schema<TUser>(
  {
    name: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
      toLowerCase: true,
    },

    image: {
      type: String,
      trim: true,
      default: "",
      toLowerCase: true,
    },

    phoneNumber: {
      type: String,
      trim: true,
      default: "",
    },

    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.JOB_SEEKER,
      index: true,
      required: true,
      trim: true,
      toUpperCase: true,
    },

    address: {
      type: String,
      trim: true,
      default: "",
    },

    city: {
      type: String,
      trim: true,
      default: "",
    },

    country: {
      type: String,
      trim: true,
      default: "",
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "user",
    id: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

schema.plugin(paginate);

const User = model<TUser, PaginateModel<TUser>>("User", schema);

export default User;
