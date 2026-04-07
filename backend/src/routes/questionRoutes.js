import { Router } from "express";
import * as controller from "../controllers/questionController.js";
import upload from "../config/multer.js";

const router = Router();

router.get("/", controller.getAll);
router.get("/:id", controller.getOne);
router.post("/", upload.single("image"), controller.create);
router.put("/:id", upload.single("image"), controller.update);
router.delete("/:id", controller.remove);

export default router;
