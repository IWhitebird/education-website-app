import User from "../models/User";
import OTP from "../models/OTP";
import OtpGenerator from "otp-generator";
import { Request, Response } from 'express';
import Profile from "../models/Profile";
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import  mailSender from "../utils/mailSender";
import { AuthenticatedRequest } from "../middlewares/auth";
import passwordUpdate from "../mail/template/passUpdate"
import bcrypt from 'bcrypt';

dotenv.config();


export async function signUp(req :Request , res : Response){
  try {
    const { 
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp
    } = req.body;

    if(!firstName || !lastName || !email || !password || 
      !confirmPassword || !accountType || !contactNumber || !otp){
      return res.status(400).json({sucess : false , error: 'All fields are required' });
      }

      if(password !== confirmPassword){
        return res.status(400).json({
          sucess : false , 
          error: 'Password and Confirm Password should be same'
        });
      }

      const existingUser = await User.findOne({email});
      if(existingUser){
        return res.status(400).json({
          sucess : false , 
          error: 'User already exists'
        });
      }

      const recentOtp = await OTP.find({email}).sort({createdAt : -1}).limit(1);
  
      console.log(recentOtp);

      if(recentOtp.length === 0){ 
        return res.status(400).json({
          sucess : false , 
          error: 'No OTP found'
        });
      } else if( otp !== recentOtp[0].otp){
        return res.status(400).json({
          sucess : false ,
          error: 'Invalid OTP'
        });
      }


      const HashedPassword = bcrypt.hashSync(password, 10);

      let approved : any = "";
      approved === "Instructor" ? (approved = false) : (approved = true);

      const profileDetails = await Profile.create({
        gender: null,
        dateOfBirth: null,
        about: null,
        contactNumber: null,
      })

      const user = await User.create({
          firstName,
          lastName,
          email,
          contactNumber,
          password : HashedPassword,
          accountType : accountType,
          approved : approved,
          additionalDetails : profileDetails._id,
          image :`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
        });
        res.status(200).json({
           sucess : true ,
           message: "User created successfully",
           user, 
          });

}
  catch(error){
    console.log(error);
    return res.status(500).json({
        sucess : false ,
        message: 'Internal Server error in signup' 
      });
  }

} ;

export async function login(req:Request , res : Response){
   
  try{

    const { email , password} = req.body;
  
     if(!email || !password){
      return res.status(403).json({
        sucess : false , 
        error: 'All fields are required' 
      });
     }

      const user = await User.findOne({email}).populate('additionalDetails');

      if(!user){
        return res.status(403).json({
          sucess : false , 
          error: 'User does not exists'
        });
      }
      if(await bcrypt.compare(password , user.password)){
        
        const payload = {
          email : user.email,
          id : user._id,
          accountType: user.accountType,
        }

        const token = jwt.sign(payload , process.env.JWT_SECRET! , { expiresIn : '24h'});

        user.token = token;
        user.password = '';

        const options = {
          expires : new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          httpOnly : true,
        }
         
        res.cookie('token' , token , options).status(200).json({
          sucess : true ,
          message: "User logged in successfully",
          user,
          token
        });

      } else {
        return res.status(401).json({
          sucess : false , 
          error: 'Invalid Password'
        });
      }
    
  }
    catch(error){
      console.log(error);
      return res.status(500).json({
        sucess : false ,
        message: 'Internal Server error in login'
      });
    }
}


export async function sendOTP(req: Request, res: Response) {
  try {
        const {email} = req.body;
        const checkUserPresent = await User.findOne({email});

        if(checkUserPresent){
            return res.status(400).json({sucess : false , error: 'User already exists' });
        }
        
        var otp = OtpGenerator.generate(6, { 
            upperCaseAlphabets: false, 
            lowerCaseAlphabets: false, 
            specialChars: false 
          });

          const result = await OTP.findOne({otp : otp});
          
          while(result){
            otp = OtpGenerator.generate(6, { 
              upperCaseAlphabets: false, 
              lowerCaseAlphabets: false, 
              specialChars: false 
            });
          }

          const otpPayload = {email , otp};

          const otpBody = await OTP.create(otpPayload);

          return res.status(200).json({
            sucess : true ,
            otpBody 
            });
  }
  catch(error){
    console.log(error);
    return res.status(500).json({
        sucess : false ,
        message: 'Internal Server error' 
      });
  }
};

export async function changePassword(req: AuthenticatedRequest, res: Response) {
  try {
    const { email, oldPassword, newPassword, confirmNewPassword } = req.body;
    const bcrypt = await import('bcrypt-ts');
  
    const user = await User.findOne(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

		const isPasswordMatch = await bcrypt.compare(
			oldPassword,
			user.password
		);  

    if (!isPasswordMatch) {
      return res.status(403).json({
        success: false,
        error: 'Invalid Old Password',
      });
    }


    if (newPassword !== confirmNewPassword) {
      return res.status(403).json({
        success: false,
        error: 'Password and Confirm Password should be the same',
      });
    }



    const encryptedPassword = await bcrypt.hash(newPassword, 10);

    const updateUserDetails = await User.findOneAndUpdate(
        req.user.id,
        {password : encryptedPassword},
        {new : true}
    );
   
      try{
          const emailResponse = await mailSender(
            updateUserDetails!.email,
            "Password Updated Successfully",
            passwordUpdate(
              updateUserDetails!.email,
              `Password updated successfully for ${updateUserDetails!.firstName} ${updateUserDetails!.lastName}`
            )
          );
      }
      catch(error){
        console.error("Error occurred while sending email:", error);
        return res.status(500).json({
          success: false,
          message: "Error occurred while sending email",
          error,
        });
      }

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server error',
    });
  }
}
