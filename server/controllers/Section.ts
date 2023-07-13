import Section from '../models/Section';
import { Request, Response } from 'express';
import Course from '../models/Course';
import SubSection from '../models/SubSection';

export const createSection = async (req: Request, res: Response) => {
    try{
        const {sectionName , courseId} = req.body;
        
        if(!sectionName || !courseId){
            return res.status(400).json({success:false ,message: "Please enter all the fields"});
        };

        const newSection = await Section.create({
            sectionName : sectionName,
        });

        const updatedCourseDetails = await Course.findByIdAndUpdate(courseId , 
            {$push: {courseContent: newSection._id}} , {new: true}).populate({
				path: "courseContent",
				populate: {
					path: "subSections",
				},
			})
			.exec();


        //use populate to replace section and sub section both in updatedcoursedetails
        
        return res.status(200).json({
            success: true , 
            message: "Section created successfully" , 
            updatedCourseDetails
        });

    }
    catch(error){
        console.log(error);
        res.status(500).json({success:false, message: "Internal server error in createSection"});
    }
};


export const updateSection = async (req: Request, res: Response) => {
    try{
        const {sectionName , sectionId , courseId} = req.body;

        const updateData = await Section.findByIdAndUpdate(sectionId , {sectionName : sectionName} , {new: true});

        const course = await Course.findById(courseId)
		.populate({
			path:"courseContent",
			populate:{
				path:"subSections",
			},
		})
		.exec();
        
        return res.status(200).json({
            success: true ,
            message: "Section updated successfully" ,
            updateData,
            course
        });
    }
    catch(error){
        console.log(error);
        res.status(500).json({success:false, message: "Internal server error in updateSection"});
    }
};

export const deleteSection = async (req: Request, res: Response) => {
    try{
        const { sectionId, courseId }= req.body;

		await Course.findByIdAndUpdate(courseId, {
			$pull: {
				courseContent: sectionId,
			}
		})

		const section = await Section.findById(sectionId);
		console.log(sectionId, courseId);
		if(!section) {
			return res.status(404).json({
				success:false,
				message:"Section not Found",
			})
		}

		//delete sub section
		await SubSection.deleteMany({_id: {$in: section.subSections}});

        await Section.findByIdAndDelete(sectionId);

		const course = await Course.findById(courseId).populate({
			path:"courseContent",
			populate: {
				path: "subSections"
			}
		})
		.exec();

        return res.status(200).json({
            success: true ,
            message: "Section deleted successfully" ,
            course
        });

    }
    catch(error){
        console.log(error);
        res.status(500).json({success:false, message: "Internal server error in deleteSection"});
    }
};