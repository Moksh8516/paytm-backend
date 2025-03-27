import { Router } from "express"
const router:Router = Router()

import authRoutes from "./auth.routes"
import transactionRoutes from "./Transaction.routes"
router.use("/user",authRoutes)
router.use("/account",transactionRoutes)

export default router;

// "allowSyntheticDefaultImports": true 
    /* 
    example main.ts
 import myModule from './myModule';
 myModule.foo(); 
  Error: Property 'foo' does not exist on type 'typeof myModule'.
   Allow 'import x from y' when a module doesn't have a default export. 
   */