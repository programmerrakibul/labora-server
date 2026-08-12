import { initAuth } from "@/config/auth.js";
import type { Role } from "@/user/interface/user.js";
import type { NextFunction, Request, Response } from "express";

export const verifyToken = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const session = await initAuth().api.getSession({
    headers: req.headers as HeadersInit,
  });

  if (session?.user) {
    req.user = {
      id: session.user.id,
      email: session.user.email,
      role: session.user.role as Role,
      companyId: session.user.companyId || null,
    };
  }

  next();
};
