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
    const token = req.header("Authorization")?.replace("Bearer ", "")
    if(!token){
      console.log("JWT verifcation failed")
      res.status(403).json({error: "Access denied. No token provided."})
      return;
    }
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
