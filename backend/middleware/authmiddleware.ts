import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const SECRET = "secretkey";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const authmiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;

  if (!token) {
    res.status(401).json({ message: " No token provided" });
    return;
  }
  try {
    const decode = jwt.verify(token, SECRET);

    req.user = decode;
    console.log("USER:", req.user);
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

export default authmiddleware;
