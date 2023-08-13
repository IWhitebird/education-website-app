import express, { Router } from "express";
const router: Router = express.Router();

import { capturePayment, verifySignature , sendPaymentSuccessEmail, } from "../controllers/Payment";
import {
  auth,
  isInstructor,
  isStudent,
  isAdmin,
} from "../middlewares/auth";

router.post("/capturePayment", auth, isStudent, capturePayment);
router.post("/verifyPayment", auth, isStudent, verifySignature);
router.post(
  "/sendPaymentSuccessEmail",
  auth,
  isStudent,
  sendPaymentSuccessEmail
)


export default router;
