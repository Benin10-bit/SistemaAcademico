import { sql } from "../config/db.js";
import { randomUUID } from "crypto";

export default class UsersDatabase {

  /**
   * Lista usuários no banco de dados.
   * Se um parâmetro de pesquisa for fornecido, aplica um filtro por e-mail.
   * Caso contrário, retorna todos os registros da tabela users.
   */
  static async List(search = "") {
    if (search) {
      // Busca usuários com e-mail correspondente ao argumento fornecido
      return await sql`SELECT * FROM users WHERE email = ${search}`;
    } else {
      // Retorna todos os usuários cadastrados
      return await sql`SELECT * FROM users`;
    }
  }

  /**
   * Cria um novo usuário no banco de dados.
   * Gera um UUID para utilizar como ID primário e insere o novo registro.
   * Retorna os dados principais do usuário criado.
   */
  static async Create(user) {
    const { nome, email, senhaHash } = user;

    // Gera um identificador único para o novo usuário
    const newId = randomUUID();

    try {
      // Insere o usuário no banco de dados com os campos obrigatórios
      await sql`
        INSERT INTO users (id, nome, email, senha_hash)
        VALUES (${newId}, ${nome}, ${email}, ${senhaHash})
      `;

      // Retorna os dados essenciais do usuário recém-criado
      return { id: newId, nome, email };
    } catch (err) {
      // Retorna o erro capturado em caso de falha na inserção
      return err;
    }
  }
}
