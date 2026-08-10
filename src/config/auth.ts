import { getNativeDb } from "@/config/db.js";
import { getEnv } from "@/config/env.js";
import { Role } from "@/modules/user/interface/user.js";
import { toObjectIdString } from "@/utils/utils.js";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { betterAuth } from "better-auth/minimal";
import { bearer, customSession } from "better-auth/plugins";

const env = getEnv();

export const initAuth = () => {
  return betterAuth({
    database: mongodbAdapter(getNativeDb()),

    plugins: [
      bearer(),
      customSession(async ({ user, session }) => {
        return {
          user: {
            ...user,
            companyId: toObjectIdString((user as any).companyId),
          },
          session,
        };
      }),
    ],

    appName: "Labora - An Online Job Marketplace Platform",

    emailAndPassword: {
      enabled: true,
    },

    baseURL: env.BETTER_AUTH_URL,

    socialProviders: {
      google: {
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
      },
    },

    trustedOrigins: [env.CLIENT_URL],

    user: {
      additionalFields: {
        role: {
          type: "string",
          defaultValue: Role.JOB_SEEKER,
          input: false,
          index: true,
          required: true,
        },

        companyId: {
          type: "string",
          required: false,
          input: false,
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
