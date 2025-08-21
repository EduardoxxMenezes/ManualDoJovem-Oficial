import { Request, Response } from "express";
import { UserRepository } from "../repositories/UserRepository";
import nodemailer from "nodemailer";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const repo = new UserRepository();

export class ResetPasswordController {
  async sendCode(req: Request, res: Response) {
    const { email } = req.body;
    const user = await repo.findUserByEmail(email);

    if (!user) {
        res.status(404).json({ message: "Usuário não encontrado." })
      return ;
    }

    const code = crypto.randomBytes(4).toString("hex").toUpperCase();
    const expires = new Date(Date.now() + 3600000); // 1 hora

    user.resetPasswordToken = code;
    user.resetPasswordExpires = expires;

    await repo.updateUser(user.id, {
      resetPasswordToken: code,
      resetPasswordExpires: expires,
    });

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    try {
      await transporter.sendMail({
        from: `"Suporte" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Código de Recuperação de Senha",
        text: `Seu código de recuperação de senha é: ${code}`,
        html: `<p>Seu código de recuperação de senha é: <b>${code}</b></p>`,
      });
      res.json({ success: true, message: "Email com código enviado!" });
    } catch (error) {
      console.error("Erro ao enviar email:", error);
      res.status(500).json({ error: "Erro ao enviar email de recuperação." });
    }
  }

  async verifyCode(req: Request, res: Response) {
    const { email, code } = req.body;
    const user = await repo.findUserByEmail(email);

    if (
      !user ||
      user.resetPasswordToken !== code ||
      !user.resetPasswordExpires ||
      user.resetPasswordExpires < new Date()
    ) {
        res.status(400).json({ message: "Código inválido ou expirado." })
      return;
    }

    res.json({ success: true, message: "Código verificado com sucesso." });
  }
}