import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName:{
    type:String,
    require:true,
    lowercase:true,
  },
  lastName:{
    type:String,
    lowercase:true,
  },
  userName:{
    type:String,
    unique:true,
    lowercase:true,
    require:true
  },
  email:{
    type:String,
    require:true,
  },
  password:{
    type:String,
  },
  role:{
    type:String,
    enum:["admin","user"],
    default:"user"
  }
}, {timestamps:true});

export const User = mongoose.model("User", userSchema);
