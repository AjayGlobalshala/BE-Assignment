import fs from "fs";
import path from "path";
import { Course,Registration } from "../types";
import { readRegistrations as read } from "../utils/fileHelper";

// Paths to JSON files
const REGISTRATION_FILE = path.join("src", "data", "registrations.json");
const COURSE_FILE = path.join("src", "data", "courses.json");

// Reads registrations from the JSON file.
 
const readRegistrations = (): Registration[] => {
  // If the file doesn't exist, create it with an empty array
  if (!fs.existsSync(REGISTRATION_FILE)) {
    fs.writeFileSync(REGISTRATION_FILE, "[]");
    return [];
  }

  // Read and parse the file data
  const data = fs.readFileSync(REGISTRATION_FILE, "utf-8").trim();
  return data ? JSON.parse(data) : [];
};

// Reads courses from the JSON file.
 
const readCourses = (): Course[] => {
  // If the file doesn't exist, return an empty array
  if (!fs.existsSync(COURSE_FILE)) {
    return [];
  }

  // Read and parse the file data
  const data = fs.readFileSync(COURSE_FILE, "utf-8").trim();
  return data ? JSON.parse(data) : [];
};

export const writeData = (filePath: string, data: any): void => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error(`Error writing file: ${filePath}`, error);
  }
};

// Define parameters for registering an employee
interface RegisterEmployeeParams {
  employee_name: string;
  email: string;
  courseId: string;
}

// Define response structure
interface Response {
  status: number;
  message: string;
  data?: any;
  error?: string;
}

// Registers an employee for a course.
export const registerEmployee = ({ employee_name, email, courseId }: RegisterEmployeeParams): Response => {
  const registrations = readRegistrations();
  const courses = readCourses();

  // Find the course by ID
  const course = courses.find((c) => c.id === courseId);
  if (!course) {
    return { error: "COURSE_NOT_FOUND", status: 404, message: "Course not found" };
  }

  // Check if the employee is already registered for the course
  if (registrations.some((r) => r.employee_name === employee_name)) {
    return {
      status: 400,
      message: "EMPLOYEE_ALREADY_REGISTERED",
      data: {
        failure: {
          message: "The employee is already registered for this course",
        },
      },
    };
  }

  // Check if the course is full
  if (course.registeredEmployees.length >= course.max_employees) {
    return {
      status: 400,
      message: "COURSE_FULL_ERROR",
      data: {
        failure: {
          message: "Cannot register for the course, course is full",
        },
      },
    };
  }

  // Create a new registration
  const newRegistration: Registration = {
    id: `${employee_name.toUpperCase()}-${course.id}`, // Generate unique registration ID
    employee_name,
    email,
    courseId,
  };

  // Add the new registration and update the JSON file
  registrations.push(newRegistration);
  fs.writeFileSync(REGISTRATION_FILE, JSON.stringify(registrations, null, 2));

  // Update the course's registered employees and update the JSON file
  course.registeredEmployees.push(newRegistration.id);
  fs.writeFileSync(COURSE_FILE, JSON.stringify(courses, null, 2));

  // Return success response
  return {
    status: 200,
    message: `Successfully registered for ${course.id}`,
    data: {
      success: {
        registration_id: newRegistration.id,
        status: "ACCEPTED",
      },
    },
  };
};

// Cancels a course registration.
export const cancelRegistration = (registrationId: string): Response => {
  let registrations = readRegistrations();
  let courses = readCourses();

  // Find the registration by ID
  const registrationIndex = registrations.findIndex((r) => r.id === registrationId);
  if (registrationIndex === -1) {
    return { error: "REGISTRATION_NOT_FOUND", status: 404, message: "Registration not found" };
  }

  const registration = registrations[registrationIndex];

  const course = courses.find((c) => c.id === registration.courseId);  
  // Check if the course status is "CONFIRMED"
 if (course?.status==="CONFIRMED") {
  return {
    status: 400,
    message: "CANCELLATION_NOT_ALLOWED",
    data: {
      failure: {
        message: "Cancellation not allowed for confirmed courses",
      },
    },
  };
 };
  // Remove the registration and update the JSON file
  registrations.splice(registrationIndex, 1);
  fs.writeFileSync(REGISTRATION_FILE, JSON.stringify(registrations, null, 2));

  // Update the course's registered employees and update the JSON file
  if (course) {
    course.registeredEmployees = course.registeredEmployees.filter((id) => id !== registrationId);
    fs.writeFileSync(COURSE_FILE, JSON.stringify(courses, null, 2));
  }

  // Return success response
  return {
    status: 200,
    message: "Cancellation successful",
    data: {
      success: {
        registrationId: `${registration.employee_name}-OFFERING-${course?.course_name}-${course?.instructor_name}`,
        courseId: `OFFERING-${course?.course_name}-${course?.instructor_name}`,
        status: "CANCEL_ACCEPTED",
      },
    },
  };
};

// Gets all registrations for a specific course.
export const getRegistrationsByCourse = (courseId: string): Registration[] => {
  return readRegistrations().filter((r) => r.courseId === courseId);
};

// Gets all registrations for a specific course (alternative implementation).

export const getCourseRegistrations = (courseId: string): Registration[] => {
  return read().filter((r: { courseId: string }) => r.courseId === courseId);
};