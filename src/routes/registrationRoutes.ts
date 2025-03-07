import express, { Router,Request,Response } from "express";
import { registerForCourse, cancelCourseRegistration, getCourseRegistrations } from "../controllers/registrationController";

const router: Router = express.Router();

// Register for a course
router.post("/register/:courseId",  (req: Request, res: Response) => {
  registerForCourse(req, res);
});
// Cancel course registration
router.delete("/cancel/:registrationId", (req: Request, res: Response)=>{
    cancelCourseRegistration(req,res);
});

// Get course registrations for a specific course
router.get("/course/:courseId", (req:Request, res:Response)=>{
    getCourseRegistrations(req,res);
});

export default router;
