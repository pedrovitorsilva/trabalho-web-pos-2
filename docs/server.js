import express from "express";
import swaggerUi from "swagger-ui-express";

import spec from "./openapi.js";

const NOME_SERVICO = process.env.NOME_SERVICO || "miguel-docs";
const PORTA = Number(process.env.PORT) || 8000;

const app = express();

app.get("/health", (req, res) => {
  res.json({ servico: NOME_SERVICO, banco: "n/a" });
});

app.get("/openapi.json", (req, res) => {
  res.json(spec);
});

app.use("/", swaggerUi.serve, swaggerUi.setup(spec));

app.listen(PORTA, () => {
  console.log(`[${NOME_SERVICO}] escutando na porta ${PORTA}`);
});
