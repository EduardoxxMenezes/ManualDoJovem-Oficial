import { Request, Response } from "express";
import { UserRepository } from "../repositories/UserRepository";
import bcrypt from "bcryptjs";
import { User } from "../Model/User";
import AppDataSource from "../dataBase/dataSource";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as jwt.Secret;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not defined");
}

const repo = new UserRepository();

export class UserController {
  async register(req: Request, res: Response) {
    try {
      const { name, email, password, profilePic } = req.body;

      const existing = await repo.findUserByEmail(email);

      if (existing) {
        res.status(400).json({ message: "Email já em uso." });
        return;
      }

      const user = await repo.createUser(name, email, password, profilePic);
      if (!user) {
        res.status(500).json({ message: "Ops! Algo de errado não tá certo!" });
        return;
      }
      res.status(201).json(user);
      return;
    } catch (error) {
      res.status(500).json({ error: "Erro ao registrar usuário" });
      console.error("Erro ao registrar usuário", error);
      return;
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await repo.findUserByEmail(email);
      if (!user) {
        res.status(404).json({ message: "Usuário não encontrado." });
        return;
      }

      const isValid = await bcrypt.compare(password, user.userPassword);
      if (!isValid) {
        res.status(401).json({ message: "Senha inválida." });
        return;
      }

      const { userPassword: _, ...userWithoutPassword } = user;
      const token = jwt.sign(
        { id: user.id, email: user.userEmail },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        maxAge: 1000 * 60 * 60, // 1 hora
      });

      res.json({
        message: "Login autorizado",
        user: userWithoutPassword,
        token,
      });
    } catch (error) {
      res.status(500).json({ message: "Erro ao fazer login", details: error });
    }
  }
  async getAll(req: Request, res: Response) {
    try {
      const users = await repo.findAllUsers();
      res.json(users);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erro ao buscar usuários", details: error });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const user = await repo.findUserById(id);
      if (!user) {
        res.status(404).json({ message: "Usuário não encontrado." });
        return;
      }

      res.json(user);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erro ao buscar usuário", details: error });
      return;
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const { userName, userEmail, profilePic } = req.body;

      const fieldsToUpdate: any = { userName, userEmail, profilePic };
      if (userName) fieldsToUpdate.userName = userName;
      if (userEmail) fieldsToUpdate.userEmail = userEmail;
      if (profilePic) fieldsToUpdate.profilePic = profilePic;

      const updated = await repo.updateUser(id, fieldsToUpdate);

      if (!updated) {
        res.status(404).json({ message: "Usuário não encontrado." });
        return;
      }

      res.json({ message: "Usuário atualizado com sucesso.", updated });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erro ao atualizar usuário", details: error });
      return;
    }
  }

  async updatePassword(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const { novaSenha } = req.body;

      const user = await repo.findUserById(id);
      if (!user) {
        res.status(404).json({ message: "Usuário não encontrado." });
        return;
      }

      user.userPassword = novaSenha;
      user.setPreviousPassword(user.userPassword);

      await repo.updateUser(id, { userPassword: novaSenha });

      res.json({ message: "Senha atualizada com sucesso." });
      return;
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erro ao atualizar senha.", details: error });
      return;
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const { email, newPassword } = req.body;

      const user = await repo.findUserByEmail(email);
      if (!user) {
        res.status(404).json({ message: "Usuário não encontrado." });
        return;
      }

      user.userPassword = newPassword;
      user.setPreviousPassword(user.userPassword);

      await repo.updateUser(user.id, { userPassword: newPassword });

      res.json({ message: "Senha atualizada com sucesso." });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erro ao atualizar senha.", details: error });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const deleted = await repo.deleteUser(id);

      if (!deleted) {
        res.status(404).json({ message: "Usuário não encontrado." });
        return;
      }

      res.json({ message: "Usuário deletado com sucesso." });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erro ao deletar usuário", details: error });
      return;
    }
  }
}