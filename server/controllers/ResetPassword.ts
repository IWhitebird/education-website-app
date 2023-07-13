import User from "../models/User";
import { Request, Response } from "express";
import mailSender from "../utils/mailSender"; 
import crypto from "crypto";
import SendmailTransport from "nodemailer/lib/sendmail-transport";



export async function resetPasswordToken(req: Request, res: Response) {
    try{
        const {email} = req.body;
        const user = await User.findOne({email: email});
        
        if(!user){
            res.status(404).json({
                success: false , 
                message: "User not registered with the given email id"
            });
        } 

        const token = crypto.randomBytes(20).toString("hex");

        await User.findByIdAndUpdate(user?._id , {
            token: token,
            resetPasswordExpires: Date.now() + 5 * 60 * 1000,
        });

        const url = `http://localhost:3000/resetPassword/${token}`;

        await mailSender(email, "Reset Password Link", url);

        return res.json({
            success: true,
            message: "Reset password link sent to your email id",
        }); 

 
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal server error in resetPasswordToken"});
    }
};


export async function resetPassword(req: Request, res: Response) {
    try{
        
        const {password , confirmPassword , token} = req.body;
      
      
        if(password !== confirmPassword){
            return res.json({
                success: false,
                message: "Password and confirm password do not match",
            });
        }


        const userDetails = await User.findOne({token: token});

        if(!userDetails){
            return res.json({
                success: false,
                message: "Invalid or expired token",
            });
        }

        if(Date.now() > userDetails.resetPasswordExpires){
            return res.json({
                success: false,
                message: "Token is expired",
            });
        }

        const bcrypt = require("bcrypt");
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.findOneAndUpdate(
            {token: token} , 
            {password: hashedPassword,},
            {new: true});

        return res.status(200).json({
            success: true,
            message: "Password reset successfully",
        });


    }
        
        catch(error) {
        console.log(error);
        res.status(500).json({message: "Internal server error in resetPassword"});
    }

}