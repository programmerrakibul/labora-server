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

export const JobTypeEnum = z.enum(Object.values(JOB_TYPE), {
  error:
    "Job type must be one of: FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP, FREELANCE, HOURLY",
});

export const WorkLocationEnum = z.enum(Object.values(LOCATION_TYPE), {
  error: "Work location type must be one of: ON_SITE, HYBRID, REMOTE",
});

export const ExperienceLevelEnum = z.enum(Object.values(EXPERIENCE_LEVEL), {
  error:
    "Experience level must be one of: ENTRY_LEVEL, MID_LEVEL, SENIOR_LEVEL, EXECUTIVE",
});

export const JobStatusEnum = z.enum(Object.values(JOB_STATUS), {
  error: "Job status must be one of: DRAFT, ACTIVE, PAUSED, CLOSED",
});

export const CurrencyEnum = z.enum(Object.values(CURRENCY_TYPE), {
  error: "Currency must be one of: USD, EUR, GBP, BDT",
});

const SalaryRangeSchema = z.object(
  {
    min: z
      .number({ error: "Minimum salary must be a number" })
      .min(0, { error: "Minimum salary cannot be negative" }),
    max: z
      .number({ error: "Maximum salary must be a number" })
      .min(0, { error: "Maximum salary cannot be negative" }),
    currency: CurrencyEnum.default(CURRENCY_TYPE.BDT),
    isNegotiable: z
      .boolean({ error: "isNegotiable must be a boolean" })
      .default(false),
  },
  {
    error:
      "Salary must be a valid object with min, max, currency, and isNegotiable fields",
  },
);

const LocationSchema = z.object(
  {
    city: z.string({ error: "City must be a string" }).trim().optional(),
    state: z.string({ error: "State must be a string" }).trim().optional(),
    country: z.string({ error: "Country must be a string" }).trim().optional(),
  },
  {
    error:
      "Location must be a valid object with city, state, and country fields",
  },
);

export const CreateJobSchema = z.object(
  {
    title: z
      .string({ error: "Job title is required" })
      .trim()
      .min(1, { error: "Job title cannot be empty" })
      .max(100, { error: "Job title cannot exceed 100 characters" }),
    description: z
      .string({ error: "Job description is required" })
      .trim()
      .min(1, { error: "Job description cannot be empty" }),
    requirements: z
      .array(z.string({ error: "Each requirement must be a string" }).trim(), {
        error: "Requirements must be an array",
      })
      .default([]),
    responsibilities: z
      .array(
        z.string({ error: "Each responsibility must be a string" }).trim(),
        { error: "Responsibilities must be an array" },
      )
      .default([]),
    skills: z
      .array(z.string({ error: "Each skill must be a string" }).trim(), {
        error: "Skills must be an array",
      })
      .default([]),
    jobType: JobTypeEnum,
    workLocationType: WorkLocationEnum,
    experienceLevel: ExperienceLevelEnum,
    location: LocationSchema.optional(),
    salary: SalaryRangeSchema.optional(),
    category: z
      .string({ error: "Job category is required" })
      .trim()
      .min(1, { error: "Job category cannot be empty" }),
    tags: z
      .array(z.string({ error: "Each tag must be a string" }).trim(), {
        error: "Tags must be an array",
      })
      .default([]),
    status: JobStatusEnum.default(JOB_STATUS.ACTIVE),
    expiresAt: z.coerce
      .date({ error: "Expiry date must be a valid date" })
      .optional(),
  },
  { error: "Job data must be a valid object" },
);

export const UpdateJobSchema = CreateJobSchema.partial();

export const UpdateJobStatusSchema = z.object(
  {
    status: JobStatusEnum,
  },
  { error: "Status update must include a valid status field" },
);

export const JobQuerySchema = z.object(
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
    category: z.string({ error: "Category must be a string" }).optional(),
    experienceLevel: ExperienceLevelEnum.optional(),
    jobType: JobTypeEnum.optional(),
    workLocationType: WorkLocationEnum.optional(),
    status: JobStatusEnum.optional(),
    minSalary: z.coerce
      .number({ error: "Minimum salary filter must be a number" })
      .min(0, { error: "Minimum salary filter cannot be negative" })
      .optional(),
    maxSalary: z.coerce
      .number({ error: "Maximum salary filter must be a number" })
      .min(0, { error: "Maximum salary filter cannot be negative" })
      .optional(),
    sortBy: z
      .enum(["createdAt", "title", "salary.min", "salary.max"], {
        error:
          "Sort by must be one of: createdAt, title, salary.min, salary.max",
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

export type TJobType = z.infer<typeof JobTypeEnum>;
export type TWorkLocation = z.infer<typeof WorkLocationEnum>;
export type TExperienceLevel = z.infer<typeof ExperienceLevelEnum>;
export type TJobStatus = z.infer<typeof JobStatusEnum>;
export type TCreateJobInput = z.infer<typeof CreateJobSchema>;
export type TUpdateJobInput = z.infer<typeof UpdateJobSchema>;
export type TUpdateJobStatusInput = z.infer<typeof UpdateJobStatusSchema>;
export type TJobQuery = z.infer<typeof JobQuerySchema>;
