import mongoose from "mongoose";
import mailSender from "../utils/mailSender";
import emailTemplate from "../mail/template/EmailVerification";

interface IOtp extends mongoose.Document {
    email: string;
    otp: string;
    createdAt: Date;
    
};

const otpSchema = new mongoose.Schema<IOtp>({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 5*60,
    }


});

async function sendVerificationEmail(email : string, otp : string) {
    try{
        const mailResponse = await mailSender(email, "Verification Email from Kourse.com", emailTemplate(otp));
        console.log("Email Send Successfully", mailResponse);
            
    }
    catch(error){
        console.log("Error in sending verification email");
        throw error;
    }
}

otpSchema.pre<IOtp>("save", async function(next){
    console.log("New document saved to database");
    if(this.isNew){
        await sendVerificationEmail(this.email , this.otp);
    }  
    next(); 
});

export default mongoose.model<IOtp>("OTP", otpSchema);


     