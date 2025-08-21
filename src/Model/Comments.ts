import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { Article } from './Articles';

@Entity('Comment')
export class Comment {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Article, (article) => article.comments, { eager: true })
    article: Article;

@ManyToOne(() => User, (user) => user.comments, { eager: true })
@JoinColumn({ name: 'authorId' }) 
author: User | null;

    @Column({ type: 'varchar', length: 500, nullable: false })
    commentContent: string;
    
    @CreateDateColumn()
    createdAt!: Date;

    constructor(author: User, commentContent: string, article: Article) {
        this.author = author;
        this.commentContent = commentContent;
        this.article = article;
    }
}
