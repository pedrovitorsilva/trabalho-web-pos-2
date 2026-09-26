import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import connectToDatabase from "./config/dbConnect.js";
import rotasResgate from "./routes/routes_resgate.js";

const NOME_SERVICO = process.env.NOME_SERVICO || "miguel-resgates";
const PORTA = Number(process.env.PORT) || 8000;

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    servico: NOME_SERVICO,
    descricao: "API de resgates de promoções do Mercadinho São Miguel",
    rotas: ["/resgate", "/health"],
  });
});

app.get("/health", (req, res) => {
  const conectado = mongoose.connection.readyState === 1;
  res.status(conectado ? 200 : 503).json({
    servico: NOME_SERVICO,
    banco: conectado ? "conectado" : "desconectado",
  });
});

app.use("/resgate", rotasResgate);

app.use((req, res) => {
  res.status(404).json({ error: `Rota não encontrada: ${req.originalUrl}` });
});

app.use((erro, req, res, next) => {
  console.error("Erro na requisição:", erro.message);
  res.status(erro.status || 500).json({ error: erro.message });
});

mongoose.connection.on("error", (error) => {
  console.error("Erro na conexão com o banco de dados:", error.message);
});

mongoose.connection.once("open", () => {
  console.log("Conexão com o banco de dados estabelecida com sucesso!");
});

try {
  await connectToDatabase();
  app.listen(PORTA, () => {
    console.log(`[${NOME_SERVICO}] escutando na porta ${PORTA}`);
  });
} catch (error) {
  console.error("Não foi possível conectar ao banco de dados:", error.message);
  process.exit(1);
}
