import { Request, Response } from "express";
import { getCourses } from "../models/courseModel";
import { getRegistrationsByCourse, writeData } from "../models/registrationModel";
import { Course,Registration } from "../types";


// File where updated registrations will be stored
const REGISTRATIONS_FILE = "registrations.json";

//Allots courses by updating registration statuses based on course requirements.
 export const allotCourses = async (req: Request, res: Response): Promise<void> => {
  try {

    const {courseId}=req.params;
    // Fetch all available courses
    const courses: Course[] = getCourses();
    // Fetch all employee registrations
    const registrations: Registration[] = getRegistrationsByCourse(courseId);

    // Map through registrations to update their status
    const updatedRegistrations: Registration[] = registrations.map((registration) => {
      // Find the corresponding course for each registration
      const course = courses.find((c) => c.id === registration.courseId);

      if (course) {
        // Check if the course has enough registered employees
        if (course.registeredEmployees.length >= course.min_employees) {
          // Confirm the registration if minEmployees condition is met
          return { ...registration, status: "CONFIRMED" };
        } else {
          // Cancel the registration if minEmployees condition is not met
          return { ...registration, status: "CANCELED" };
        }
      }
      // Return registration as is if course is not found
      return registration;
    });

    // Save the updated registrations to the file
    writeData(REGISTRATIONS_FILE, updatedRegistrations);

    // Send success response with updated registrations
    res.status(200).json({
      message: "Course allotment completed",
      registrations: updatedRegistrations,
    });
  } catch (error) {
    console.error("Error in course allotment:", error);
    res.status(500).json({ message: "Error in course allotment" });
  }
};