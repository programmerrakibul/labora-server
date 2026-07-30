import "dotenv/config";
import { UnprocessableEntityError } from "http-errors-enhanced";
import z from "zod";

export const NODE_ENV = {
  DEVELOPMENT: "development",
  PRODUCTION: "production",
  TEST: "test",
} as const;

const envSchema = z.object(
  {
    NODE_ENV: z.preprocess(
      (value) => {
        if (typeof value !== "string") return false;

        return value.trim().toLowerCase();
      },

      z.enum(Object.values(NODE_ENV), {
        error: "NODE_ENV must be one of: development, production, test",
      }),
    ),

    PORT: z.coerce
      .number({ error: "PORT must be a valid number" })
      .default(8000),

    MONGODB_URI: z
      .string({ error: "MONGODB_URI is required" })
      .trim()
      .min(1, { error: "MONGODB_URI cannot be empty" }),

    DB_NAME: z.string({ error: "DB_NAME must be a string" }).default("labora"),

    CLIENT_URL: z
      .string({ error: "CLIENT_URL is required" })
      .trim()
      .min(1, { error: "CLIENT_URL cannot be empty" }),

    BETTER_AUTH_SECRET: z
      .string({ error: "BETTER_AUTH_SECRET is required" })
      .trim()
      .min(1, { error: "BETTER_AUTH_SECRET cannot be empty" }),

    BETTER_AUTH_URL: z
      .string({ error: "BETTER_AUTH_URL is required" })
      .trim()
      .min(1, { error: "BETTER_AUTH_URL cannot be empty" }),

    CLOUDINARY_CLOUD_NAME: z
      .string({ error: "CLOUDINARY_CLOUD_NAME is required" })
      .trim()
      .min(1, { error: "CLOUDINARY_CLOUD_NAME cannot be empty" }),

    CLOUDINARY_API_KEY: z
      .string({ error: "CLOUDINARY_API_KEY is required" })
      .trim()
      .min(1, { error: "CLOUDINARY_API_KEY cannot be empty" }),

    CLOUDINARY_API_SECRET: z
      .string({ error: "CLOUDINARY_API_SECRET is required" })
      .trim()
      .min(1, { error: "CLOUDINARY_API_SECRET cannot be empty" }),

    GOOGLE_CLIENT_ID: z
      .string({ error: "GOOGLE_CLIENT_ID is required" })
      .trim()
      .min(1, { error: "GOOGLE_CLIENT_ID cannot be empty" }),

    GOOGLE_CLIENT_SECRET: z
      .string({ error: "GOOGLE_CLIENT_SECRET is required" })
      .trim()
      .min(1, { error: "GOOGLE_CLIENT_SECRET cannot be empty" }),
  },
  {
    error: "Environment configuration is invalid. Please check your .env file.",
  },
);

export const getEnv = () => {
  const { success, data, error } = envSchema.safeParse(process.env);

  if (!success) {
    const errors = error.issues.map((issue) => issue.message).join(", ");
    throw new UnprocessableEntityError(errors);
  }

  return data;
};
