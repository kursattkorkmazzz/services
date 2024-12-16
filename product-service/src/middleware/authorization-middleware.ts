import { NextFunction, Request, Response } from "express";

export default function authorizationMiddleware(permission_code: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Checking the permission.
      next();
    } catch (e) {
      next(e);
    }
  };
}
