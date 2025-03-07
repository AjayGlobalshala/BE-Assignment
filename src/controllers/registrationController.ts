import { Request, Response } from "express";
import { registerEmployee, cancelRegistration, getRegistrationsByCourse } from "../models/registrationModel";
import path from "path";
import fs from "fs";
import { Course,Registration } from "../types";

// Path to the courses JSON file
const COURSE_FILE = path.join("src", "data", "courses.json");

//  Register an employee for a course
export const registerForCourse = (req: Request, res: Response): Response => {
  const { employee_name, email, courseId } = req.body;

  // Validate required fields
   const missingFields: string[] = [];
   if (!employee_name) missingFields.push("employee_name");
   if (!email) missingFields.push("email");
   if (!courseId) missingFields.push("courseId");

    if (missingFields.length > 0) {
      return res.status(400).json({
          status: 400,
          message: "INPUT_DATA_ERROR",
          data: {
          failure: `${missingFields.join(", ")} cannot be empty`,
        },
      });
    }


  // Attempt to register the employee
  const result = registerEmployee({ employee_name, email, courseId });

  // If registration is successful, return the result
  if (result) {
    return res.status(200).json({ result });
  }

  // If registration fails, find the course details
  const data: string = fs.readFileSync(COURSE_FILE, "utf-8").trim();
  const courses: Course[] = JSON.parse(data);
  const course: Course | undefined = courses.find((c) => c.id === courseId);

  // If course is not found, return an error
  if (!course) {
    return res.status(404).json({ error: "Course not found" });
  }

  // Extract course details
  const { course_name, instructor_name } = course;

  // Return success response with registration details
  return res.status(200).json({
    status: 200,
    message: `Successfully registered for OFFERING-${course_name.toUpperCase()}-${instructor_name.toUpperCase()}`,
    data: {
      success: {
        registrationId: `${employee_name.toUpperCase()}-OFFERING-${course_name.toUpperCase()}-${instructor_name.toUpperCase()}`,
        status: "ACCEPTED",
      },
    },
  });
};

// Cancel a course registration
export const cancelCourseRegistration = (req: Request, res: Response): Response => {
  const { registrationId } = req.params;

  // Attempt to cancel the registration
  const result = cancelRegistration(registrationId);

  
  // Handle errors
  if (result.error) {
    return res.status(result.status).json({ error: result.error, message: result.message });
  }

  // Return success response
  return res.status(200).json(result);
};

// Get all registrations for a specific course
export const getCourseRegistrations = (req: Request, res: Response): Response => {
  const { courseId } = req.params;

  // Fetch registrations for the course
  const registrations: Registration[] = getRegistrationsByCourse(courseId);

   // Sort registrations by registrationId in ascending order
   registrations.sort((a, b) => a.id.localeCompare(b.id));
   

  // Return response with registrations
  return res.status(200).json({
    courseId,
    totalRegistrations: registrations.length,
    registrations,
  });
};