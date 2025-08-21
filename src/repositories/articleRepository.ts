import { Article, options } from "../Model/Articles";
import { User } from "../Model/User";
import AppDataSource from "../dataBase/dataSource";

export class ArticleRepository {
  private reposit = AppDataSource.getRepository(Article);

  async createArticle(
    title: string,
    description: string,
    content: string,
    createdAt: Date,
    author: User,
    category: string
  ) {
    const newArticle = new Article(title, description, content, createdAt, author, category as options);
    return await this.reposit.save(newArticle);
  }

  async findArticleByName(name: string) {
    return await this.reposit.findOneBy({ titleArticle: name });
  }
  
async findArticleById(id: number) {
    return await this.reposit.findOne({
        where: { id },
        relations: ["comments", "comments.author", "autor"], 
    });
}
  async updateArticle(id: number, fields: Partial<Article>) {
    const existing = await this.findArticleById(id);
    if (!existing) return null;

    Object.assign(existing, fields);
    return await this.reposit.save(existing);
  }

  async deleteArticle(id: number) {
    const existing = await this.findArticleById(id);
    if (!existing) return null;
    return await this.reposit.remove(existing);
  }

  async findAllArticles() {
    return await this.reposit.find();
  }
}
