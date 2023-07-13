import Profile from "../models/Profile";
import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth";
import User from "../models/User";
import { get } from "http";
import { UploadToCloudinary } from "../utils/imageUploader";

export const updateProfile = async (req : AuthenticatedRequest, res : Response) => {
    try{
        const {dateOfBirth="" , gender , about="" , contactNumber} = req.body;

        const id = req.user.id;


        const userDetail = await User.findById(id);

        const profileId = userDetail?.additionalDetails;

        const profileDetails = await Profile.findById(profileId);

        profileDetails!.dateOfBirth = dateOfBirth;
        profileDetails!.gender = gender;
        profileDetails!.about = about;
        profileDetails!.contactNumber = contactNumber;

        await profileDetails?.save();

        res.status(200).json({success:true, message: "Profile updated successfully" , profileDetails});
    
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
    try{
        const userId = req.user.id;
        const userDetails = await User.findById(userId)
        .populate("courses")
        .exec();
    
        if(!userDetails){
            return res.status(400).json({success:false, 
                message: "User not found to get enrolled courses"});
        }

        res.status(200).json({success:true, 
            message: "Enrolled courses fetched successfully" , 
            data : userDetails.courses});

    }
    catch(error){
        console.log(error);
        res.status(500).json({success:false, message: "Internal server error in getEnrolledCourses"});
    }
};