import { addCourse } from "../models/courseModel.js";

const createCourse = (req, res) => {
  const { title, instructor, date, minEmployees, maxEmployees } = req.body;

  if (!title || !instructor || !date || !minEmployees || !maxEmployees) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const course = addCourse(title, instructor, date, minEmployees, maxEmployees);

  if (!course) {
    return res.status(500).json({ error: "Failed to add course" });
  }
  console.log(course.name);

  return res.status(201).json({ message: "Course added successfully", course });
};

export { createCourse };
