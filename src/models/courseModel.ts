import fs from "fs";
import path from "path";
import { Course } from "../types";
import { readCourses as read, writeCourses as write } from "../utils/fileHelper";

// Path to the courses JSON file
const COURSE_FILE: string = path.join(__dirname, "../data/courses.json");

// Reads courses from the JSON file.
const readCourses = (): Course[] => {
  // If the file doesn't exist, create it with an empty array
  if (!fs.existsSync(COURSE_FILE)) {
    fs.writeFileSync(COURSE_FILE, "[]", "utf-8");
    return [];
  }

  // Read and parse the file data
  const data: string = fs.readFileSync(COURSE_FILE, "utf-8").trim();

  // Handle empty file case
  if (!data) return [];

  try {
    return JSON.parse(data) as Course[];
  } catch (err) {
    console.error("Error parsing JSON data:", err);
    return [];
  }
};

// Writes courses to the JSON file.
 
const writeCourses = (courses: Course[]): void => {
  try {
    fs.writeFileSync(COURSE_FILE, JSON.stringify(courses, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing JSON data:", err);
  }
};

// Adds a new course to the JSON file.
const addCourse = (
  course_name: string,
  instructor_name: string,
  start_date: string,
  min_employees: number,
  max_employees: number
): Course | null=> {
  const courses: Course[] = readCourses();

  // Create a new course object
  const newCourse: Course = {
    id: `OFFERING-${course_name.toUpperCase()}-${instructor_name.toUpperCase()}`, // Generate unique course ID
    course_name,
    instructor_name,
    start_date,
    min_employees,
    max_employees,
    registeredEmployees: [], // Initialize with an empty array of registered employees
  };

  
  // Check if the course already exists
  const existingCourse = courses.find(
    (c) =>
      c.course_name === course_name.toUpperCase()
  );

  if (existingCourse) {
    // Course already exists, return null
    return null;
  }

  // Add the new course to the list and save to file
  courses.push(newCourse);
  writeCourses(courses);

  return newCourse;
};

// Allots a course by updating its status based on registrations.
export const allotCourse = (
  courseId: string
): { success: boolean; course?: Course; message?: string } => {

  const courses: Course[] = readCourses();
  
  const course = courses.find((c) => c.id === courseId);

  // If course is not found, return an error
  if (!course) {
    return { success: false, message: "Course not found" };
  }

  // Update course status based on registrations
  course.status =
    course.registeredEmployees.length >= course.min_employees ? "CONFIRMED" : "CANCELLED";

  // Save updated courses to file
  writeCourses(courses);

  return { success: true, course };
};

// Gets all courses from the JSON file.

export const getCourses = (): Course[] => read();

// Saves courses to the JSON file.
export const saveCourses = (courses: Course[]): void => write(courses);

// Export functions
export { readCourses, writeCourses, addCourse };