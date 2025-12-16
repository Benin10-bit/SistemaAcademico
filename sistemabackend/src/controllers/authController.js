import UserService from "../services/authService.js";

export async function login(req, res) {
  try {
    // Obtém apenas email e senha enviados pelo cliente
    const { email, senha } = req.body;

    // Chama o service responsável por validar credenciais
    // e gerar o token JWT caso tudo esteja correto
    const token = await UserService.LoginUsers({ email, senha });

    // Envia o token como cookie HttpOnly para maior segurança
    res.cookie("token", token, {
      httpOnly: true, // Impede acesso ao cookie via JavaScript no navegador
      secure: true,   // Exige HTTPS
      maxAge: 3600000, // Tempo de vida de 1 hora
      sameSite: "none", // Necessário quando front e API estão em domínios distintos
      path: "/",        // Disponível para toda a aplicação
    });

    // Retorna confirmação de login bem-sucedido
    return res.status(200).json({
      success: true,
      message: "Login bem-sucedido",
    });

  } catch (err) {
    // Captura qualquer erro lançado pelo service
    return res.status(401).json({ error: err.message });
  }
}

export async function register(req, res) {
  try {
    // Obtém os dados necessários para criação do usuário
    const { nome, email, senha } = req.body;

    // Chama o service responsável por criar o usuário no banco
    const user = await UserService.RegisterUsers({ nome, email, senha });

    // Retorna usuário criado (exceto senha, já tratada no service)
    return res
      .status(201)
      .json({ message: "Usuário criado com sucesso", user });

  } catch (err) {
    // Captura erros do service, como email duplicado ou dados inválidos
    return res.status(400).json({ error: err.message });
  }
}
