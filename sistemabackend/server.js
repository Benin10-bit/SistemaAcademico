import express from "express";
import cors from "cors"
import materiasRoutes from "./src/routes/materias.js";
import authRoutes from "./src/routes/auth.js";

const server = express();

// Configuração de CORS para permitir acesso somente das origens especificadas
server.use(cors({
  origin: ["http://localhost:3000", "http://192.168.0.6:3000"],
  credentials: true // Permite envio de cookies e cabeçalhos de autenticação
}));

// Habilita o parse automático de JSON no corpo das requisições
server.use(express.json());

// Registra as rotas da aplicação
server.use("/materias", materiasRoutes); // Rotas relacionadas às matérias
server.use("/auth", authRoutes);        // Rotas de autenticação

// Inicializa o servidor HTTP na porta especificada
server.listen(1992, () => {
  console.log(`Servidor rodando na porta 1992`);
});
