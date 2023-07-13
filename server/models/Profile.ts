import mongoose from "mongoose";

interface IProfile extends mongoose.Document {
    gender : string;
    dateOfBirth : string;
    about : string;
    contactNumber: number;
}


const profileSchema = new mongoose.Schema<IProfile>({
    gender: {
        type: String,
    },
    dateOfBirth: {
        type: String,
    },
    about: {
        type: String,
        trim: true,
    },
    contactNumber: {
        type: Number,
        trim: true,
    }
});


export default mongoose.model<IProfile>("Profile", profileSchema);
  