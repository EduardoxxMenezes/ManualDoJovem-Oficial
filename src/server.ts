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
import resetPasswordRoutes from "./routes/resetPasswordRoutes"; 
import dotenv from "dotenv";
dotenv.config();

const app: Application = express();


app.use( 
  cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:5500', 'http://127.0.0.1:5501'],
    credentials: true
  })
);


app.use(cookieParser());
app.use(express.json({limit: '10mb'}));  
app.use(express.urlencoded({ limit: '10mb', extended: true })); 

app.use("/api", userRoutes);
app.use("/api", articleRoutes);
app.use("/api", commentRoutes);
app.use("/api", mailerRoutes);
app.use("/api", resetPasswordRoutes); 


app.use(express.static('view'));


app.get('/teste-buscar', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});


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
