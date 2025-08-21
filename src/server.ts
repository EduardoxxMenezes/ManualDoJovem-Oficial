
import cookieParser from 'cookie-parser';
import { error } from "console";
import AppDataSource from "./dataBase/dataSource";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import path from "path";
import userRoutes from "./routes/UserRoutes";
import articleRoutes from "./routes/ArticleRoutes";
import commentRoutes from "./routes/CommentRoutes";
import mailerRoutes from "./routes/mailerRoutes";
import dotenv from "dotenv";
  dotenv.config();

const app: Application = express();


app.use( //vai encontrar o link dos negocios, já que os links são diferentes do front e do back, o cors garante que não ocorra nenhum erro.
  cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:5500'],
    credentials: true 
  })
);


app.use(cookieParser());
app.use(express.json({limit: '10mb'}));  //permite ao seu servidor analisar solicitações recebidas (informações enviadas pelo usuário)
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Rotas da API
app.use("/api", userRoutes);
app.use("/api", articleRoutes); 
app.use("/api", commentRoutes);
 app.use("/api", mailerRoutes);

// Arquivos estáticos
app.use(express.static('view'));

// Rota raiz
app.get('/teste-buscar', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// Inicializa conexão com banco e depois inicia servidor
AppDataSource.initialize()
  .then(() => {
    app.listen(3000, () => {
      console.log("Servidor rodando 🚀");
      console.log("Porta: localhost:3000");
    });
  })
  .catch((error) => {
    console.error(error);
  });