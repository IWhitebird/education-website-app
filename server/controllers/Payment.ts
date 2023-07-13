import mongoose from "mongoose";
import Course from "../models/Course";
import User from "../models/User";
import { Request, Response } from "express";
import instance from "../config/razorpay";
const mailSender = require('../utils/mailSender');
import courseEnrollmentMail from "../mail/template/CourseEnrollmentEmail";
import { AuthenticatedRequest } from "../middlewares/auth";
import crypto from "crypto";
import courseEnrollEmail from "../mail/template/CourseEnrollmentEmail";


export const capturePayment = async (req: AuthenticatedRequest, res: Response) => {
        const { courses } = req.body;
        const userId = req.user.id;

        if(!courses.length){
            return res.status(400).json({success: false , message: "Please provide course id"});
        };

        let totalAmount = 0;

        for (const course_id of courses) {
            let course;
            try {
              // Check if it is a valid course
              course = await Course.findById(course_id);
              if (!course) {
                return res.status(200).json({
                  success: false,
                  message: "Could not find thew course",
                });
              }
        
                const uid : any = new mongoose.Types.ObjectId(userId);

                if(course.studentsEnrolled.includes(uid)){
                    return res.status(400).json({success: false , message: "User already enrolled in this course"});
                }

                totalAmount += course.price;
        }
        catch(err){
            console.log(err);
            return res.status(500).json({success: false , message: "Internal Server Error in payments"});
        }


    const options = {
        amount: totalAmount * 100,
        currency : "INR",
        recipt: Math.random().toString(36).substring(2),
        }

    try{
        const paymentResponse = await instance.orders.create(options);
        return res.status(200).json(
            {
            success: true , 
            paymentResponse

        });
    }
        catch(err){
            console.log(err);
            return res.status(500).json({success: false , message: "Payment Failed"});
        }
    };
};


export const verifySignature = async (req: AuthenticatedRequest, res: Response) => {
    const webHookSecret = "123456";

    const signature = req.headers["x-razorpay-signature"];

    const shaSum = crypto.createHmac("sha256" , webHookSecret);

    shaSum.update(JSON.stringify(req.body));

    const digest = shaSum.digest("hex");

    if(signature === digest){
        console.log("Payment is Aithorized");

        const {courseId , userId} = req.body.payload.payment.entity.notes;

        try{
            const enrollCourse = await Course.findByIdAndUpdate(courseId , {
                $push : {studentsEnrolled : userId} } ,
                {new : true}
                );

            if(!enrollCourse){
                return res.status(404).json({success: false , message: "Failed in course enrollment"});
            }

            console.log(enrollCourse);

            const enrollStudent = await User.findOneAndUpdate({_id : userId} , {
                $push : {coursesEnrolled : courseId} } ,
                {new : true}
                );

            if(!enrollStudent){
                return res.status(404).json({success: false , message: "Failed in student enrollment"});
            }

            console.log(enrollStudent);

            await mailSender({
                to : enrollStudent.email,
                subject : "Course Enrollment",
                text : courseEnrollmentMail(enrollStudent.firstName , enrollCourse.courseName)
            });

            return res.status(200).json({success: true , message: "Payment is Authorized"});

        }
        catch(error){
            console.log(error);
            return res.status(500).json({success: false , message: "Internal Server Error in payments"});
        }
    }
    else {
        console.log("Payment is not Authorized");
        return res.status(400).json({success: false , message: "Payment is not Authorized"});
    }



};


