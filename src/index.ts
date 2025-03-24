import { app } from "./app";
import connection from "./DB/connection";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env"
})

const PORT = process.env.PORT || 4050;
connection().then(()=>{
  app.on("error",(ERR)=>{
    console.log("ERROR occuried in Express", ERR);
    process.exit(1);
     })
  app.listen(PORT, ()=>{
    console.log("Application is listen on Port No", PORT);
  });
}).catch((err)=>{
console.log("MONGODB Failed to connect", err);
})
