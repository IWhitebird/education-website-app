import mongoose from "mongoose";

interface ICourseProgress extends mongoose.Document {
    courseID : mongoose.Schema.Types.ObjectId;
    completedVideos : [mongoose.Schema.Types.ObjectId];
}


const CourseProgress = new mongoose.Schema<ICourseProgress>({
    courseID :{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
    },
    completedVideos : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SubSection",
        }
    ]

});

export default mongoose.model<ICourseProgress>("CourseProgress", CourseProgress);
