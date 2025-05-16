import { Router } from "express";
import { userController } from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post('/', userController.create);
router.get('/', authMiddleware, userController.findAll);
router.get('/:id', authMiddleware, userController.findOne);
router.put('/:id', authMiddleware, userController.update);
router.delete('/:id', userController.remove);

export default router