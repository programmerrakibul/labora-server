export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
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
