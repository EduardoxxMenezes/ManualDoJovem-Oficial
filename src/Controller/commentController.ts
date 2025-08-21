import { Comment } from './../Model/Comments';
import { CreateDateColumn } from 'typeorm';
import { Request, Response } from "express";
import { CommentRepository } from "../repositories/commentsRepository";

const repo = new CommentRepository();

export class CommentController {

  // Inserir novo comentário
   async inserir(req: Request, res: Response) {
    try {
     const { author, commentContent, article } = req.body;
      const Comment= await repo.createComment(author, commentContent, article);
      const artigoExiste = await repo.findCommentByArticle(article);
      if (!artigoExiste) {
      res.status(400).json({ message: "Artigo não encontrado." });
      return;
      }

      const comentario = await repo.createComment(author, commentContent, article);
      res.status(201).json({ message: "Comentário criado com sucesso.", comentario });
    } catch (error) {
      res.status(500).json({ error: "Erro ao criar comentário", details: error });
    }
  }

  // Listar todos os comentários
   async listarTodos(req: Request, res: Response) {
    try {
      const comentarios = await repo.findAllComments();
      res.json(comentarios);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar comentários", details: error });
    }
  }

  // Buscar comentário por ID
   async encontrarPorId(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const comentario = await repo.findCommentById(id);
      if (!comentario) {
      res.status(404).json({ message: "Comentário não encontrado." });
      return
      }

      res.json(comentario);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar comentário", details: error });
    }
  }

  // Atualizar comentário
   async atualizar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const { autor, conteudoComentario, dataCriacao, article } = req.body;

      const camposAtualizar = { autor, conteudoComentario, dataCriacao, article };
      const atualizado = await repo.updateComment(id, camposAtualizar);

      if (!atualizado) {
         res.status(404).json({ message: "Comentário não encontrado." });
         return;
      }

      res.json({ message: "Comentário atualizado com sucesso.", atualizado });
    } catch (error) {
      res.status(500).json({ message: "Erro ao atualizar comentário", details: error });
    }
  }

  // Deletar comentário
   async deletar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const deletado = await repo.deleteComment(id);

      if (!deletado) {
        res.status(404).json({ message: "Comentário não encontrado." });
        return;
      }

      res.json({ message: "Comentário deletado com sucesso." });
    } catch (error) {
      res.status(500).json({ message: "Erro ao deletar comentário", details: error });
    }
  }

}
