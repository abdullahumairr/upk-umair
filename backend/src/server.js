import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import categoryRoutes from "./routes/categoryRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import examRoutes from "./routes/examRoutes.js";
import submissionRoutes from "./routes/submissionRoutes.js";
import errorHandler from "./middleware/errorHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/categories", categoryRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/submissions", submissionRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
