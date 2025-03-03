import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const COURSE_FILE = path.join(__dirname, "../data/courses.json");

// Function to read courses from JSON file
const readCourses = () => {
  if (!fs.existsSync(COURSE_FILE)) {
    fs.writeFileSync(COURSE_FILE, "[]"); //// Ensure file exists with an empty array
    return [];
  }
  const data = fs.readFileSync(COURSE_FILE, "utf-8").trim();

  if (!data) return []; //Handle empty file case

  try {
    return JSON.parse(data);
  } catch (err) {
    console.error("Error parsing JSON data:", err);
    return [];
  }
};

// Function to write courses to JSON file
const writeCourses = (courses) => {
  fs.writeFileSync(COURSE_FILE, JSON.stringify(courses, null, 2));
};

// Function to add a course
const addCourse = (title, instructor, date, minEmployees, maxEmployees) => {
  const courses = readCourses();
  const newCourse = {
    id: uuidv4(),
    title,
    instructor,
    date,
    minEmployees,
    maxEmployees,
    registeredEmployees: [],
  };
  courses.push(newCourse);
  writeCourses(courses);
  return newCourse;
};

export { readCourses, writeCourses, addCourse };
