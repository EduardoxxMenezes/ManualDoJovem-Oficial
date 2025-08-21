import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './User';
import { Comment } from './Comments';

export enum options {
    professional = 'profissional',
    personal = 'pessoal',
    financial = 'financeiro',
    none = 'none'
}

@Entity('Article')
export class Article {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: 100, nullable: false })
    titleArticle: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    descArticle: string;

    @Column({ type: 'text', nullable: false })
    contentArticle: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

   @ManyToOne(() => User, user => user.articles, {
  nullable: true,
  onDelete: 'SET NULL',
  eager: true
    })
    @JoinColumn({ name: 'autor_id' })
    autor: User | null;

    @OneToMany(() => Comment, (comment) => comment.article)
    comments?: Comment[];

    @Column({ type: 'enum', enum: options, nullable: false })
    category: options;

    constructor(
        titleArticle: string,
        descArticle: string,
        contentArticle: string,
        createdAt: Date,
        autor: User,
        category: options = options.none,
        comments?: Comment[]
    ) {
        this.titleArticle = titleArticle;
        this.descArticle = descArticle;
        this.contentArticle = contentArticle;
        this.createdAt = createdAt;
        this.autor = autor;
        this.category = category;
        if (comments) this.comments = comments;
    }
}