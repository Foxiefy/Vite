/**
 * Esta classe implementa a conexão com o banco de dados MySQL.
 *
 * @date 12/10/2025
 * @author Lis Peixoto
 */
import mysql from "mysql2";

const connect = mysql.createConnection({
    host: "localhost",
    user: "lis",
    password: "lis123", // corrigido
    database: "escola"   // ou "escola", conforme o banco criado
});

connect.connect((err) => {
  if (err) {
    console.error("Erro ao conectar ao MySQL:", err);
  } else {
    console.log("✅ Conectado ao MySQL");
  }
});

export default connect;
