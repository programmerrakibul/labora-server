import type { TAsset } from "@/upload/interface/upload.js";
import { model, Schema } from "mongoose";

const schema = new Schema<TAsset>(
  {
    publicId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    url: {
      type: String,
      required: true,
      trim: true,
    },

    secureUrl: {
      type: String,
      required: true,
      trim: true,
    },

    resourceType: {
      type: String,
      required: true,
      trim: true,
    },

    format: {
      type: String,
      required: true,
      trim: true,
    },

    bytes: {
      type: Number,
      required: true,
    },

    width: {
      type: Number,
    },

    height: {
      type: Number,
    },

    originalName: {
      type: String,
      required: true,
      trim: true,
    },

    mimeType: {
      type: String,
      required: true,
      trim: true,
    },

    folder: {
      type: String,
      trim: true,
    }
  },

  {
    timestamps: true,
    versionKey: false,
    collection: "asset",
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    id: true,
  },
);

schema.index({ createdAt: -1 });
schema.index({ folder: 1 });

const Asset = model<TAsset>("Asset", schema);

export default Asset;
