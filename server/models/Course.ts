import mongoose, { Schema, Document } from "mongoose";

interface ICourse extends Document {
  courseName: string;
  courseDescription: string;
  instructor: mongoose.Schema.Types.ObjectId;
  whatYouWillLearn: string;
  courseContent: mongoose.Schema.Types.ObjectId[];
  ratingAndReview: mongoose.Schema.Types.ObjectId[];
  price: number;
  thumbnail: string;
  tag: string[];
  category: mongoose.Schema.Types.ObjectId;
  studentsEnrolled: mongoose.Schema.Types.ObjectId[];
  instructions: string[];
  status: string;
}

const courseSchema: Schema<ICourse> = new Schema<ICourse>({
    courseName: {
      type: String,
    },
    courseDescription: {
      type: String,
    },
    courseContent: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Section",
      },
    ],
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    whatYouWillLearn: {
      type: String,
    },
    ratingAndReview: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RatingAndReview",
      },
    ],
    price: {
      type: Number,
    },
    thumbnail: {
      type: String,
    },
    tag: {
      type: [String],
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    studentsEnrolled: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    instructions: {
      type: [String],
    },
    status: {
      type: String,
      enum: ["draft", "published"],
    },
});

export default mongoose.model<ICourse>("Course", courseSchema);
