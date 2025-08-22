const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/database");
const notasRoutes = require("./routes/notas");

const app = express();
const PORT = process.env.PORT || 3000;

// Conectar ao MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/notas", notasRoutes);

// Rota de health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Servidor está funcionando" });
});

// Rota padrão para documentação
app.get("/", (req, res) => {
  res.json({
    message: "API de Controle de Frota de Veículos",
    endpoints: {
      "GET /notas": "Buscar todos os registros",
      "POST /notas": "Criar novo registro",
      "GET /notas/veiculos": "Buscar todos os veículos",
      "GET /notas/produtos/:placa": "Buscar produtos por placa",
      "GET /notas/manutencoes/:placa": "Buscar manutenções por placa",
      "DELETE /notas/:tipo/:id": "Deletar registro",
    },
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error: "Erro interno do servidor" });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Endpoint não encontrado" });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`URL: http://localhost:${PORT}`);
});
