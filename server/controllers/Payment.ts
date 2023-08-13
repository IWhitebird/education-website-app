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
import paymentSuccessEmail from "../mail/template/paymentSuccessEmail";
import dotenv from "dotenv";
import CourseProgress from "../models/CourseProgress";

dotenv.config();


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


export const verifySignature = async (req: AuthenticatedRequest, res: Response) => {
    const razorpay_order_id = req.body?.razorpay_order_id
    const razorpay_payment_id = req.body?.razorpay_payment_id
    const razorpay_signature = req.body?.razorpay_signature
    const courses = req.body?.courses
  
    const userId = req.user.id
  
    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !courses ||
      !userId
    ) {
      return res.status(200).json({ success: false, message: "Payment Failed" })
    }
  
    let body = razorpay_order_id + "|" + razorpay_payment_id
  
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET!)
      .update(body.toString())
      .digest("hex")
  
    if (expectedSignature === razorpay_signature) {
      await enrollStudents(courses, userId, res)
      return res.status(200).json({ success: true, message: "Payment Verified" })
    }
  
    return res.status(200).json({ success: false, message: "Payment Failed" })
}

const enrollStudents = async (courses : any, userId : any, res : Response) => {
    if (!courses || !userId) {
      return res
        .status(400)
        .json({ success: false, message: "Please Provide Course ID and User ID" })
    }
  
    for (const courseId of courses) {
      try {
        // Find the course and enroll the student in it
        const enrolledCourse = await Course.findOneAndUpdate(
          { _id: courseId },
          { $push: { studentsEnroled: userId } },
          { new: true }
        )
  
        if (!enrolledCourse) {
          return res
            .status(500)
            .json({ success: false, error: "Course not found" })
        }
        console.log("Updated course: ", enrolledCourse)
  
        const courseProgress = await CourseProgress.create({
          courseID: courseId,
          userId: userId,
          completedVideos: [],
        })
        // Find the student and add the course to their list of enrolled courses
        const enrolledStudent = await User.findByIdAndUpdate(
          userId,
          {
            $push: {
              courses: courseId,
              courseProgress: courseProgress._id,
            },
          },
          { new: true }
        )
  
        console.log("Enrolled student: ", enrolledStudent)
        // Send an email notification to the enrolled student
        const emailResponse = await mailSender(
          enrolledStudent!.email,
          `Successfully Enrolled into ${enrolledCourse.courseName}`,
          courseEnrollEmail(
            enrolledCourse.courseName,
            `${enrolledStudent!.firstName} ${enrolledStudent!.lastName}`
          )
        )
  
        console.log("Email sent successfully: ", emailResponse.response)
      } catch (error) {
        console.log(error)
        return res.status(400).json({ success: false, error })
      }
    }
  }

export const sendPaymentSuccessEmail = async (req: AuthenticatedRequest, res: Response) => {
    try{
        const { orderId, paymentId, amount } = req.body

        const userId = req.user.id
      
        if (!orderId || !paymentId || !amount || !userId) {
          return res
            .status(400)
            .json({ success: false, message: "Please provide all the details" })
        }

        const enrolledStudent = await User.findById(userId)

        await mailSender(
          enrolledStudent!.email,
          `Payment Received`,
          paymentSuccessEmail(
            `${enrolledStudent!.firstName} ${enrolledStudent!.lastName}`,
            amount / 100,
            orderId,
            paymentId
          )
        )
      
    }
    catch (error) {
        console.log("error in sending mail", error)
        return res
          .status(400)
          .json({ success: false, message: "Could not send email" })
      }
}



