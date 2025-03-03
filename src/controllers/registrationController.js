import { registerEmployee } from "../models/registrationModel.js";
import { cancelRegistration } from "../models/registrationModel.js";
export const registerForCourse = (req, res) => {
  const { name, email, courseId } = req.body;

  if (!name || !email || !courseId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const result = registerEmployee({ name, email, courseId });

  if (result.error) {
    return res.status(400).json({ error: result.error });
  }

  return res.status(201).json(result);
};

export const cancelCourseRegistration = (req, res) => {
  const { registrationId } = req.params;

  const result = cancelRegistration(registrationId);

  if (result.error) {
    return res.status(404).json({ error: result.error });
  }

  return res.status(200).json(result);
};
