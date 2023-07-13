import mongoose from "mongoose";

interface ISubSection extends mongoose.Document {
    title : string;
    timeDuration : string;
    description : string;
    video : string;
}



const subSectonSchema = new mongoose.Schema<ISubSection>({

    title : {
        type: String,
    },
    timeDuration : {
        type: String,
    },
    description : {
        type: String,
    },
    video : {
        type: String,
    },

});

export default mongoose.model<ISubSection>("SubSection", subSectonSchema);
