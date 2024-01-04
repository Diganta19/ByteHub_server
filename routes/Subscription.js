import  express from "express";
import { AskSubscription,updateSubscription,verifyPayment } from "../controllers/Subscription.js";

const router = express.Router();


router.post('/create-checkout-session',AskSubscription)
router.post('/verify',verifyPayment)
router.patch(`/update/:id`,updateSubscription)

export default router