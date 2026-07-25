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

export const ApplicationStatusEnum = z.enum(Object.values(APPLICATION_STATUS));

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

export type TApplicationStatus = z.infer<typeof ApplicationStatusEnum>;
export type TCreateApplicationInput = z.infer<typeof CreateApplicationSchema>;
