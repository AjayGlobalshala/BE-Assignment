import express, { Express, Request, Response } from "express";
import courseRoutes from "./routes/courseRoutes";
import registrationRoutes from "./routes/registrationRoutes";

const app: Express = express();
const PORT: number = 3000;

// Middleware to parse JSON body
app.use(express.json());

// course and registration routes
app.use("/api", courseRoutes);
app.use("/api", registrationRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to my courses.");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
