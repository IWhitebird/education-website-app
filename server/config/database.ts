import mongoose, { ConnectOptions } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connect = () => {
    mongoose
        .connect(process.env.MONGODB_URL!, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        } as ConnectOptions)
        .then(() => console.log("MongoDB Connected"))
        .catch((error) => {
            console.log("Error in DB connection");
            console.error(error);
            process.exit(1);
        });
};

export default connect;
