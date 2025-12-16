import express from "express";
import { authMiddleware } from "../middlewares/auth.js";

const materiasRoutes = express.Router();

// Rota protegida que exige autenticação para acessar a página inicial
// O middleware valida o token e injeta os dados do usuário em req.user
materiasRoutes.get("/", authMiddleware, (req, res) => {
  return res.render("home");
});

// Exporta o conjunto de rotas relacionadas às matérias
export default materiasRoutes;
