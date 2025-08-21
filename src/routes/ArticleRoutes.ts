import { Router } from "express";
import { ArticleController } from "../Controller/articleController";
import { AuthMiddleware } from '../middleware/AuthMiddleware';

const router: Router = Router();
const controller = new ArticleController();

router.post('/articles', AuthMiddleware, controller.insert);
router.get('/articles/:id', AuthMiddleware, controller.findById);
router.get('/articles', AuthMiddleware, controller.findAll);
router.put('/articles/:id', AuthMiddleware, controller.update);
router.delete('/articles/:id', AuthMiddleware, controller.delete);

export default router;
