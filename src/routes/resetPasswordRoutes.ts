import { Router } from "express";
import { ResetPasswordController } from "../Controller/resetPasswordController";

const router: Router = Router();
const controller = new ResetPasswordController();

// Rota para solicitar o envio do código de verificação por e-mail
router.post("/send-reset-code", controller.sendCode);

// Rota para verificar se o código fornecido pelo usuário é válido
router.post("/verify-reset-code", controller.verifyCode);

export default router;