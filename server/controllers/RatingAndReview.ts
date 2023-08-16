import RatingAndReview from "../models/RatingAndReview";   
import { Request, Response } from "express";
import Course from "../models/Course"
import { AuthenticatedRequest } from "../middlewares/auth";
import mongoose from "mongoose";

export async function createRating(req: AuthenticatedRequest, res: Response) {
        try{
            const userId = req.user.id;
            const { rating , review , courseId } = req.body;
    
            const courseEnrolled = await Course.findOne({
                _id: courseId,
                studentsEnrolled: { $elemMatch: { $eq: userId } }
            });
    
            if(!courseEnrolled){
                return res.status(404).json({
                    success: false ,
                    message: "User not enrolled in the course"
                });
            }

            const alreadyReviewed = await RatingAndReview.findOne({courseId: courseId, userId: userId});

            if(alreadyReviewed){
                return res.status(400).json({
                    success: false ,
                    message: "User already reviewed the course"
                });
            }


            const newRating = await RatingAndReview.create( { rating  , review , course : courseId , user : userId });

            const updateCourseDetails = await Course.findByIdAndUpdate({_id : courseId}, 
                            { $push: { ratingAndReview: newRating._id } }, { new: true });

            console.log(updateCourseDetails);

            return res.status(201).json({
                success: true ,
                message: "Rating and review created successfully",
                data: newRating
            });

        }
        catch(error){
            console.log(error);
            res.status(500).json( {success: false  ,message: "Internal server error in createRating"});
        }

}

export async function getAverageRating(req: AuthenticatedRequest, res: Response) {
    try{
        const courseId  = req.body.courseId;

        const result = await RatingAndReview.aggregate([
            {
                $match: { 
                    course: new mongoose.Types.ObjectId(courseId)
                },

                $group: {
                    _id : null,
                    averageRating: { $avg: "$rating"},    
                }

    }]);

        if(result.length > 0){
            return res.status(200).json({
                success: true ,
                message: "Average rating",
                AverageRating: result[0].averageRating, 
            });
        }

        return res.status(200).json({
            success: true ,
            message: "Rating not yet given",
            AverageRating: 0, 
        });

    }
    catch(error){
        console.log(error);
        res.status(500).json( {success: false  ,message: "Internal server error in AverageRating"});
    }
}


export async function getAllRating(req: AuthenticatedRequest, res: Response) {
    try{
        const allRating = await RatingAndReview.find({}).sort({rating: "desc"})
                                                        .populate({
                                                            path: "user",
                                                            select: "firstName lastName email",
                                                        })
                                                        .populate({
                                                            path: "course",
                                                            select: "courseName",
                                                        }).exec();
        return res.status(200).json({
            success: true ,
            message: "All rating and review",
            data: allRating
        });

    }
    catch(error){
        console.log(error);
        res.status(500).json( {success: false  ,message: "Internal server error in getRatingAndReview"});
    }
}