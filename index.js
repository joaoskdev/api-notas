import cors from "cors";
import express from "express";
import mongoose from "mongoose";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Conexão MongoDB (substituir pela sua URI do Render ou Atlas)
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://jhsabakeviski:ScQcAdeGqLZguiVt@cluster0.csmmdez.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB conectado!"))
  .catch((err) => console.error("Erro MongoDB:", err));

// Schema e Model
const notaSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  texto: { type: String, required: true },
  criadoEm: { type: Date, default: Date.now },
});

const Nota = mongoose.model("Nota", notaSchema);

// Rota para salvar nota
app.post("/notas", async (req, res) => {
  try {
    const { titulo, texto } = req.body;

    if (!titulo || !texto) {
      return res.status(400).json({ error: "Título e texto são obrigatórios" });
    }

    const novaNota = new Nota({ titulo, texto });
    await novaNota.save();

    res.json(novaNota);
  } catch (err) {
    console.error("Erro ao salvar nota:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// Rota para listar notas
app.get("/notas", async (req, res) => {
  try {
    const notas = await Nota.find().sort({ criadoEm: -1 });
    res.json(notas);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar notas" });
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
