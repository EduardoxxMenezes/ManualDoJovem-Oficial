import { Router } from "express";
import { UserController } from "../Controller/userController";
import { AuthMiddleware } from '../middleware/AuthMiddleware';

const router: Router = Router();
const controller = new UserController();

// Rotas públicas (não exigem autenticação)
router.post('/user', controller.register);
router.post('/user/login', controller.login);
router.put('/user/reset-password', controller.resetPassword);

// Rotas protegidas (exigem autenticação via token)
router.get('/user/:id', AuthMiddleware, controller.getById);
router.get('/user', AuthMiddleware, controller.getAll);
router.put('/user/:id', AuthMiddleware, controller.update);
router.put('/user/:id/senha', AuthMiddleware, controller.updatePassword);
router.delete('/user/:id', AuthMiddleware, controller.delete);

export default router;