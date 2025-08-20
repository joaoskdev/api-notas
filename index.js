// index.js - API com conexão ao MongoDB
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Conexão com o MongoDB Atlas
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Conectado ao MongoDB Atlas!");
  })
  .catch((err) => {
    console.error("Erro ao conectar com MongoDB:", err.message);
  });

// Defina um schema e modelo para seus dados
const dataSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const DataModel = mongoose.model("Data", dataSchema);

// Rota de teste
app.get("/", (req, res) => {
  res.json({
    message: "API funcionando e conectada ao MongoDB!",
    status: "OK",
    timestamp: new Date().toISOString(),
  });
});

// Rota para salvar dados no MongoDB
app.post("/api/save", async (req, res) => {
  try {
    const { name, value } = req.body;

    const newData = new DataModel({
      name,
      value,
    });

    const savedData = await newData.save();

    res.json({
      success: true,
      message: "Dados salvos com sucesso!",
      data: savedData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erro ao salvar dados",
      error: error.message,
    });
  }
});

// Rota para buscar dados do MongoDB
app.get("/api/data", async (req, res) => {
  try {
    const data = await DataModel.find().sort({ timestamp: -1 });

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erro ao buscar dados",
      error: error.message,
    });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
