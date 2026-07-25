import { z } from "zod";

export const JOB_TYPE = {
  FULL_TIME: "FULL_TIME",
  PART_TIME: "PART_TIME",
  CONTRACT: "CONTRACT",
  INTERNSHIP: "INTERNSHIP",
  FREELANCE: "FREELANCE",
  HOURLY: "HOURLY",
} as const;

export const LOCATION_TYPE = {
  ON_SITE: "ON_SITE",
  HYBRID: "HYBRID",
  REMOTE: "REMOTE",
} as const;

export const EXPERIENCE_LEVEL = {
  ENTRY_LEVEL: "ENTRY_LEVEL",
  MID_LEVEL: "MID_LEVEL",
  SENIOR_LEVEL: "SENIOR_LEVEL",
  EXECUTIVE: "EXECUTIVE",
} as const;

export const JOB_STATUS = {
  DRAFT: "DRAFT",
  ACTIVE: "ACTIVE",
  PAUSED: "PAUSED",
  CLOSED: "CLOSED",
} as const;

export const CURRENCY_TYPE = {
  USD: "USD",
  EUR: "EUR",
  GBP: "GBP",
  BDT: "BDT",
} as const;

export const JobTypeEnum = z.enum(Object.values(JOB_TYPE));

export const WorkLocationEnum = z.enum(Object.values(LOCATION_TYPE));

export const ExperienceLevelEnum = z.enum(Object.values(EXPERIENCE_LEVEL));

export const JobStatusEnum = z.enum(Object.values(JOB_STATUS));

export const CurrencyEnum = z.enum(Object.values(CURRENCY_TYPE));

const SalaryRangeSchema = z.object({
  min: z.number().min(0),
  max: z.number().min(0),
  currency: CurrencyEnum.default(CURRENCY_TYPE.BDT),
  isNegotiable: z.boolean().default(false),
});

const LocationSchema = z.object({
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
});

export const CreateJobSchema = z.object({
  title: z.string().trim().min(1).max(100),
  company: z.string().trim().min(1),
  description: z.string().trim().min(1),
  requirements: z.array(z.string().trim()).default([]),
  responsibilities: z.array(z.string().trim()).default([]),
  skills: z.array(z.string().trim()).default([]),
  jobType: JobTypeEnum,
  workLocationType: WorkLocationEnum,
  experienceLevel: ExperienceLevelEnum,
  location: LocationSchema.optional(),
  salary: SalaryRangeSchema.optional(),
  category: z.string().trim().min(1),
  tags: z.array(z.string().trim()).default([]),
  status: JobStatusEnum.default(JOB_STATUS.ACTIVE),
  expiresAt: z.coerce.date().optional(),
});

export const UpdateJobSchema = CreateJobSchema.partial();

export const UpdateJobStatusSchema = z.object({
  status: JobStatusEnum,
});

export const JobQuerySchema = z.object({
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
  category: z.string().optional(),
  experienceLevel: ExperienceLevelEnum.optional(),
  jobType: JobTypeEnum.optional(),
  workLocationType: WorkLocationEnum.optional(),
  status: JobStatusEnum.optional(),
  minSalary: z.coerce.number().min(0).optional(),
  maxSalary: z.coerce.number().min(0).optional(),
  sortBy: z
    .enum(["createdAt", "title", "salary.min", "salary.max"])
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type TJobType = z.infer<typeof JobTypeEnum>;
export type TWorkLocation = z.infer<typeof WorkLocationEnum>;
export type TExperienceLevel = z.infer<typeof ExperienceLevelEnum>;
export type TJobStatus = z.infer<typeof JobStatusEnum>;
export type TCreateJobInput = z.infer<typeof CreateJobSchema>;
export type TUpdateJobInput = z.infer<typeof UpdateJobSchema>;
export type TUpdateJobStatusInput = z.infer<typeof UpdateJobStatusSchema>;
export type TJobQuery = z.infer<typeof JobQuerySchema>;
