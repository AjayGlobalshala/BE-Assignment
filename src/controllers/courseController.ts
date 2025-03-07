import { Request, Response } from "express";
import { addCourse, allotCourse } from "../models/courseModel";
import { getCourseRegistrations } from "../models/registrationModel";
import { Course,Registration } from "../types";

const isValidStartDate = (start_date: string): boolean => {
  // Parse the start_date string into a Date object
  const day = parseInt(start_date.slice(0, 2), 10);
  const month = parseInt(start_date.slice(2, 4), 10) - 1; // Months are 0-indexed in JavaScript
  const year = parseInt(start_date.slice(4, 8), 10);

  const courseStartDate = new Date(year, month, day);
  const currentDate = new Date();

  // Check if the course start date is in the past
  return courseStartDate >= currentDate;
};

// Function to create a new course
export const createCourse = (req: Request, res: Response): Response => {
  try {
    const {
      course_name,
      instructor_name,
      start_date,
      min_employees,
      max_employees,
    } = req.body;

    // Validate missing fields
    const missingFields: string[] = [];
    if (!course_name) missingFields.push("course_name");
    if (!instructor_name) missingFields.push("instructor_name");
    if (!start_date) missingFields.push("start_date");
    if (!min_employees) missingFields.push("min_employees");
    if (!max_employees) missingFields.push("max_employees");


    if (missingFields.length > 0) {
      return res.status(400).json({
        status: 400,
        message: "INPUT_DATA_ERROR",
        data: {
          failure: `${missingFields.join(", ")} cannot be empty`,
        },
      });
    }

    // Validate start_date
    if (!isValidStartDate(start_date)) {
      return res.status(400).json({
        status: 400,
        message: "INVALID_START_DATE",
        data: {
          success: {
            failure: "Start date cannot be in the past",
          },
        },
      });
    }

    // Validate min_employees < max_employees
    if (min_employees >= max_employees) {
      return res.status(400).json({
        status: 400,
        message: "INVALID_EMPLOYEE_COUNT",
        data: {
          success: {
            failure: "min_employees must be less than max_employees",
          },
        },
      });
    }

    // Add the new course
    const course = addCourse(
      course_name,
      instructor_name,
      start_date,
      min_employees,
      max_employees
    );

    if(!course){
      return res.status(400).json({
        status: 400,
        message: "COURSE_ALREADY_EXISTS",
        data: {
          success: {
            failure: "Course already exists",
          },
        },
      });
    }
    
    return res.status(200).json({
      status: 200,
      message: "Course added successfully",
      data: {
        success: {
          course_id: course.id,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Helper function to format registration response
const formatRegistrationResponse = (registration: Registration, course: Course) => ({
  registrationId: registration.id,
  employeeName: registration.employee_name,
  email: registration.email,
  courseOfferingId: course.id,
  courseName: course.course_name,
  instructor: course.instructor_name,
  date: course.start_date,
  finalStatus: course.status,
});

// Function to allot course to employees
export const allotCourseToEmployees = (req: Request, res: Response): Response => {
  try {
    const { courseId } = req.params;

    const allotmentResult = allotCourse(courseId);

    if (!allotmentResult.success || !allotmentResult.course) {
      return res.status(400).json({
        status: 400,
        message: allotmentResult.message || "Course not found",
      });
    }

    const course: Course = allotmentResult.course;

    const registrations: Registration[] = getCourseRegistrations(courseId);

    const response = registrations.map((r) => formatRegistrationResponse(r, course));

    return res.status(200).json({
      status: 200,
      message: "Successfully allotted course to registered employees",
      data: {
        success: response,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};