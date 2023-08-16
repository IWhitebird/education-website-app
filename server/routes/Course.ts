import { Express , Router } from "express";

const router = Router();


// Course Controllers Import
  import {
    createCourse,
    getAllCourses,
    getCourseDetails,
    getFullCourseDetails,
    editCourse,
    getInstructorCourses,
    deleteCourse,
  } from "../controllers/Course";


  // Categories Controllers Import
  import {
    showAllCategory,
    createCategory,
    categoryPageDetails,
  } from "../controllers/Category";

  // Sections Controllers Import
  import {
    createSection,
    updateSection,
    deleteSection,
  } from "../controllers/Section";
  
  // Sub-Sections Controllers Import
  import {
    createSubSection,
    updateSubSection,
    deleteSubSection,
  } from "../controllers/Subsection";
  
  // Rating Controllers Import
  import {
    createRating,
    getAverageRating,
    getAllRating,
  } from "../controllers/RatingAndReview";
  
  // Importing Middlewares
  import { auth, isInstructor, isStudent, isAdmin 
  } from "../middlewares/auth";

  import {
    updateCourseProgress,
    // getProgressPercentage,
  } from "../controllers/CourseProgress"
  
// ********************************************************************************************************
//                                      Course routes
// ********************************************************************************************************

// Courses can Only be Created by Instructors
router.post("/createCourse", auth, isInstructor, createCourse)
//Add a Section to a Course
router.post("/addSection", auth, isInstructor, createSection)
// Update a Section
router.post("/updateSection", auth, isInstructor, updateSection)
// Delete a Section
router.post("/deleteSection", auth, isInstructor, deleteSection)
// Edit Sub Section
router.post("/updateSubSection", auth, isInstructor, updateSubSection)
// Delete Sub Section
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection)
// Add a Sub Section to a Section
router.post("/addSubSection", auth, isInstructor, createSubSection)
// Get all Registered Courses
router.get("/getAllCourses", getAllCourses)
// Get Details for a Specific Courses
router.post("/getCourseDetails", getCourseDetails)
// Get Details for a Specific Courses
router.post("/getFullCourseDetails", auth, getFullCourseDetails)
// Edit Course routes
router.post("/editCourse", auth, isInstructor, editCourse)
// Get all Courses Under a Specific Instructor
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses)
// Delete a Course
router.delete("/deleteCourse", deleteCourse)
// Update Course Progress
router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress)
// Get Course Progress
// router.post("/getCourseProgress", auth, isStudent, getProgressPercentage)

// ********************************************************************************************************
//                                      Category routes (Only by Admin)
// ********************************************************************************************************
// Category can Only be Created by Admin
// TODO: Put IsAdmin Middleware here
router.post("/createCategory", auth, isAdmin, createCategory)
router.get("/showAllCategories", showAllCategory)
router.post("/getCategoryPageDetails", categoryPageDetails)

// ********************************************************************************************************
//                                      Rating and Review
// ********************************************************************************************************
router.post("/createRating", auth, isStudent, createRating)
router.get("/getAverageRating", getAverageRating)
router.get("/getReviews", getAllRating)

export default router;