import "dotenv/config"; // Carrega automaticamente as variáveis definidas no arquivo .env
import http from "http"; // Módulo nativo do Node para criação de servidores HTTP
import { neon } from "@neondatabase/serverless"; // Cliente serverless para conexão com PostgreSQL (Neon)


// Inicializa a conexão com o banco utilizando a URL presente nas variáveis de ambiente
const sql = neon(process.env.DATABASE_URL);

// Exporta a instância do banco e o módulo http para uso em outras partes da aplicação
export { sql, http };
