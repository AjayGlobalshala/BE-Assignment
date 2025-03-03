import express from "express";
import { createCourse } from "../controllers/courseController.js";

const router = express.Router();

// Route to add a course
router.post("/add", createCourse);

export default router;
