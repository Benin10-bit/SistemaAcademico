import { sql } from "../config/db";

class MateriasDatabase {
  /**
   * Lista matérias armazenadas no banco de dados.
   * Caso seja fornecido um termo de busca, aplica um filtro utilizando ILIKE,
   * permitindo buscas parciais e sem diferenciação entre maiúsculas e minúsculas.
   */
  async List(search = "") {
    if (search) {
      return await sql`
        SELECT * FROM materias 
        WHERE nome ILIKE ${"%" + search + "%"}
      `;
    }

    // Retorna todas as matérias quando não há parâmetro de busca
    return await sql`SELECT * FROM materias`;
  }

  /**
   * Cria uma nova matéria no banco de dados.
   * Insere nome, quatro notas e o ID do usuário responsável pelo registro.
   */
  async Create({ nome, nota1, nota2, nota3, nota4, userId }) {
    return await sql`
      INSERT INTO materias (nome, nota1, nota2, nota3, nota4, user_id)
      VALUES (${nome}, ${nota1}, ${nota2}, ${nota3}, ${nota4}, ${userId})
    `;
  }

  /**
   * Atualiza uma matéria existente com base no ID informado.
   * Os campos nome e notas são sobrescritos pelos dados fornecidos.
   */
  async Edit(id, data) {
    return sql`
      UPDATE materias 
      SET nome = ${data.nome},
          nota1 = ${data.nota1},
          nota2 = ${data.nota2},
          nota3 = ${data.nota3},
          nota4 = ${data.nota4}
      WHERE id = ${id}
    `;
  }

  /**
   * Remove uma matéria definitivamente do banco de dados
   * conforme o ID fornecido.
   */
  async Remove(id) {
    return sql`DELETE FROM materias WHERE id = ${id}`;
  }
}

export default MateriasDatabase;
