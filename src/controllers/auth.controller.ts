import { Response, Request } from "express";
import {z} from "zod";
import bcrypt from "bcryptjs"
import { User } from "../models/auth.model";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler";
import dotenv from "dotenv";
dotenv.config()

const userSchema = z.object({
  userName: z.string(),
  email: z.string().email({message:"provide valid email"}),
  password: z.string().min(8,{message:"min length is 8"}),
  firstName: z.string(),
  lastName: z.string(),
})

const generateToken = (user:any)=>{
  const token = jwt.sign({id:user._id,userName:user.userName},
    process.env.JWT_SECRET??"",
    {
      expiresIn:"1h",
    })
    return token;
}

export const signup = asyncHandler(async (req, res) => {
  const result = userSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ message: "invalid data" });
  }
  const { userName, email, password, firstName, lastName } = result.data;
  const existingUser  = await User.findOne({
    $or: [
      { email },
      { userName },
    ]
  });
  if (existingUser ) {
    return res.status(409).json({ message: "user already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    userName,
    firstName,
    lastName,
    email,
    password: hashedPassword
  });
  if (!user) {
    return res.status(500).json({ message: "failed to create user" });
  }

  return res.status(201).json({
    message: "user created successfully",
    user
  });
});

const signInSchema=z.object({
  email:z.string().email().optional(),
  userName:z.string().optional(),
  password:z.string().min(8),
})

export async function signin(req:Request, res:Response){
  const result = signInSchema.safeParse(req.body);
  if(!result.success){
   return res.status(411).json({message:"Input required"});
  }
  const {email,userName,password}= result.data;

  if(!(email ||userName)){
    return res.status(411).json({message:"Email and username are required"})
  }
  const user = await User.findOne({
    $or: [
      {email},{userName}
    ]});

    if(!user){
      return res.status(401).json({message:"invalid email or username"})
    }

    //@ts-ignore
    const isValidPassword = await bcrypt.compare(password,user.password);

    if(!isValidPassword){
      return res.status(401).json({message:"invalid password"})
    }

    let token = generateToken(user);
    let userloggedIn = await User.findById(user._id).select("-password")
    return res.status(200).json({
      message:"signed in successfully",
      token,
      user:userloggedIn
    })
}

export const bulkdata = asyncHandler(async(req, res)=>{
  const {filter} = req.query;
  const data = await User.find({
    $or: [
      {
        firstName:{
          $regex:filter,
        }
      },
      {
        lastName:{
          $regex:filter,
        }
      }
    ]
  })
  if(!data){
    return res.status(404).json({message:"No data found"})
  }
  
  return res.status(200).json({
    user:data.map((user)=>({
      userName:user.userName,
      email:user.email,
      firstName:user.firstName,
      lastName:user.lastName
    })
  )
  })
})