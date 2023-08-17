import Profile from "../models/Profile";
import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth";
import User from "../models/User";
import { get } from "http";
import { UploadToCloudinary } from "../utils/imageUploader";
import convertSecondsToDuration from "../utils/secToDuration";
import CourseProgress from "../models/CourseProgress";
import Course from "../models/Course";

export const updateProfile = async (req : AuthenticatedRequest, res : Response) => {
    try{
        const {dateOfBirth="" , gender , about="" , contactNumber} = req.body;

        const id = req.user.id;


        const userDetail = await User.findById(id);

        const profile  = await Profile.findById(userDetail?.additionalDetails);

        profile!.dateOfBirth = dateOfBirth;
        profile!.gender = gender;
        profile!.about = about;
        profile!.contactNumber = contactNumber;

        await profile?.save();
        
        const updatedUserDetails = await User.findById(id).populate('additionalDetails').exec();

        res.status(200).json({success:true, message: "Profile updated successfully" ,updatedUserDetails});
    }
    catch(error){
        console.log(error);
        res.status(500).json({success:false, message: "Internal server error in updateProfile"});
    }
};  

export const deleteAccount = async (req : AuthenticatedRequest, res : Response) => {
    try{
        const id = req.user.id;

        const userDetail = await User.findById(id);

        if(!userDetail){
            return res.status(400).json({success:false, message: "User not found to delete"});
        }
        
        await Profile.findByIdAndDelete({_id : userDetail.additionalDetails});
       
        //Unroll from all courses
        
        await User.findByIdAndDelete(id);


        res.status(200).json({success:true, message: "Account deleted successfully"});
    }
    catch(error){
        console.log(error);
        res.status(500).json({success:false, message: "Internal server error in deleteAccount"});
    }
};

export const getAllUserDetails  = async (req : AuthenticatedRequest, res : Response) => {
    try{
        const id = req.user.id;
        const userDetail = await User.findById(id).populate('additionalDetails').exec();
       
        if(!userDetail){
            return res.status(400).json({success:false, message: "User not found to get profile"});
        }
      
        res.status(200).json({success:true, message: "Profile fetched successfully" , userDetail});
    }
    catch(error){
        console.log(error);
        res.status(500).json({success:false, message: "Internal server error in getProfile"});
    }
};
    
export const updateDisplayPicture = async (req : AuthenticatedRequest, res : Response) => {
    try{
        const displayPicture = req.files.displayPicture;
        const userId = req.user.id;

        if(!displayPicture){
            return res.status(400).json({success:false, message: "Please upload a file"});
        }
        const image = await UploadToCloudinary(
            displayPicture,
            process.env.FOLDER_NAME!,
            1000,
            1000
        );

        const updateDetails = await User.findByIdAndUpdate( { _id : userId },
             {image: image.secure_url} , {new : true});

        res.send({
            success: true,
            message: "Image uploaded successfully",
            data: updateDetails
        })

    }
    catch(error){
        console.log(error);
        res.status(500).json({success:false, message: "Internal server error in updateDisplayPicture"});
    }
};

export const getEnrolledCourses = async (req : AuthenticatedRequest, res : Response) => {
    try {
        const userId = req.user.id
        let userDetails : any = await User.findOne({
          _id: userId,
        })
          .populate({
            path: "courses",
            populate: {
              path: "courseContent",
              populate: {
                path: "subSections",
              },
            },
          })
          .exec()
        userDetails = userDetails!.toObject()
        var SubsectionLength = 0
        for (var i = 0; i < userDetails.courses.length; i++) {
          let totalDurationInSeconds = 0
          SubsectionLength = 0
          for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
            totalDurationInSeconds += userDetails.courses[i].courseContent[
              j
            ].subSections.reduce((acc : any, curr : any) => acc + parseInt(curr.timeDuration), 0)
            userDetails.courses[i].totalDuration = convertSecondsToDuration(
              totalDurationInSeconds
            )
            SubsectionLength +=
              userDetails.courses[i].courseContent[j].subSections.length
          }
          let courseProgressCount : any = await CourseProgress.findOne({
            courseID: userDetails.courses[i]._id,
            userId: userId,
          })
          courseProgressCount = courseProgressCount?.completedVideos.length
          if (SubsectionLength === 0) {
            userDetails.courses[i].progressPercentage = 100
          } else {
            // To make it up to 2 decimal point
            const multiplier = Math.pow(10, 2)
            userDetails.courses[i].progressPercentage =
              Math.round(
                (courseProgressCount / SubsectionLength) * 100 * multiplier
              ) / multiplier
          }
        }
    
        if (!userDetails) {
          return res.status(400).json({
            success: false,
            message: `Could not find user with id: ${userDetails}`,
          })
        }
        return res.status(200).json({
          success: true,
          data: userDetails.courses,
        })
      } catch (error) {
        return res.status(500).json({
          success: false,
          error
        })
      }
};


export const changePassword = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { oldPassword, newPassword } = req.body;
      const id = req.user.id;
  
      const oldProfile = await User.findById(id);
  
      if (!oldProfile) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      const alreadyPass = oldProfile.password;

      const bcrypt = require('bcrypt');
  
      const passwordMatches = await bcrypt.compare(oldPassword, alreadyPass);
  
      if (!passwordMatches) {
        return res.status(400).json({ success: false, message: "Old password is incorrect" });
      }
  
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  
      const updated = await User.findByIdAndUpdate(id, { password: hashedNewPassword });
  
      return res.status(200).json({ success: true, message: "Password changed successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Internal server error in changePassword" });
    }
  };


export const instructorDashboard = async (req : AuthenticatedRequest, res : Response) => {
  try {
    const courseDetails = await Course.find({ instructor: req.user.id })

    const courseData = courseDetails.map((course) => {
      const totalStudentsEnrolled = course.studentsEnrolled.length
      const totalAmountGenerated = totalStudentsEnrolled * course.price

      // Create a new object with the additional fields
      const courseDataWithStats = {
        _id: course._id,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        // Include other course properties as needed
        totalStudentsEnrolled,
        totalAmountGenerated,
      }

      return courseDataWithStats
    })

    res.status(200).json({ courses: courseData })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server Error" })
  }
}