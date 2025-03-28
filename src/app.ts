import express from "express";
import cors from "cors"
const app = express();

app.use(express.json({
  limit:"50kb"
}));

app.use(express.urlencoded({
  extended: true,
  limit:"50kb"
}))

app.use(cors());
import mainRouter from "./routes/index.routes"
// import authRouter from "./routes/auth.routes"
app.use("/api/v1",mainRouter );

export {app};