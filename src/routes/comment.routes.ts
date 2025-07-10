import { Router } from "express";
import { commentController } from "../controllers/comment.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/", authMiddleware, commentController.create);
router.get("/post/:postId", commentController.findByPost);
router.delete("/:id", authMiddleware, commentController.remove);

export default router;
