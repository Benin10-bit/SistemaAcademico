import { verifyToken } from "../services/authService.js";

/**
 * Middleware responsável por validar tokens JWT enviados nas requisições.
 * Garante que apenas usuários autenticados tenham acesso às rotas protegidas.
 * O token deve vir no cabeçalho Authorization no formato: "Bearer <token>".
 */
export function authMiddleware(req, res, next) {
  try {
    // Obtém o cabeçalho Authorization enviado pelo cliente
    const authHeader = req.headers["authorization"];

    // Impede o acesso caso o cabeçalho não exista
    if (!authHeader) {
      return res.status(401).json({ message: "Token ausente" });
    }

    // Divide o cabeçalho para verificar se está no formato "Bearer <token>"
    const tokenParts = authHeader.split(" ");

    // Verifica se o formato do token está correto
    if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
      return res.status(401).json({ message: "Formato de token inválido" });
    }

    // Extrai o token puro sem o prefixo "Bearer"
    const token = tokenParts[1];

    // Decodifica e valida o token utilizando o serviço de autenticação
    const userData = verifyToken(token);

    // Caso o token não seja válido ou tenha expirado, impede o acesso
    if (!userData) {
      return res.status(401).json({ message: "Token inválido ou expirado" });
    }

    /**
     * Armazena os dados decodificados do token no objeto req.
     * Isso permite que as rotas acessadas recuperem informações como id,
     * email ou nome do usuário autenticado.
     */
    req.user = userData;

    // Libera a execução para a próxima função da cadeia de middlewares
    next();

  } catch (err) {
    // Captura falhas inesperadas e retorna erro de autenticação
    console.error("Erro no middleware auth:", err);
    res.status(401).json({ message: "Token inválido ou expirado" });
  }
}
