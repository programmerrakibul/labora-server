import { getNativeDb } from "@/config/db.js";
import { getEnv } from "@/config/env.js";
import { Role } from "@/modules/user/interface/user.js";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { betterAuth } from "better-auth/minimal";
import { bearer } from "better-auth/plugins";

const { BETTER_AUTH_SECRET, BETTER_AUTH_URL } = getEnv();

export const initAuth = () => {
  return betterAuth({
    database: mongodbAdapter(getNativeDb()),

    plugins: [bearer()],

    appName: "Labora - An Online Job Marketplace Platform",
    emailAndPassword: {
      enabled: true,
    },

    secret: BETTER_AUTH_SECRET,
    baseURL: BETTER_AUTH_URL,

    user: {
      additionalFields: {
        role: {
          type: [Role.JOB_SEEKER, Role.EMPLOYER, Role.ADMIN],
          defaultValue: Role.JOB_SEEKER,
          input: false,
          index: true,
          required: false,
        },

        phoneNumber: {
          type: "string",
          defaultValue: "",
          required: false,
          input: true,
        },

        address: {
          type: "string",
          defaultValue: "",
          required: false,
          input: true,
        },

        city: {
          type: "string",
          defaultValue: "",
          required: false,
          input: true,
        },

        country: {
          type: "string",
          defaultValue: "",
          required: false,
          input: true,
        },

        isActive: {
          type: "boolean",
          defaultValue: true,
          required: false,
          input: false,
          returned: false,
        },
      },
    },
  });
};
