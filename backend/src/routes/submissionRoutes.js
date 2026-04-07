import { Router } from "express";
import * as controller from "../controllers/submissionController.js";

const router = Router();

router.post("/", controller.submit);
router.get("/exam/:exam_id", controller.getByExam);
router.get("/:id", controller.getOne);

export default router;
