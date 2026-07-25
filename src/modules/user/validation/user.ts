import { z } from "zod";
import { Role } from "../interface/user.js";

export const RoleEnum = z.enum(Object.values(Role), {
  error: "Role must be one of: JOB_SEEKER, RECRUITER, ADMIN",
});

export const UpdateProfileSchema = z.object(
  {
    name: z
      .string({ error: "Name must be a string" })
      .trim()
      .min(1, { error: "Name cannot be empty" })
      .max(100, { error: "Name cannot exceed 100 characters" })
      .optional(),
    image: z.string({ error: "Image must be a string" }).trim().optional(),
    phoneNumber: z
      .string({ error: "Phone number must be a string" })
      .trim()
      .optional(),
    address: z.string({ error: "Address must be a string" }).trim().optional(),
    city: z.string({ error: "City must be a string" }).trim().optional(),
    country: z.string({ error: "Country must be a string" }).trim().optional(),
  },
  { error: "Profile data must be a valid object" },
);

export const UpdateUserRoleSchema = z.object(
  {
    role: RoleEnum,
  },
  { error: "Role update must include a valid role field" },
);

export const UpdateUserStatusSchema = z.object(
  {
    isActive: z.boolean({ error: "isActive must be a boolean" }),
  },
  { error: "Status update must include isActive field" },
);

export const UserQuerySchema = z.object(
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
    role: RoleEnum.optional(),
    isActive: z.coerce
      .boolean({ error: "isActive filter must be a boolean" })
      .optional(),
    sortBy: z
      .enum(["createdAt", "name", "email"], {
        error: "Sort by must be one of: createdAt, name, email",
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

export type TUpdateProfileInput = z.infer<typeof UpdateProfileSchema>;
export type TUpdateUserRoleInput = z.infer<typeof UpdateUserRoleSchema>;
export type TUpdateUserStatusInput = z.infer<typeof UpdateUserStatusSchema>;
export type TUserQuery = z.infer<typeof UserQuerySchema>;
