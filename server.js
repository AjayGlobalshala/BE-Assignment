// server.js
import express from "express";
import courseRoutes from "./src/routes/courseRoutes.js";
import registrationRoutes from "./src/routes/registrationRoutes.js";

const app = express();
const PORT = 3000;

// Middleware to parse JSON body
app.use(express.json());

// Use course routes
app.use("/api/courses", courseRoutes);
app.use("/api/registrations", registrationRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to my courses.");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
