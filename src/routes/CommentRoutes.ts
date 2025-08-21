import { Router } from "express";
import { CommentController } from "../Controller/commentController";
import {AuthMiddleware} from '../middleware/AuthMiddleware';
const router: Router = Router();
const controller = new CommentController()

router.post('/comments', AuthMiddleware,controller.inserir);
router.get('/comments/:id', AuthMiddleware ,controller.encontrarPorId);
router.get('/comments', AuthMiddleware ,controller.listarTodos);
router.put('/comments/:id', AuthMiddleware ,controller.atualizar);
router.delete('/comments/:id', AuthMiddleware ,controller.deletar);
 
export default router;
