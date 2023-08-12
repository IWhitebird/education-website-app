import mongoose from "mongoose";

interface IUser extends mongoose.Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    accountType: string;
    additionalDetails: mongoose.Schema.Types.ObjectId;
    courses: [ ];
    image: string;
    courseProgress: [ ];
    token: string;
    resetPasswordExpires: number;
    contactNumber: string;
    active: boolean;
    approved: boolean;
}


const userSchema = new mongoose.Schema<IUser>({
    firstName : {
        type: String,
        required: true,
        trim: true,
    },
    lastName : {
        type: String,
        required: true,
        trim: true,
    },
    email :{
        type: String,
        required: true,
        trim: true,
        // unique: true,
    },
    password :{
        type: String,
        required: true,
    },
    active: {
        type: Boolean,
        default: true,
      },
    approved: {
        type: Boolean,
        default: true,
      },   
    accountType :{
        type: String,
        enum: ["Admin" , "Student", "Instructor"],
        required: true,
    },
    additionalDetails :{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Profile",
    },
    courses : [ 
        {  
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
        }
    ],
    image : {
        type: String,
        required: true,
    },
    courseProgress : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CourseProgress",
        }
    ],
    token : {
        type: String,
    },
    resetPasswordExpires : {
        type: Number,
    },
    contactNumber : {
        type: String,
    },

} ,  { timestamps: true });

export default mongoose.model<IUser>("User", userSchema);
