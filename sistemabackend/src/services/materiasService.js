// Importa o modelo de banco de dados em memória
import MateriasDatabase from "../models/materiasModel.js";

// Instância única do banco de dados em memória
const dataBase = new MateriasDatabase();

/**
 * Função utilitária para validar notas.
 * Somente valores entre 0 e 100 são aceitos.
 * Se válido, a nota é arredondada para o inteiro mais próximo.
 */
function validateNota(nota) {
  if (nota >= 0 && nota <= 100) {
    return Math.round(nota);
  }
  throw new Error("Nota inválida");
}

class MateriasService {
  /**
   * Lista matérias, com ou sem termo de busca.
   * Caso ocorra erro durante a listagem, retorna um objeto contendo a mensagem de erro.
   */
  async List(search = "") {
    try {
      return search
        ? await dataBase.List(search) // Retorna lista filtrada
        : await dataBase.List();      // Retorna lista completa
    } catch (err) {
      return { Error: err.message };
    }
  }

  /**
   * Cria uma nova matéria após validar todas as notas recebidas.
   * Retorna o item criado ou um objeto contendo a mensagem de erro.
   */
  Create({ nome, nota1, nota2, nota3, nota4, token }) {
    try {
      const data = {
        nome,
        nota1: validateNota(nota1),
        nota2: validateNota(nota2),
        nota3: validateNota(nota3),
        nota4: validateNota(nota4),
        token,
      };

      return dataBase.Create(data);
    } catch (err) {
      return { Error: err.message };
    }
  }

  /**
   * Edita uma matéria existente.
   * O comportamento depende da implementação de Edit no banco de dados.
   */
  Edit(id, data) {
    return dataBase.Edit(id, data);
  }

  /**
   * Remove uma matéria pelo ID.
   * Em caso de erro, retorna um objeto contendo a mensagem.
   */
  Remove(id) {
    try {
      return dataBase.Remove(id);
    } catch (err) {
      return { Error: err.message };
    }
  }
}

export default MateriasService;
