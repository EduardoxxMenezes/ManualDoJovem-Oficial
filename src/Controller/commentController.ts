import { Request, Response } from "express";
import { CommentRepository } from "../repositories/commentsRepository";
import { ArticleRepository } from "../repositories/articleRepository"; // Importe o ArticleRepository
import { UserRepository } from "../repositories/UserRepository"; // Importe o UserRepository

const commentRepo = new CommentRepository();
const articleRepo = new ArticleRepository(); // Instancie o ArticleRepository
const userRepo = new UserRepository(); // Instancie o UserRepository

export class CommentController {

  // Inserir novo comentário
  async inserir(req: Request, res: Response) {
    try {
      const { author: authorId, commentContent, article: articleId } = req.body;

      // 1. Valida se o artigo existe
      const article = await articleRepo.findArticleById(articleId);
      if (!article) {
         res.status(404).json({ message: "Artigo não encontrado." });
        return
      }

      // 2. Valida se o autor (usuário) existe
      const author = await userRepo.findUserById(authorId);
      if (!author) {
        res.status(404).json({ message: "Usuário autor não encontrado." });
          return 
      }

      // 3. Cria o comentário
      const comentario = await commentRepo.createComment(author, commentContent, article);

      // 4. Envia uma resposta de sucesso
      res.status(201).json({ message: "Comentário criado com sucesso.", comentario });
    } catch (error) {
      console.error("Error creating comment:", error); // Log do erro completo no servidor
      res.status(500).json({ error: "Erro ao criar comentário", details: (error as Error).message });
    }
  }

  // Listar todos os comentários
   async listarTodos(req: Request, res: Response) {
    try {
      const comentarios = await commentRepo.findAllComments();
      res.json(comentarios);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar comentários", details: error });
    }
  }

  // Buscar comentário por ID
   async encontrarPorId(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const comentario = await commentRepo.findCommentById(id);
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
      const atualizado = await commentRepo.updateComment(id, camposAtualizar);

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
      const deletado = await commentRepo.deleteComment(id);

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