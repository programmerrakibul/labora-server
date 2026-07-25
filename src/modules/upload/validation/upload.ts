import { z } from "zod";

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const ALLOWED_DOCUMENT_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const;

export const ALLOWED_MIME_TYPES = [
  ...ALLOWED_IMAGE_TYPES,
  ...ALLOWED_DOCUMENT_TYPES,
] as const;

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const CLOUDINARY_FOLDERS = {
  RESUMES: "labora/resumes",
  PROFILES: "labora/profiles",
  DOCUMENTS: "labora/documents",
} as const;

export const UploadValidationSchema = z.object(
  {
    file: z
      .instanceof(File, { error: "A valid file is required" })
      .refine((file) => file.size <= MAX_FILE_SIZE, {
        error: `File size cannot exceed ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
      })
      .refine(
        (file) =>
          ALLOWED_MIME_TYPES.includes(
            file.type as (typeof ALLOWED_MIME_TYPES)[number],
          ),
        { error: `File type must be one of: ${ALLOWED_MIME_TYPES.join(", ")}` },
      ),
    folder: z.string({ error: "Folder must be a string" }).trim().optional(),
    tags: z
      .array(z.string({ error: "Each tag must be a string" }).trim(), {
        error: "Tags must be an array",
      })
      .optional(),
  },
  { error: "Upload data must be a valid object with a file" },
);
