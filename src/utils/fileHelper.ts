import fs from "fs";
import path from "path";
import { Course, Registration } from "../types"; // Import types from a single source


// Define file paths
const coursesFile: string = path.join(__dirname, "../data/courses.json");
const registrationsFile: string = path.join(__dirname, "../data/registrations.json");

// Generic helper function to read a JSON file.
const readJsonFile = <T>(filePath: string): T[] => {
  try {
    // Read and parse the file data
    const data = fs.readFileSync(filePath, "utf-8");
    return data ? (JSON.parse(data) as T[]) : [];
  } catch (error) {
    console.error(`Error reading file: ${filePath}`, error);
    return []; // Return an empty array in case of error
  }
};

// Generic helper function to write to a JSON file.
 
const writeJsonFile = <T>(filePath: string, data: T[]): void => {
  try {
    // Write data to the file with pretty-printing
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error(`Error writing file: ${filePath}`, error);
  }
};

//Reads courses from the JSON file.
export const readCourses = (): Course[] => readJsonFile<Course>(coursesFile);

// Writes courses to the JSON file.
export const writeCourses = (data: Course[]): void => writeJsonFile<Course>(coursesFile, data);

//Reads registrations from the JSON file.
export const readRegistrations = (): Registration[] => readJsonFile<Registration>(registrationsFile);

//Writes registrations to the JSON file.
export const writeRegistrations = (data: Registration[]): void =>
  writeJsonFile<Registration>(registrationsFile, data);