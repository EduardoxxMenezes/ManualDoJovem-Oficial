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
import resetPasswordRoutes from "./routes/resetPasswordRoutes"; // Importa as rotas de redefinição de senha
import dotenv from "dotenv";
dotenv.config();

const app: Application = express();


app.use( // Adicionado http://127.0.0.1:5501 para corrigir o erro de CORS
  cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:5500', 'http://127.0.0.1:5501'],
    credentials: true
  })
);


app.use(cookieParser());
app.use(express.json({limit: '10mb'}));  // Permite ao servidor analisar solicitações JSON recebidas
app.use(express.urlencoded({ limit: '10mb', extended: true })); // Permite analisar corpos de solicitação com dados codificados em URL

// Rotas da API
app.use("/api", userRoutes);
app.use("/api", articleRoutes);
app.use("/api", commentRoutes);
app.use("/api", mailerRoutes);
app.use("/api", resetPasswordRoutes); // Adiciona as novas rotas à aplicação

// Arquivos estáticos
app.use(express.static('view'));

// Rota raiz (exemplo)
app.get('/teste-buscar', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// Inicializa a conexão com o banco de dados e, em seguida, inicia o servidor
AppDataSource.initialize()
  .then(() => {
    app.listen(3000, () => {
      console.log("Servidor rodando 🚀");
      console.log("Porta: localhost:3000");
    });
  })
  .catch((error) => {
    console.error("Erro ao inicializar o banco de dados:", error);
  });