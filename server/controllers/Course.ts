import Course from "../models/Course";  
import Category from "../models/Category";
import { Request, Response } from "express";
import User from "../models/User";  
import { UploadToCloudinary } from "../utils/imageUploader";
import { AuthenticatedRequest } from "../middlewares/auth";
import CourseProgress from "../models/CourseProgress";
import Section from "../models/Section";
import convertSecondsToDuration from "../utils/secToDuration";
import SubSection from "../models/SubSection";

export async function createCourse(req: AuthenticatedRequest, res: Response) {
    try{

        const userId = req.user.id;

        let { courseName , courseDescription , whatYouWillLearn ,  price , category , tag: _tag  ,  instructions: _instructions,} = req.body;
        const thumbnail  = req.files.thumbnailImage;
        
        const tag = JSON.parse(_tag)
        const instructions = JSON.parse(_instructions)
      
        if (
            !courseName ||
            !courseDescription ||
            !whatYouWillLearn ||
            !price ||
            !tag.length ||
            !thumbnail ||
            !category ||
            !instructions.length
          ) {
            return res.status(400).json({success : false , message: "Please enter all fields"});
        }

        let status = req.body.status;

        if (!status || status === undefined) {
            status = "draft"
          }


        const instructorDetail = await User.findById(userId , 
                {accountType: "Instructor"});

        if(!instructorDetail){
            return res.status(400).json({success : false , message: "Instructor Details not found"});
        }

        const categoryDetails = await Category.findById(category);

        if(!categoryDetails){
            return res.status(400).json({success : false , message: "Category Details not found"});
        }

        const thumbnailImageUpload = await UploadToCloudinary(thumbnail , process.env.FOLDER_NAME!);
        
        const newCourse = await Course.create({
            courseName:courseName,
            courseDescription:courseDescription,
            whatYouWillLearn:whatYouWillLearn,
            instructor : instructorDetail._id,
            price,
            category:categoryDetails._id,
            thumbnail:thumbnailImageUpload.secure_url,
            status,
            instructions:instructions,
        });

        await User.findByIdAndUpdate({_id:instructorDetail._id,},
           { $push : { courses : newCourse._id} } , {new:true},);


           const categoryDetails2 = await Category.findByIdAndUpdate(
            { _id: category },
            {
              $push: {
                course: newCourse._id,
              },
            },
            { new: true }
          )

        return res.status(200).json({
            success: true,
            message: "Course created successfully",
            data: newCourse,
        });

    }
    catch(error){
        console.log(error);
        res.status(500).json({success : false , message: "Internal server error in createCourse"});
    }
};

export async function getAllCourses(req: Request, res: Response) {
    try{

        const allCourses = await Course.find({ status: "Published"} , 
        {
             courseName:true, 
             coursePrice:true , 
             thumbnailImage:true,
             instructor:true ,
             ratingAndReviews:true , 
             studentsEnrolled:true , 
            })
             .populate("instructor")
             .exec();

        res.status(200).json({
            success: true,
            message: "All courses retrieved successfully",
            allCourses,
        });

    }
    catch(error){
        console.log(error);
        res.status(500).json({success : false , message: "Internal server error in showAllCourses"});
    }
};

export async function getCourseDetails(req: Request, res: Response) {
    try{
        const { courseId } = req.body;

        const tempRes : any = await Course.find({_id:courseId})
        .populate({
            path: "instructor",
            populate: {
                path : "additionalDetails",
            },
        })
        .populate("category")
      //  .populate("ratingAndReviews")
        .populate({
            path: "courseContent",
            populate: {
                path: "subSections",
                select: "-video",
            }
        }).exec();

        const courseDetails = tempRes[0];

        if(!courseDetails){
            return res.status(400).json({success : false , message: "Course not found"});
        }


        let totalDurationInSeconds = 0
        courseDetails.courseContent.forEach((content : any) => {
          content.subSections.forEach((subSection : any) => {
            const timeDurationInSeconds = parseInt(subSection.timeDuration)
            totalDurationInSeconds += timeDurationInSeconds
          })
        })
    
        const totalDuration = convertSecondsToDuration(totalDurationInSeconds)
    
        return res.status(200).json({
          success: true,
          data: {
            courseDetails,
            totalDuration,
          },
        })
      } catch (error) {
        console.log(error)
        return res.status(500).json({
          success: false,
          error
        })
      }
}

export async function editCourse(req: AuthenticatedRequest, res: Response) {
    try {
      const { courseId } = req.body;
      const updates = req.body; 
      const course = await Course.findById(courseId) as any;
  
      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }
  
      // If Thumbnail Image is found, update it
      if (req.files) {
        console.log("thumbnail update");
        const thumbnail = req.files.thumbnailImage;
        const thumbnailImage = await UploadToCloudinary(
          thumbnail,
          process.env.FOLDER_NAME
        );
        course.thumbnail = thumbnailImage.secure_url;
      }
  
      // Update only the fields that are present in the request body
      for (const key in updates) {
        if (updates.hasOwnProperty(key)) {
          if (key === "tag" || key === "instructions") {
            course[key] = JSON.parse(updates[key]);
          } else {
            course[key] = updates[key];
          }
        }
      }
  
      await course.save();
  
      const updatedCourse = await Course.findOne({
        _id: courseId,
      })
        .populate({
          path: "instructor",
          populate: {
            path: "additionalDetails",
          },
        })
        .populate("category")
        .populate("ratingAndReview")
        .populate({
          path: "courseContent",
          populate: {
            path: "subSections",
          },
        })
        .exec();
  
      res.json({
        success: true,
        message: "Course updated successfully",
        data: updatedCourse,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error,
      });
    }
}

export async function getFullCourseDetails(req: AuthenticatedRequest, res: Response) {
    try {
        const { courseId } = req.body
        const userId = req.user.id
        const courseDetails = await Course.findOne({
          _id: courseId,
        })
          .populate({
            path: "instructor",
            populate: {
              path: "additionalDetails",
            },
          })
          .populate("category")
          .populate("ratingAndReview")
          .populate({
            path: "courseContent",
            populate: {
              path: "subSections",
            },
          })
          .exec()
    
        let courseProgressCount = await CourseProgress.findOne({
          courseID: courseId,
          userId: userId,
        })
    
        console.log("courseProgressCount : ", courseProgressCount)
    
        if (!courseDetails) {
          return res.status(400).json({
            success: false,
            message: `Could not find course with id: ${courseId}`,
          })
        }
    
        // if (courseDetails.status === "Draft") {
        //   return res.status(403).json({
        //     success: false,
        //     message: `Accessing a draft course is forbidden`,
        //   });
        // }
    
        let totalDurationInSeconds = 0
        courseDetails.courseContent.forEach((content : any) => {
          content.subSections.forEach((subSection : any) => {
            const timeDurationInSeconds = parseInt(subSection.timeDuration)
            totalDurationInSeconds += timeDurationInSeconds
          })
        })
    
        const totalDuration = convertSecondsToDuration(totalDurationInSeconds)
    
        return res.status(200).json({
          success: true,
          data: {
            courseDetails,
            totalDuration,
            completedVideos: courseProgressCount?.completedVideos
              ? courseProgressCount?.completedVideos
              : [],
          },
        })
      } catch (error) {
        return res.status(500).json({
          success: false,
          error
        })
      }    
};

export async function getInstructorCourses(req: AuthenticatedRequest, res: Response) {
  try {
    // Get the instructor ID from the authenticated user or request body
    const instructorId = req.user.id

    // Find all courses belonging to the instructor
    const instructorCourses = await Course.find({
      instructor: instructorId,
    }).sort({ createdAt: -1 })

    // Return the instructor's courses
    res.status(200).json({
      success: true,
      data: instructorCourses,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Failed to retrieve instructor courses",
      error
    })
  }  
};

export async function deleteCourse(req: Request, res: Response) {
    try {
        const { courseId } = req.body
    
        // Find the course
        const course = await Course.findById(courseId)
        if (!course) {
          return res.status(404).json({ message: "Course not found" })
        }
    
        // Unenroll students from the course
        const studentsEnrolled = course.studentsEnrolled
        for (const studentId of studentsEnrolled) {
          await User.findByIdAndUpdate(studentId, {
            $pull: { courses: courseId },
          })
        }
    
        // Delete sections and sub-sections
        const courseSections = course.courseContent
        for (const sectionId of courseSections) {
          // Delete sub-sections of the section
          const section = await Section.findById(sectionId)
          if (section) {
            const subSections = section.subSections
            for (const subSectionId of subSections) {
              await SubSection.findByIdAndDelete(subSectionId)
            }
          }
    
          // Delete the section
          await Section.findByIdAndDelete(sectionId)
        }
    
        // Delete the course
        await Course.findByIdAndDelete(courseId)
    
        return res.status(200).json({
          success: true,
          message: "Course deleted successfully",
        })
      } catch (error) {
        console.error(error)
        return res.status(500).json({
          success: false,
          message: "Server error",
          error
        })
      }    
};