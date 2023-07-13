import User from "../models/User";
import { Request, Response } from "express";
import mailSender from "../utils/mailSender";
import contactUs from "../mail/template/contactFormRes";


export async function createContactUs(req: Request, res: Response) {
    try{
        const {firstName , lastName , email , phone , message} = req.body;

        if(!firstName || !lastName || !email || !phone || !message){
            return res.status(400).json({success : false , message: "Please enter all fields"});
        }

        const emailRes = await mailSender(
            email,
            "Your message has been received",
            contactUs(email, firstName, lastName, message , phone));
        return res.status(200).json({success : true , message: "Your message has been received" , emailRes});
    }
    
    catch(error){
        console.log(error);
        res.status(500).json({success : false , message: "Internal server error in createContactUs"});
    }
}