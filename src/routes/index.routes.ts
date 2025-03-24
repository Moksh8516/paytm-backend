import { Router } from "express"
const router:Router = Router()

import authRoutes from "./auth.routes"
router.use("/user",authRoutes)

export default router;