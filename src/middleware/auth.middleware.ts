import { NextFunction, Response, Request } from "express";
import JWT, { JwtPayload, Secret } from "jsonwebtoken"
import { JWT_SECRET } from "../utils/config";

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

export const verifyJWT = async(req:Request, res:Response, next:NextFunction)=>{
  const authHeader = req.headers['authorization']||"";
  if(!authHeader||!authHeader.startsWith('Bearer ')){
    return res.status(403).json({message:"Invalid Token"})
  }
  const token = authHeader.split(' ')[1];
    const decodeToken = JWT.verify(token,JWT_SECRET as Secret) as JwtPayload
    if(!decodeToken){
      return res.status(403).json({message:"Invalid Token"})
    }
    req.userId = decodeToken?._id
    next();
}

