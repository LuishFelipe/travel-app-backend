import { Router } from "express";
import { postController } from "../controllers/post.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/", authMiddleware, postController.create);
router.get("/", authMiddleware, postController.findAll);
router.get("/:id", authMiddleware, postController.findOne);
router.get("/tag/:tag", authMiddleware, postController.findByTag);
router.put("/:id", authMiddleware, postController.update);
router.delete("/:id", authMiddleware, postController.remove);

export default router;