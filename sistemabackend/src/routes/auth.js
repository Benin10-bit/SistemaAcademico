import express from "express";
import { login, register } from "../controllers/authController.js";
import { validatePassword } from "../middlewares/validatePassword.js";

const authRoutes = express.Router();

// Rota de login; recebe email e senha e retorna token em cookie HttpOnly
authRoutes.post("/login", login);

// Rota de registro; valida a senha antes de criar o usuário
authRoutes.post("/register", validatePassword, register);

// Exporta o conjunto de rotas de autenticação
export default authRoutes;
