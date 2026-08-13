import { z } from "zod";

export const COMPANY_STATUS = {
  ACTIVE: "ACTIVE",
  SUSPENDED: "SUSPENDED",
} as const;

export const MEMBERSHIP_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  REMOVED: "REMOVED",
} as const;

export const CompanyStatusEnum = z.enum(Object.values(COMPANY_STATUS), {
  error: "Company status must be one of: ACTIVE, SUSPENDED",
});

export const MembershipStatusEnum = z.enum(Object.values(MEMBERSHIP_STATUS), {
  error:
    "Membership status must be one of: PENDING, APPROVED, REJECTED, REMOVED",
});

const LocationSchema = z
  .object({
    city: z.string({ error: "City must be a string" }).trim().optional(),
    state: z.string({ error: "State must be a string" }).trim().optional(),
    country: z.string({ error: "Country must be a string" }).trim().optional(),
  })
  .optional();

export const CreateCompanySchema = z.object(
  {
    name: z
      .string({ error: "Company name is required" })
      .trim()
      .min(1, { error: "Company name cannot be empty" })
      .max(150, { error: "Company name cannot exceed 150 characters" }),

    email: z
      .string({ error: "Email is required" })
      .trim()
      .email({ error: "Email must be a valid email address" })
      .min(1, {
        error: "Email is required",
      })
      .transform((email) => email.toLowerCase()),

    website: z
      .string({ error: "Website must be a string" })
      .trim()
      .url({ error: "Website must be a valid URL" })
      .optional(),

    industry: z
      .string({ error: "Industry must be a string" })
      .trim()
      .optional(),

    about: z
      .string({ error: "About must be a string" })
      .trim()
      .max(2000, { error: "About cannot exceed 2000 characters" })
      .optional(),

    location: LocationSchema,

    logo: z.string({ error: "Logo must be a string" }).trim().optional(),
  },
  { error: "Company data must be a valid object" },
);

export const UpdateCompanySchema = CreateCompanySchema.partial();

export const UpdateCompanyStatusSchema = z.object(
  {
    status: CompanyStatusEnum,
  },
  { error: "Status update must include a valid status field" },
);

export const RespondToRequestSchema = z.object(
  {
    status: z.enum(["APPROVED", "REJECTED"], {
      error: "Status must be either APPROVED or REJECTED",
    }),
  },
  { error: "Request response must include a valid status field" },
);

export const CompanyQuerySchema = z.object(
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

    sortBy: z
      .enum(["createdAt", "name"], {
        error: "Sort by must be one of: createdAt, name",
      })
      .default("createdAt"),

    sortOrder: z
      .enum(["asc", "desc"], {
        error: "Sort order must be either asc or desc",
      })
      .default("desc"),

    isAdmin: z.coerce
      .boolean({ error: "isAdmin must be a boolean" })
      .optional(),

    status: CompanyStatusEnum.optional(),
  },
  { error: "Query parameters must be valid" },
);

export const PageLimitSchema = z.object(
  {
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
  },
  { error: "Query parameters must be valid" },
);

export type TCompanyStatus = z.infer<typeof CompanyStatusEnum>;
export type TMembershipStatus = z.infer<typeof MembershipStatusEnum>;
export type TCreateCompanyInput = z.infer<typeof CreateCompanySchema>;
export type TUpdateCompanyInput = z.infer<typeof UpdateCompanySchema>;
export type TRespondToRequestInput = z.infer<typeof RespondToRequestSchema>;
export type TCompanyQuery = z.infer<typeof CompanyQuerySchema>;
export type TPageLimit = z.infer<typeof PageLimitSchema>;
