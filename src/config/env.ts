import "dotenv/config";
import { UnprocessableEntityError } from "http-errors-enhanced";
import z from "zod";

export const NODE_ENV = {
  DEVELOPMENT: "development",
  PRODUCTION: "production",
  TEST: "test",
} as const;

const envSchema = z.object({
  NODE_ENV: z.preprocess(
    (value) => {
      if (typeof value !== "string") return false;

      return value.trim().toLowerCase();
    },

    z.enum(
      Object.values(NODE_ENV),
      "Please provide a valid NODE_ENV in env file!",
    ),
  ),

  PORT: z.coerce
    .number("Please provide a valid PORT number in env file!")
    .default(8000),

  MONGODB_URI: z
    .string("Please provide a valid MONGODB_URI in env file!")
    .trim()
    .min(1, "Please provide a valid MONGODB_URI in env file!"),

  DB_NAME: z
    .string("Please provide a valid DB_NAME in env file!")
    .default("labora"),

  CLIENT_URL: z
    .string("Please provide a valid CLIENT_URL in env file!")
    .min(1, "Please provide a valid CLIENT_URL in env file!"),

  BETTER_AUTH_SECRET: z
    .string("Please provide a valid BETTER_AUTH_SECRET in env file!")
    .min(1, "Please provide a valid BETTER_AUTH_SECRET in env file!"),

  BETTER_AUTH_URL: z
    .string("Please provide a valid BETTER_AUTH_URL in env file!")
    .min(1, "Please provide a valid BETTER_AUTH_URL in env file!"),
});

export const getEnv = () => {
  const { success, data, error } = envSchema.safeParse(process.env);

  if (!success) {
    const errors = error.issues.map((issue) => issue.message).join(", ");
    throw new UnprocessableEntityError(errors);
  }

  return data;
};
