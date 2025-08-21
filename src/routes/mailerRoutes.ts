 import { Router, RequestHandler } from "express";
 import nodemailer from "nodemailer";

 const router = Router();

 interface FeedbackBody {
     message: string;
 }

 const sendFeedback: RequestHandler<{}, {}, FeedbackBody> = async (req, res) => {
     const { message } = req.body;

     if (!message || message.trim() === "") {
         res.status(400).json({ error: "Mensagem vazia" });
         return;
     }

     try {
         const transporter = nodemailer.createTransport({
             host: "smtp.gmail.com",
             port: 587,
             secure: false,
             auth: {
                 user: process.env.EMAIL_USER,
                 pass: process.env.EMAIL_PASS, // senha de app do Gmail
             },
         });

         await transporter.sendMail({
             from: `"Suporte" <${process.env.EMAIL_USER}>`,
             to: process.env.EMAIL_USER,
             subject: "Feedback do usuário",
             text: message,
             html: `<p>${message}</p>`,
         });

         res.json({ success: true, message: "Email enviado com sucesso!" });
     } catch (error) {
         console.error("Erro ao enviar email:", error);
         res.status(500).json({ error: "Erro ao enviar email" });
     }
 };

 router.post("/send-feedback", sendFeedback);

 export default router;
