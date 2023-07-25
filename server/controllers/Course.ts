import Course from "../models/Course";  
import Category from "../models/Category";
import { Request, Response } from "express";
import User from "../models/User";  
import { UploadToCloudinary } from "../utils/imageUploader";
import { AuthenticatedRequest } from "../middlewares/auth";

export async function createCourse(req: AuthenticatedRequest, res: Response) {
    try{

        const userId = req.user.id;

        let { courseName , courseDescription , whatYouWillLearn ,  price , category , tag: _tag , status ,  instructions: _instructions,} = req.body;
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
            status:status,
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
        const courseDetails = await Course.find({_id:courseId})
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

        if(!courseDetails){
            return res.status(400).json({success : false , message: "Course not found"});
        }

        res.status(200).json({
            success: true,
            message: "Course details retrieved successfully",
            courseDetails,
        });

    }
    catch(error){
        console.log(error);
        res.status(500).json({success : false , message: "Internal server error in getCourseDetails"});
    }

};

export async function editCourse(req: AuthenticatedRequest, res: Response) {
}

export async function getFullCourseDetails(req: Request, res: Response) {
};

export async function getInstructorCourses(req: Request, res: Response) {
};

export async function deleteCourse(req: Request, res: Response) {
};