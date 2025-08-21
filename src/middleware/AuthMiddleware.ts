import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Tipagem do payload JWT
interface JwtPayloadCustom extends jwt.JwtPayload {
    id: number;
    email: string;
}

// Tipagem do Request com o usuário autenticado
declare global {
    namespace Express {
        interface Request {
            user?: JwtPayloadCustom; // Adiciona a propriedade user ao Request
        }
    }
}

// Garantir que a secret exista
if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not defined");
}

const JWT_SECRET = process.env.JWT_SECRET;

export function AuthMiddleware(req: Request, res: Response, next: NextFunction) {

    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    // Verifica se o token existe
    if (!token) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayloadCustom;
        req.user = decoded;
        next();
    } catch (error) {
        
        // Log para verificar o erro de token expirado
        res.clearCookie("token", {
            httpOnly: true,                                 // Define o cookie como HttpOnly (não acessível via JavaScript)
            secure: process.env.NODE_ENV === "production",  // Define o cookie como seguro (só enviado via HTTPS em produção)
            sameSite: "none"                                // Permite o envio do cookie em requisições cross-site (sem restrições)
        });

        if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json({ message: 'Token expired' });
            return;
        }
        res.status(401).json({ message: 'Invalid token' });
        return;
    }
}
