import { Router } from "express";
import { UserController } from "../Controller/userController";
import {AuthMiddleware} from '../middleware/AuthMiddleware';

const router: Router = Router();
const controller = new UserController()

router.post('/user', controller.register);
router.get('/user/:id', AuthMiddleware, controller.getById);
router.get('/user', AuthMiddleware, controller.getAll);
router.post('/user/login', controller.login);
router.put('/user/:id', AuthMiddleware, controller.update);
router.put('/user/:id/senha', AuthMiddleware ,controller.updatePassword);
router.delete('/user/:id', AuthMiddleware, controller.delete);

export default router;