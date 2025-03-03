import express from "express";
import { registerForCourse } from "../controllers/registrationController.js";
import { cancelCourseRegistration } from "../controllers/registrationController.js";

const router = express.Router();

router.post("/register", registerForCourse);
router.delete("/cancel/:registrationId", cancelCourseRegistration);

export default router;
