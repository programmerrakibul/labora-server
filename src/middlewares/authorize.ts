import type { Role } from "@/user/interface/user.js";
import type { NextFunction, Request, Response } from "express";
import { ForbiddenError, UnauthorizedError } from "http-errors-enhanced";

export const authorize = (...allowedRoles: Role[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const { user } = req;

    if (!user) {
      throw new UnauthorizedError(
        "To perform this action, you must be authenticated.",
      );
    }

    if (!allowedRoles.includes(user.role)) {
      throw new ForbiddenError(
        "You are not authorized to perform this action.",
      );
    }

    next();
  };
};
