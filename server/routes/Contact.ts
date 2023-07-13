import { Express , Router } from "express";  
import { createContactUs } from "../controllers/ContactUs";

const router = Router();

router.post("/contact" , createContactUs);

export default Router;
