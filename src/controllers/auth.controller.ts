import { Response, Request } from "express";
import {z} from "zod";
import bcrypt from "bcryptjs"
import { Account, User } from "../models/auth.model";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler";
import dotenv from "dotenv";
import { error } from "console";
dotenv.config()

const userSchema = z.object({
  userName: z.string().min(3),
  email: z.string().email({message:"provide valid email"}),
  password: z.string().min(8,{message:"min length is 8"}),
  firstName: z.string().min(3),
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
    const errors = result.error.issues.map((issue)=>({
      field: issue.path[0],
      message: issue.message,
    }))
    res.status(411).json({ message: "invalid Inputs", errors });
    return;
  }
  const { userName, email, password, firstName, lastName } = result.data;
  const existingUser  = await User.findOne({
    $or: [
      { email },
      { userName },
    ]
  });
  if (existingUser ) {
    res.status(409).json({ message: "user already exists" });
    return 
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
    res.status(500).json({ message: "failed to create user" });
    return
  }

  res.status(201).json({
    message: "user created successfully",
    user
  });
});

const signInSchema=z.object({
  userName:z.string({message:"field is required"}).min(3).optional(),
  password:z.string().min(8),
})

export async function signin(req:Request, res:Response){
  const result = signInSchema.safeParse(req.body);
  if(!result.success){
    const errors = result.error.issues.map((issue)=>({
      field: issue.path[0],
      message: issue.message,
    }))
    res.status(411).json({message:"Input required", errors});
   return 
  }
  const {userName,password}= result.data;
  
  if(!userName){
    res.status(411).json({message:"Email and username are required"})
    return
  }
  const user = await User.findOne({
    $or: [
      {email:userName},{userName}
    ]});

    if(!user){
      res.status(401).json({message:"invalid email or username"})
      return
    }

    //@ts-ignore
    const isValidPassword = await bcrypt.compare(password,user.password);

    if(!isValidPassword){
      res.status(401).json({message:"invalid password"})
      return 
    }

    let token = generateToken(user);
    await Account.create({
      userId:user._id,
      balance: 1+Math.random()*10000
    })

    let userloggedIn = await User.findById(user._id).select("-password")
    res.status(200).json({
      message:"signed in successfully",
      token,
      user:userloggedIn
    })
}

export const bulkdata = asyncHandler(async(req, res)=>{
  const filter = req.query.filter || "";
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
    ],
    _id:{$ne : req.userId},
  })
  if(!data){
    res.status(404).json({message:"No data found"})
    return;
  }
  
   res.status(200).json({
    user:data.map((user)=>({
      id:user._id,
      userName:user.userName,
      email:user.email,
      firstName:user.firstName,
      lastName:user.lastName
    })
  )
  })
})

export const getUser = asyncHandler(async(req,res)=>{
  const response = await User.findById(req.userId).select("-password")
  if(!response){
    res.status(404).json({message:"User not found"})
    return;
  }
  res.status(200).json({message:"user found", response })
})