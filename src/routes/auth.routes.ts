import { Router } from "express";
import { bulkdata, signin, signup } from "../controllers/auth.controller";
import { asyncHandler } from "../utils/asyncHandler";
const router:Router = Router();

router.route('/signup').post(signup);
router.route('/login').post(asyncHandler(signin));
router.route('/bulk').get(bulkdata);

export default router;