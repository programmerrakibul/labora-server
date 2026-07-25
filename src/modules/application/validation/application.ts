import { transformToObjectId, validateObjectId } from "@/utils/utils.js";
import { z } from "zod";

export const APPLICATION_STATUS = {
  PENDING: "PENDING",
  REVIEWING: "REVIEWING",
  SHORTLISTED: "SHORTLISTED",
  INTERVIEW_SCHEDULED: "INTERVIEW_SCHEDULED",
  REJECTED: "REJECTED",
  HIRED: "HIRED",
  WITHDRAWN: "WITHDRAWN",
} as const;

export const ApplicationStatusEnum = z.enum(
  Object.values(APPLICATION_STATUS),
);

export const CreateApplicationSchema = z.object({
  jobId: z
    .string()
    .trim()
    .min(1)
    .refine((id) => validateObjectId(id))
    .transform((id) => transformToObjectId(id)),
  resumeUrl: z.string().url(),
  coverLetter: z.string().trim().optional(),
  expectedSalary: z.number().min(0).optional(),
  status: ApplicationStatusEnum.default(APPLICATION_STATUS.PENDING),
});

export const UpdateApplicationStatusSchema = z.object({
  status: ApplicationStatusEnum,
});

export const ApplicationQuerySchema = z.object({
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
  status: ApplicationStatusEnum.optional(),
  jobId: z
    .string()
    .trim()
    .optional()
    .refine((id) => !id || validateObjectId(id)),
  sortBy: z
    .enum(["createdAt", "status", "expectedSalary"])
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type TApplicationStatus = z.infer<typeof ApplicationStatusEnum>;
export type TCreateApplicationInput = z.infer<typeof CreateApplicationSchema>;
export type TUpdateApplicationStatusInput = z.infer<
  typeof UpdateApplicationStatusSchema
>;
export type TApplicationQuery = z.infer<typeof ApplicationQuerySchema>;
