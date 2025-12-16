// Importa a camada de acesso ao banco de dados de usuários
import UsersDatabase from "../models/authModel.js";

// Importa a biblioteca para hashing de senhas
import bcrypt from "bcryptjs";

// Importa o gerador e verificador de tokens JWT
import jwt from "jsonwebtoken";

export default class UserService {
  /**
   * Registra novos usuários no sistema.
   * Valida se o e-mail já está cadastrado, criptografa a senha
   * e envia os dados para o banco.
   */
  static async RegisterUsers({ nome, email, senha }) {
    // Verifica se já existe usuário com o e-mail informado
    const existingUser = await UsersDatabase.List(email);
    if (existingUser.length > 0) {
      throw new Error("Usuário Existente");
    }

    // Gera o hash da senha com um fator de custo 10
    const senhaHash = await bcrypt.hash(String(senha), 10);

    // Cria o usuário no banco de dados
    const newUser = await UsersDatabase.Create({
      nome,
      email,
      senhaHash,
    });

    return newUser;
  }

  /**
   * Realiza o login do usuário.
   * Verifica se o e-mail existe, compara a senha enviada com a senha salva
   * e retorna um token JWT válido.
   */
  static async LoginUsers({ email, senha }) {
    // Busca usuários pelo e-mail
    const users = await UsersDatabase.List(email);

    // Se nenhum usuário for encontrado, retorna erro
    if (users.length === 0) throw new Error("Credenciais incorretas");

    // Seleciona o primeiro usuário retornado
    const user = users[0];

    // Compara a senha fornecida com o hash armazenado no banco
    const isValid = await bcrypt.compare(
      String(senha),
      String(user.senha_hash)
    );

    if (!isValid) throw new Error("Credenciais incorretas");

    /**
     * Cria o token JWT contendo:
     * - id do usuário
     * - nome
     * - email
     * O token é assinado com a chave secreta e expira em 1 hora.
     */
    const token = jwt.sign(
      { id: user.id, name: user.nome, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return token;
  }
}

// Lê a chave secreta do ambiente para validação do token
const SECRET = process.env.JWT_SECRET;

/**
 * Função responsável por verificar e decodificar um token JWT.
 * Caso o token seja inválido ou tenha expirado, um erro é lançado.
 */
export function verifyToken(token) {
  try {
    // Verifica a assinatura e decodifica o conteúdo do token
    const decoded = jwt.verify(token, SECRET);
    return decoded;
  } catch (err) {
    // Token expirado ou inválido
    throw new Error("Token inválido ou expirado");
  }
}
