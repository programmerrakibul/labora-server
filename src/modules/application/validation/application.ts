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

export const ApplicationStatusEnum = z.enum(Object.values(APPLICATION_STATUS), {
  error:
    "Application status must be one of: PENDING, REVIEWING, SHORTLISTED, INTERVIEW_SCHEDULED, REJECTED, HIRED, WITHDRAWN",
});

export const CreateApplicationSchema = z.object(
  {
    jobId: z
      .string({ error: "Job ID is required" })
      .trim()
      .min(1, { error: "Job ID cannot be empty" })
      .refine((id) => validateObjectId(id), {
        error: "Job ID must be a valid MongoDB ObjectId",
      })
      .transform((id) => transformToObjectId(id)),
    resumeUrl: z
      .string({ error: "Resume URL is required" })
      .url({ error: "Resume must be a valid URL" }),
    coverLetter: z
      .string({ error: "Cover letter must be a string" })
      .trim()
      .optional(),
    expectedSalary: z
      .number({ error: "Expected salary must be a number" })
      .min(0, { error: "Expected salary cannot be negative" })
      .optional(),
    status: ApplicationStatusEnum.default(APPLICATION_STATUS.PENDING),
  },
  { error: "Application data must be a valid object" },
);

export const UpdateApplicationStatusSchema = z.object(
  {
    status: ApplicationStatusEnum,
  },
  { error: "Status update must include a valid status field" },
);

export const ApplicationQuerySchema = z.object(
  {
    search: z.string({ error: "Search must be a string" }).optional(),
    page: z.coerce
      .number({ error: "Page must be a number" })
      .int({ error: "Page must be an integer" })
      .positive({ error: "Page must be positive" })
      .default(1),
    limit: z.coerce
      .number({ error: "Limit must be a number" })
      .int({ error: "Limit must be an integer" })
      .positive({ error: "Limit must be positive" })
      .max(50, { error: "Limit cannot exceed 50" })
      .default(10),
    status: ApplicationStatusEnum.optional(),
    jobId: z
      .string({ error: "Job ID must be a string" })
      .trim()
      .optional()
      .refine((id) => !id || validateObjectId(id), {
        error: "Job ID must be a valid MongoDB ObjectId",
      }),
    sortBy: z
      .enum(["createdAt", "status", "expectedSalary"], {
        error: "Sort by must be one of: createdAt, status, expectedSalary",
      })
      .default("createdAt"),
    sortOrder: z
      .enum(["asc", "desc"], {
        error: "Sort order must be either asc or desc",
      })
      .default("desc"),
  },
  { error: "Query parameters must be valid" },
);

export type TApplicationStatus = z.infer<typeof ApplicationStatusEnum>;
export type TCreateApplicationInput = z.infer<typeof CreateApplicationSchema>;
export type TUpdateApplicationStatusInput = z.infer<
  typeof UpdateApplicationStatusSchema
>;
export type TApplicationQuery = z.infer<typeof ApplicationQuerySchema>;
