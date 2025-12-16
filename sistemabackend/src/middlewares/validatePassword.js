/**
 * Middleware responsável por validar a força da senha enviada no corpo da requisição.
 * Essa validação ocorre no back-end independentemente do front-end,
 * garantindo que regras mínimas de segurança sejam aplicadas.
 * Caso a senha seja inválida, o middleware interrompe o fluxo e retorna um erro.
 */
export function validatePassword(req, res, next) {
  const { senha } = req.body;
  const erros = [];

  // Verifica se o campo senha foi enviado
  if (!senha) {
    return res.status(400).json({ error: "A senha é obrigatória" });
  }

  // Regras de validação da senha
  if (senha.length < 8)
    erros.push("A senha deve ter pelo menos 8 caracteres");

  if (!/[A-Z]/.test(senha))
    erros.push("A senha deve ter pelo menos uma letra maiúscula");

  if (!/[a-z]/.test(senha))
    erros.push("A senha deve conter pelo menos uma letra minúscula");

  if (!/\d/.test(senha))
    erros.push("A senha deve conter pelo menos um número");

  if (!/[!@#$%^&*(),.?\":{}|<>]/.test(senha))
    erros.push("A senha deve conter pelo menos um caractere especial");

  // Caso uma ou mais regras não sejam atendidas, retorna erro consolidado
  if (erros.length > 0) {
    return res.status(400).json({ error: erros.join(" - ") });
  }

  // Se todas as validações forem satisfeitas, permite que a requisição continue
  next();
}
