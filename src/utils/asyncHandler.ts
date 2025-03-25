import { NextFunction, Request, Response } from "express"

export const asyncHandler = (reqHandler:(req:Request, res:Response, next:NextFunction)=>Promise<Response>)=>{
return(req:Request, res:Response, next:NextFunction)=>{
  Promise.resolve(reqHandler(req,res,next)).then(response=>{return response}).catch((error)=>next(error))
}
}