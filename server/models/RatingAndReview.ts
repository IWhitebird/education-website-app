import mongoose from "mongoose";

interface IRatingAndReview extends mongoose.Document {
    user : mongoose.Schema.Types.ObjectId;
    rating : number;
    review : string;
    course: mongoose.Schema.Types.ObjectId;
}



const ratingAndReviewSchema = new mongoose.Schema<IRatingAndReview>({

    user : {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    rating : {
        type: Number,
        required: true,
    },
    review : {
        type: String,
        required: true,
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Course",
        index: true,
    }

});

export default mongoose.model<IRatingAndReview>("RatingAndReview", ratingAndReviewSchema);
