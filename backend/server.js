/**
 * Arquivo principal do servidor backend.
 *
 * @date 12/10/2025
 * @author Lis Peixoto
 */

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

// Importa as rotas
import horariosRoutes from "./routes/HorarioRoutes.js"; // atenção ao nome do arquivo!

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rotas
app.use("/horarios", horariosRoutes);

// Rota raiz para teste
app.get("/", (req, res) => {
  res.send("Servidor backend funcionando!");
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
