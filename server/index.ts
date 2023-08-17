import express from "express";

const app = express();

import userRoute from "./routes/User";
import profileRoute from "./routes/Profile";
import paymentRoute from "./routes/Payments";
import courseRoute from "./routes/Course";
import contactUs from "./routes/Contact";

import  connect  from "./config/database";
import cookieParser from "cookie-parser";
import cors from "cors";
import cloudinaryConnect from "./config/cloudinary";
import fileUpload from "express-fileupload";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 5000;

connect();
cloudinaryConnect();

app.use(express.json());
app.use(cookieParser());
app.use(cors(
    {
        // origin: "http://localhost:3000",
        origin: "https://education-website-app.vercel.app/",
        credentials: true,
    }
));
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
}));

app.use("/api/v1/auth", userRoute);
app.use("/api/v1/profile", profileRoute);
app.use("/api/v1/payment", paymentRoute);
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/contact", contactUs);

app.get("/", (req, res) => {
    return res.json({
        success: true,
        message: "Your Server is now running",
    });
});

app.listen(PORT, () => { console.log(`Server is running at ${PORT}`) });