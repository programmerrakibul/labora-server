import type { TTokenUser } from "@/user/interface/user.ts";

declare global {
  namespace Express {
    interface Request {
      user?: TTokenUser;
    }
  }
}
