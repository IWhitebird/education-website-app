import express, { Router } from "express";
const router: Router = express.Router();

import { auth } from "../middlewares/auth";
import {
  deleteAccount,
  updateProfile,
  getAllUserDetails,
  updateDisplayPicture,
  getEnrolledCourses,
  changePassword
} from "../controllers/Profile";

// Profile routes
router.delete("/deleteProfile", auth, deleteAccount);
router.put("/updateProfile", auth, updateProfile);
router.get("/getUserDetails", auth, getAllUserDetails);
router.get("/getEnrolledCourses", auth, getEnrolledCourses);
router.put("/updateDisplayPicture", auth, updateDisplayPicture);
router.post("/changepassword", auth, changePassword)

export default router;
