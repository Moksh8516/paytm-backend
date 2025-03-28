import { Router } from "express";
import { bulkdata, getUser, signin, signup } from "../controllers/auth.controller";
import { asyncHandler } from "../utils/asyncHandler";
import { verifyJWT } from "../middleware/auth.middleware";
const router:Router = Router();

router.route('/signup').post(signup);
router.route('/login').post(asyncHandler(signin));
router.route('/bulk').get(bulkdata);
router.route('/get-user').get(verifyJWT, getUser);

export default router;