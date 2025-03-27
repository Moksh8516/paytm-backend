import mongoose, { ObjectId } from "mongoose";
import { Account } from "../models/auth.model";
import { asyncHandler } from "../utils/asyncHandler";

export const balance = asyncHandler(async(req,res)=>{
  let account = await Account.findOne({
    userId : req.userId,
  })

  if(!account){
    res.status(404).json({
      message:"account doesnot exist"
    })
    return 
  }

   res.status(200).json({
    currentBalance:account?.balance,
    message:"fetch balance"
  })
})

interface AccountInt {
  _id: ObjectId;
  userId: ObjectId;
  balance: number;
}


// export const transfer = asyncHandler(async(req,res)=>{
//   const session = await mongoose.startSession();
//   session.startTransaction();
//   const {amount, to}= req.body;
//   let money = parseFloat(amount)

//   // Account from
//   const account= await Account.findOne({userId:req.userId}).session(session) as AccountInt | null;
//   if(!account || account.balance<money){
//     await session.abortTransaction();
//     res.status(400).json({message:"Insufficent balance"});
//     return
//   }
//   // ToAccount  
//   const toAccount = await Account.findOne({userId:to}).session(session);

//   if(!toAccount){
//     await session.abortTransaction();
//     res.status(404).json({message:"Account does not exist"});
//     return;
//   }
// // ----------- Perform Tranaction ---------------
//   // from Account
//   await Account.findByIdAndUpdate(
//     {userId:req.userId},
//     {
//     $inc:{
//       balance:-money
//     }
//   }).session(session);

//   // to Account
//   await Account.findByIdAndUpdate(
//     {userId:to},
//     {
//     $inc:{
//       balance:money
//     }
//   }).session(session);

//   await session.commitTransaction();
//   res.status(200).json({message:"Transfer Successfull"});
// })

export const transfer = asyncHandler(async(req,res)=>{
  const session = await mongoose.startSession();
  session.startTransaction();
 try {
   const {amount, to}= req.body;
   let money = parseFloat(amount);
    // Step 1 Debit balance 
    const account= await Account.findOneAndUpdate({userId:req.userId, balance:{
     $gte:money
    }},{$inc:{
     balance:-money
    },
 },{
   session:session,
   new:true,
 });

 if(!account){
   throw new Error("Insufficent balance")
 }
 // step 2 credit balance
 const toAccount = await Account.findOneAndUpdate({userId:to},{
   $inc:{
     balance:money
   }
 },{
   session:session,
   new:true
 })
 if(!toAccount){
   throw new Error("Invalid Account")
 }
 await session.commitTransaction();
 res.status(200).json({message:"Transfer Successfull"});
 } catch (error) {
  await session.abortTransaction();
  res.status(400).json({message:error})
 }finally{
  session.endSession();
 }
});

