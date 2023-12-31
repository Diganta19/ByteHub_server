import  express from "express";
import { AskSubscription,updateSubscription } from "../controllers/Subscription.js";

const router = express.Router();


router.post('/create-checkout-session',AskSubscription)
router.patch(`/update/:id`,updateSubscription)

export default router