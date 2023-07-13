import mongoose from "mongoose";

interface ICategory extends mongoose.Document {
    name : string;
    description : string;
    course : mongoose.Schema.Types.ObjectId;
}



const categorySchema = new mongoose.Schema<ICategory>({

    name : {
        type: String,
        required: true,
    },
    description : {
        type: String,
        required: true,
    },
    course : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
        },
    ] ,

});

export default mongoose.model<ICategory>("Category", categorySchema);
