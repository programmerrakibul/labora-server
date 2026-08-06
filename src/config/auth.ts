import { getNativeDb } from "@/config/db.js";
import { getEnv } from "@/config/env.js";
import { Role } from "@/modules/user/interface/user.js";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { getOAuthState } from "better-auth/api";
import { betterAuth } from "better-auth/minimal";
import { bearer } from "better-auth/plugins";

const env = getEnv();

export const initAuth = () => {
  return betterAuth({
    database: mongodbAdapter(getNativeDb()),

    plugins: [bearer()],

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
    advanced: {
      useSecureCookies: true,
      defaultCookieAttributes: {
        sameSite: "none",
        secure: true,
        httpOnly: true,
        partitioned: true,
      },
    },

    databaseHooks: {
      user: {
        create: {
          before: async (user, ctx) => {
            if (ctx?.path === "/callback/:id") {
              const additionalData = await getOAuthState();

              return {
                data: {
                  ...user,
                  role: additionalData?.role || Role.JOB_SEEKER,
                },
              };
            }

            return { data: user };
          },
        },
      },
    },

    user: {
      additionalFields: {
        role: {
          type: [Role.JOB_SEEKER, Role.RECRUITER, Role.ADMIN],
          defaultValue: Role.JOB_SEEKER,
          input: true,
          index: true,
          required: true,
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
