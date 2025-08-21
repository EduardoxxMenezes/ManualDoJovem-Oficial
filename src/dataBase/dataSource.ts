import "reflect-metadata";
import { DataSource, DataSourceOptions } from "typeorm";
import dotenv from "dotenv";

dotenv.config();

// Flag para saber se estamos em produção
const isProduction = process.env.NODE_ENV === "production";

// Variáveis para configuração da conexão
let dataSourceOptions: DataSourceOptions;

if (isProduction) {
    
    // Em produção (ex: Render), usa a variável DATABASE_URL

    dataSourceOptions = {
        type: "postgres",                       // Tipo de banco de dados (no Render, geralmente é PostgreSQL)
        url: process.env.DATABASE_URL,          // URL de conexão do banco de dados
        ssl: { rejectUnauthorized: false },     // Necessário para conexões seguras
        entities: ["./dist/Model/*.js"],       // Caminho para os modelos compilados
        migrations: ["./dist/migrations/*.js"], // Caminho para as migrações compiladas
        synchronize: false,                     // Nunca usar synchronize em produção
        logging: false,                         // Desabilita logs SQL em produção
    };
} else {

    // Em desenvolvimento (local), usa variáveis separadas
    
    const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

  dataSourceOptions = {
    type: "mysql",
    host: DB_HOST,
    port: Number(DB_PORT),
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    entities: [__dirname + "/../Model/*.ts"], // Caminho absoluto para entidades TypeScript
    migrations: [__dirname + "/../migrations/*.ts"],
    synchronize: false,
    logging: true,
};
}

// Criação do DataSource com base nas opções acima
const AppDataSource = new DataSource(dataSourceOptions);
export default AppDataSource;
