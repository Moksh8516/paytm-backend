import {Router} from "express";
import { balance, transfer } from "../controllers/transaction.controller";
import { verifyJWT } from "../middleware/auth.middleware";

const router:Router = Router();

router.route("/balance").post(verifyJWT, balance);
router.route("/transfer").post(verifyJWT, transfer);

export default router;
