import { getEnv } from "@/config/env.js";
import Asset from "@/upload/model/upload.js";
import {
  ALLOWED_MIME_TYPES,
  CLOUDINARY_FOLDERS,
  MAX_FILE_SIZE,
} from "@/upload/validation/upload.js";
import { validateObjectId } from "@/utils/utils.js";
import { v2 as cloudinary } from "cloudinary";
import type { Request } from "express";
import { NotFoundError } from "http-errors-enhanced";
import multer from "multer";

const DataURIParser = require("datauri/parser");

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
  getEnv();

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  if (
    ALLOWED_MIME_TYPES.includes(
      file.mimetype as (typeof ALLOWED_MIME_TYPES)[number],
    )
  ) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} is not allowed.`));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});

const uploadToCloudinary = async (file: Express.Multer.File) => {
  const parser = new DataURIParser();
  const buffer = file.buffer;
  const base64 = buffer.toString("base64");

  const dataUri = parser.format(
    `.${file.originalname.split(".").pop()}`,
    base64,
  );

  const resourceType = file.mimetype.startsWith("image/") ? "image" : "raw";

  const result = await cloudinary.uploader.upload(dataUri.content || "", {
    resource_type: resourceType,
    folder: CLOUDINARY_FOLDERS.DOCUMENTS,
  });

  return result;
};

const createAsset = async (file: Express.Multer.File) => {
  const result = await uploadToCloudinary(file);

  const asset = await Asset.create({
    publicId: result.public_id,
    url: result.url,
    secureUrl: result.secure_url,
    resourceType: result.resource_type,
    format: result.format,
    bytes: result.bytes,
    width: result.width,
    height: result.height,
    originalName: file.originalname,
    mimeType: file.mimetype,
    folder: CLOUDINARY_FOLDERS.DOCUMENTS,
  });

  return asset;
};

const getAssetById = async (id: string) => {
  if (!validateObjectId(id)) {
    throw new NotFoundError("Invalid asset ID.");
  }

  const asset = await Asset.findById(id).lean().exec();

  if (!asset) throw new NotFoundError("Asset not found.");

  return asset;
};

const deleteAsset = async (id: string) => {
  if (!validateObjectId(id)) {
    throw new NotFoundError("Invalid asset ID.");
  }

  const asset = await Asset.findById(id).lean().exec();

  if (!asset) throw new NotFoundError("Asset not found.");

  const resourceType = asset.resourceType === "image" ? "image" : "raw";

  try {
    await cloudinary.uploader.destroy(asset.publicId, {
      resource_type: resourceType,
    });
  } catch (error) {
    console.error("Cloudinary deletion error:", error);
  }

  await Asset.findByIdAndDelete(id);

  return { message: "Asset deleted successfully." };
};

const services = {
  createAsset,
  getAssetById,
  deleteAsset,
};

export default services;
