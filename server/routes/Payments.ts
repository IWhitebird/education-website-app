import express, { Router } from "express";
const router: Router = express.Router();

import { capturePayment, verifySignature } from "../controllers/Payment";
import {
  auth,
  isInstructor,
  isStudent,
  isAdmin,
} from "../middlewares/auth";

router.post("/capturePayment", auth, isStudent, capturePayment);
router.post("/verifySignature", auth, isStudent, verifySignature);

export default router;
