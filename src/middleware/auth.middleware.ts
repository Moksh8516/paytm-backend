import { NextFunction, Response, Request } from "express";
import JWT, { JwtPayload, Secret } from "jsonwebtoken"
import { JWT_SECRET } from "../utils/config";
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const verifyJWT = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    // ✅ Check if Authorization header exists and starts with "Bearer "
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("JWT verification failed: Missing or incorrect token format");
      res.status(403).json({ message: "Invalid Token" });
      return 
    }

    const token = authHeader.split(" ")[1];
    const decodedToken = JWT.verify(token, JWT_SECRET as Secret) as JwtPayload;
    if (!decodedToken || !decodedToken.id) {
      console.log("JWT verification failed: Invalid payload");
      res.status(403).json({ message: "Invalid Token" });
      return 
    }

    req.userId = decodedToken.id;
    next();
  } catch (error: any) {
    console.error("JWT verification error:", error.message);
  }
};
