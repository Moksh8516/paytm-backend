import mongoose from "mongoose"
export default async function connection(){
  try {
    const conn = await mongoose.connect(`${process.env.MONGODB_URL}/paytm`)
    console.log("MongoDB Connected", conn.connection.host);
  } catch (error) {
    console.log("Something went wrong in mongoDb connection ", error);
    process.exit(1);
  }
}