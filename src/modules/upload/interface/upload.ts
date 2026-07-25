import type { Document } from "mongoose";

export type TAsset = Document & {
  publicId: string;
  url: string;
  secureUrl: string;
  resourceType: string;
  format: string;
  bytes: number;
  width?: number;
  height?: number;
  originalName: string;
  mimeType: string;
  folder?: string;
};
