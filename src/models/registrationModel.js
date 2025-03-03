import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import path from "path";

const REGISTRATION_FILE = path.join("src", "data", "registrations.json");
const COURSE_FILE = path.join("src", "data", "courses.json");

// Read registrations from JSON file
const readRegistrations = () => {
  if (!fs.existsSync(REGISTRATION_FILE)) {
    fs.writeFileSync(REGISTRATION_FILE, "[]");
    return [];
  }
  const data = fs.readFileSync(REGISTRATION_FILE, "utf-8").trim();
  return data ? JSON.parse(data) : [];
};

// Read courses from JSON file
const readCourses = () => {
  if (!fs.existsSync(COURSE_FILE)) {
    return [];
  }
  const data = fs.readFileSync(COURSE_FILE, "utf-8").trim();
  return data ? JSON.parse(data) : [];
};

// Register an employee for a course
export const registerEmployee = ({ name, email, courseId }) => {
  const registrations = readRegistrations();
  const courses = readCourses();

  const course = courses.find((c) => c.id === courseId);
  if (!course) {
    return { error: "COURSE_NOT_FOUND" };
  }

  if (course.registeredEmployees.length >= course.maxEmployees) {
    return { error: "COURSE_FULL_ERROR" };
  }

  const newRegistration = {
    id: uuidv4(),
    name,
    email,
    courseId,
  };

  registrations.push(newRegistration);
  fs.writeFileSync(REGISTRATION_FILE, JSON.stringify(registrations, null, 2));

  // Add employee to course's registered list
  course.registeredEmployees.push(newRegistration.id);
  fs.writeFileSync(COURSE_FILE, JSON.stringify(courses, null, 2));

  return { message: "Registration successful", registration: newRegistration };
};
export const cancelRegistration = (registrationId) => {
  let registrations = readRegistrations();
  let courses = readCourses();

  const registrationIndex = registrations.findIndex(
    (r) => r.id === registrationId
  );

  if (registrationIndex === -1) {
    return { error: "REGISTRATION_NOT_FOUND" };
  }

  const registration = registrations[registrationIndex];

  // Remove the registration from the list
  registrations.splice(registrationIndex, 1);
  fs.writeFileSync(REGISTRATION_FILE, JSON.stringify(registrations, null, 2));

  // Remove employee ID from the registered list in the course
  const course = courses.find((c) => c.id === registration.courseId);
  if (course) {
    course.registeredEmployees = course.registeredEmployees.filter(
      (id) => id !== registrationId
    );
    fs.writeFileSync(COURSE_FILE, JSON.stringify(courses, null, 2));
  }

  return { message: "Registration canceled successfully", registrationId };
};

export const getRegistrationsByCourse = (courseId) => {
  const registrations = readRegistrations();
  return registrations.filter((r) => r.courseId === courseId);
};
