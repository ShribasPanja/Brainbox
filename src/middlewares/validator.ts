import dotenv from "dotenv";
import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET as string;
interface AuthRequest extends Request {
  user?: string | object;
}
export const validatorMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    console.log(authHeader);
    const token = authHeader?.split(" ")[1] as string;
    console.log(token);
    const decoded = jwt.verify(token, `${JWT_SECRET}`) as JwtPayload;
    if (decoded) {
      console.log(decoded);
      next();
    } else {
      res.status(403).json({ msg: "you are not authenticated" });
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({ msg: "invalid token" });
  }
};
