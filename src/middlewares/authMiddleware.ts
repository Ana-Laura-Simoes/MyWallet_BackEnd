import { Request, Response, NextFunction } from "express";
import * as userService from "../services/userService";

export default async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authorization = req.headers["authorization"];
  const token = authorization?.split("Bearer ")[1];

  const user = await userService.validateSession(token);

  if (!user) {
    console.log(authorization);
    return res.sendStatus(401);
  } else {
    res.locals.userId = user.id;
    next();
  }
}
