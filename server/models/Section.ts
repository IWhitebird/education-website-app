import mongoose from "mongoose";

interface ISection extends mongoose.Document {
    sectionName : string;
    subSections : [mongoose.Schema.Types.ObjectId];
}



const sectonSchema = new mongoose.Schema<ISection>({
    sectionName : {
        type: String,
    },
    subSections : [
        {        
            type : mongoose.Schema.Types.ObjectId,
            ref : "SubSection",
            require : true,
        }
    ]  

});

export default mongoose.model<ISection>("Section", sectonSchema);
