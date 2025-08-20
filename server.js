import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

// Carregar variáveis de ambiente
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Conexão MongoDB
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://jhsabakeviski:ScQcAdeGqLZguiVt@cluster0.csmmdez.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB conectado!"))
  .catch((err) => console.error("Erro MongoDB:", err));

// Schema e Model
const notaSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  texto: { type: String, required: true },
  criadoEm: { type: Date, default: Date.now },
});

const Nota = mongoose.model("Nota", notaSchema);

// Rota para criar uma nova nota
app.post("/notas", async (req, res) => {
  try {
    console.log("Recebido do frontend:", req.body);

    // Validação básica
    if (!req.body.titulo || !req.body.texto) {
      return res.status(400).json({ error: "Título e texto são obrigatórios" });
    }

    const nota = await Nota.create(req.body);
    res.status(201).json(nota);
  } catch (err) {
    console.error("Erro ao salvar nota:", err.message);
    res.status(500).json({ error: "Erro no servidor", details: err.message });
  }
});

// Rota para listar todas as notas
app.get("/notas", async (req, res) => {
  try {
    const notas = await Nota.find().sort({ criadoEm: -1 });
    res.json(notas);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar notas" });
  }
});

// Rota para buscar uma nota específica
app.get("/notas/:id", async (req, res) => {
  try {
    const nota = await Nota.findById(req.params.id);
    if (!nota) {
      return res.status(404).json({ error: "Nota não encontrada" });
    }
    res.json(nota);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar nota" });
  }
});

// Rota para atualizar uma nota
app.put("/notas/:id", async (req, res) => {
  try {
    const { titulo, texto } = req.body;

    // Validação básica
    if (!titulo || !texto) {
      return res.status(400).json({ error: "Título e texto são obrigatórios" });
    }

    const nota = await Nota.findByIdAndUpdate(
      req.params.id,
      { titulo, texto },
      { new: true, runValidators: true }
    );

    if (!nota) {
      return res.status(404).json({ error: "Nota não encontrada" });
    }

    res.json(nota);
  } catch (err) {
    console.error("Erro ao atualizar nota:", err);
    res
      .status(500)
      .json({ error: "Erro ao atualizar nota", details: err.message });
  }
});

// Rota para excluir uma nota
app.delete("/notas/:id", async (req, res) => {
  try {
    const nota = await Nota.findByIdAndDelete(req.params.id);

    if (!nota) {
      return res.status(404).json({ error: "Nota não encontrada" });
    }

    res.json({ message: "Nota excluída com sucesso" });
  } catch (err) {
    console.error("Erro ao excluir nota:", err);
    res
      .status(500)
      .json({ error: "Erro ao excluir nota", details: err.message });
  }
});

// Rota padrão para verificar se o servidor está funcionando
app.get("/", (req, res) => {
  res.json({ message: "API de Notas funcionando!" });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
