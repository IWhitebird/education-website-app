import SubSection from "../models/SubSection";  
import { Request, Response } from "express";
import Section from "../models/Section";
import { UploadToCloudinary } from "../utils/imageUploader";
import { AuthenticatedRequest } from "../middlewares/auth";

export const createSubSection = async (req: AuthenticatedRequest, res: Response) => {
    try{
        const {title , description, sectionId} = req.body;

        const video = req.files.video;

        if(!title || !description || !video || !sectionId){
            return res.status(400).json({success:false ,message: "Please enter all the fields"});
        }

        const uploadVideoFile = await UploadToCloudinary(video , process.env.FOLDER_NAME!);

        const createdSubSection = await SubSection.create({
            title : title,
            timeDuration: `${uploadVideoFile.duration}`,
            description: description,
            video: uploadVideoFile.secure_url,
        });

        const updateSection = await Section.findByIdAndUpdate({_id:sectionId} ,
            {$push: {subSections: createdSubSection._id}} , {new: true}).populate("subSections").exec();


        return res.status(200).json({
            success: true ,
            message: "Sub Section created successfully" ,
            data : updateSection
        });

    }
    catch(error){
        console.log(error);
        return res.status(500).json({success:false, message: "Internal server error in createSubSection"});
    }
};

export const updateSubSection = async (req: Request, res: Response) => {
    try {
      const { sectionId,subSectionId, title, description } = req.body
      const subSection = await SubSection.findById(subSectionId);
  
      if (!subSection) {
        return res.status(404).json({
          success: false,
          message: "SubSection not found",
        })
      }
  
      if (title !== undefined) {
        subSection.title = title
      }
  
      if (description !== undefined) {
        subSection.description = description
      }
      if (req.files && req.files.video !== undefined) {
        const video = req.files.video
        const uploadDetails = await UploadToCloudinary(
          video,
          process.env.FOLDER_NAME
        )
        subSection.video = uploadDetails.secure_url
        subSection.timeDuration = `${uploadDetails.duration}`
      }
  
      await subSection.save()
  
      const updatedSection = await Section.findById(sectionId).populate("subSections")


      return res.json({
        success: true,
        data:updatedSection,
        message: "Section updated successfully",
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: "An error occurred while updating the section",
      })
    }
  }
  
  export const deleteSubSection = async (req: Request, res: Response) => {
    try {
      const { subSectionId, sectionId } = req.body
      await Section.findByIdAndUpdate(
        { _id: sectionId },
        {
          $pull: {
            subSections: subSectionId,
          },
        }
      )
      const subSection = await SubSection.findByIdAndDelete({ _id: subSectionId })
  
      if (!subSection) {
        return res
          .status(404)
          .json({ success: false, message: "SubSection not found" })
      }

      const updatedSection = await Section.findById(sectionId).populate("subSections")
  
      return res.json({
        success: true,
        data:updatedSection,
        message: "SubSection deleted successfully",
      })
    } catch (error) { 
      console.error(error)
      return res.status(500).json({
        success: false,
        message: "An error occurred while deleting the SubSection",
      })
    }
  }