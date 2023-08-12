import mongoose from "mongoose";

interface ICourseProgress extends mongoose.Document {
    courseID : mongoose.Schema.Types.ObjectId;
    userId : mongoose.Schema.Types.ObjectId;
    completedVideos : [mongoose.Schema.Types.ObjectId];
}


const CourseProgress = new mongoose.Schema<ICourseProgress>({
    courseID :{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    completedVideos : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SubSection",
        }
    ]

});

export default mongoose.model<ICourseProgress>("CourseProgress", CourseProgress);
