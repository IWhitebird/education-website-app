import express, { Router } from "express";
const router: Router = express.Router();

import { auth , isInstructor } from "../middlewares/auth";
import {
  deleteAccount,
  updateProfile,
  getAllUserDetails,
  updateDisplayPicture,
  getEnrolledCourses,
  changePassword,
  instructorDashboard,
} from "../controllers/Profile";

// Profile routes
router.delete("/deleteProfile", auth, deleteAccount);
router.put("/updateProfile", auth, updateProfile);
router.get("/getUserDetails", auth, getAllUserDetails);
router.get("/getEnrolledCourses", auth, getEnrolledCourses);
router.put("/updateDisplayPicture", auth, updateDisplayPicture);
router.post("/changepassword", auth, changePassword)
router.get("/instructorDashboard", auth, isInstructor, instructorDashboard)


export default router;
