import express, { Router, Request, Response } from "express";
import { createCourse, allotCourseToEmployees } from "../controllers/courseController";

const router: Router = express.Router();

// Route to add a course
router.post("/add/courseOffering", (req: Request, res: Response) => {
  createCourse(req, res);
});

// Route to allot a course to employees
router.post("/allot/:courseId", (req: Request, res: Response) => {
  allotCourseToEmployees(req, res);
});

export default router;
