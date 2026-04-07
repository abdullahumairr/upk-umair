import { Router } from "express";
import * as controller from "../controllers/examController.js";

const router = Router();

router.get("/", controller.getAll);
router.get("/:id", controller.getOne);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.patch("/:id/publish", controller.publish);
router.delete("/:id", controller.remove);

export default router;
