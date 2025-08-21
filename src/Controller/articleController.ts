import { Request, Response } from "express";
import { ArticleRepository } from "../repositories/articleRepository";

const repo = new ArticleRepository();

export class ArticleController {

  // Create new article
  async insert(req: Request, res: Response) {
    try {
      const { title, description, content, creationDate, author, category } = req.body;

      const existing = await repo.findArticleByName(title);
      if (existing) {
        res.status(400).json({ message: "Article title already in use." });
        return;
      }

      const article = await repo.createArticle(title, description, content, creationDate, author, category);
      res.status(201).json({ message: "Article created successfully.", article });
    } catch (error) {
      res.status(500).json({ message: "Error creating article", details: error });
    }
  }

  // List all articles
  async findAll(req: Request, res: Response) {
    try {
      const articles = await repo.findAllArticles();
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: "Error fetching articles", details: error });
    }
  }

  // Find article by ID
  async findById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      const article = await repo.findArticleById(id);
      if (!article) {
        res.status(404).json({ message: "Article not found." });
        return;
      }

      const authorName = article.autor?.userName || "Autor desconhecido";

    res.json({
      ...article,
        authorName: article.autor?.userName || "Autor desconhecido"
    });

    } catch (error) {
      res.status(500).json({ message: "Error fetching article", details: error });
    }
  }

  
async update(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id, 10);
    const { titleArticle, descArticle, contentArticle, category } = req.body;

    const updateFields = { titleArticle, descArticle, contentArticle, category };
    const updated = await repo.updateArticle(id, updateFields);

    if (!updated) {
      res.status(404).json({ message: "Article not found." });
      return;
    }

    res.json({ message: "Article updated successfully.", updated });
  } catch (error) {
    res.status(500).json({ message: "Error updating article", details: error });
  }
}
  // Delete article
  async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      const deleted = await repo.deleteArticle(id);

      if (!deleted) {
        res.status(404).json({ message: "Article not found." });
        return;
      }

      res.json({ message: "Article deleted successfully." });
    } catch (error) {
      res.status(500).json({ message: "Error deleting article", details: error });
    }
  }
}