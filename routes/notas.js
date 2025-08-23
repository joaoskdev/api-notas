const express = require("express");
const router = express.Router();
const Nota = require("../models/Nota");
const Veiculo = require("../models/Veiculo");
const Produto = require("../models/Produto");
const CatalogoProduto = require("../models/CatalogoProduto");
const Manutencao = require("../models/Manutencao");

// =========================
// NOTAS
// =========================
router.get("/", async (req, res) => {
  try {
    const notas = await Nota.find();
    return res.json(notas);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const nota = new Nota(req.body);
    await nota.save();
    return res.status(201).json(nota);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const nota = await Nota.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!nota) {
      return res.status(404).json({ error: "Nota não encontrada" });
    }
    return res.json(nota);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const nota = await Nota.findByIdAndDelete(req.params.id);
    if (!nota) {
      return res.status(404).json({ error: "Nota não encontrada" });
    }
    return res.json({ message: "Nota deletada com sucesso" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// =========================
// VEÍCULOS
// =========================
router.get("/veiculos", async (req, res) => {
  try {
    const veiculos = await Veiculo.find();
    return res.json(veiculos);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post("/veiculos", async (req, res) => {
  try {
    const veiculo = new Veiculo(req.body);
    await veiculo.save();
    return res.status(201).json(veiculo);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.put("/veiculos/:id", async (req, res) => {
  try {
    const veiculo = await Veiculo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!veiculo) {
      return res.status(404).json({ error: "Veículo não encontrado" });
    }
    return res.json(veiculo);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.delete("/veiculos/:id", async (req, res) => {
  try {
    const veiculo = await Veiculo.findByIdAndDelete(req.params.id);
    if (!veiculo) {
      return res.status(404).json({ error: "Veículo não encontrado" });
    }
    return res.json({ message: "Veículo deletado com sucesso" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// =========================
// PRODUTOS POR VEÍCULO
// =========================
router.get("/produtos/:placa", async (req, res) => {
  try {
    const produtos = await Produto.find({ placaVeiculo: req.params.placa });
    return res.json(produtos);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post("/produtos", async (req, res) => {
  try {
    const produto = new Produto(req.body);
    await produto.save();
    return res.status(201).json(produto);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.put("/produtos/:placa/:id", async (req, res) => {
  try {
    const produto = await Produto.findOneAndUpdate(
      { _id: req.params.id, placaVeiculo: req.params.placa },
      req.body,
      { new: true, runValidators: true }
    );
    if (!produto) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }
    return res.json(produto);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.delete("/produtos/:placa/:id", async (req, res) => {
  try {
    const produto = await Produto.findOneAndDelete({
      _id: req.params.id,
      placaVeiculo: req.params.placa,
    });
    if (!produto) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }
    return res.json({ message: "Produto deletado com sucesso" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// =========================
// CATÁLOGO DE PRODUTOS
// =========================
router.get("/catalogo-produtos", async (req, res) => {
  try {
    const produtos = await CatalogoProduto.find();
    return res.json(produtos);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post("/catalogo-produtos", async (req, res) => {
  try {
    const produto = new CatalogoProduto(req.body);
    await produto.save();
    return res.status(201).json(produto);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.put("/catalogo-produtos/:id", async (req, res) => {
  try {
    const produto = await CatalogoProduto.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!produto) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }
    return res.json(produto);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.delete("/catalogo-produtos/:id", async (req, res) => {
  try {
    const produto = await CatalogoProduto.findByIdAndDelete(req.params.id);
    if (!produto) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }
    return res.json({ message: "Produto do catálogo deletado com sucesso" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// =========================
// MANUTENÇÕES
// =========================
router.get("/manutencoes/:placa", async (req, res) => {
  try {
    const manutencoes = await Manutencao.find({
      placaVeiculo: req.params.placa,
    });
    return res.json(manutencoes);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post("/manutencoes", async (req, res) => {
  try {
    const manutencao = new Manutencao(req.body);
    await manutencao.save();
    return res.status(201).json(manutencao);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.put("/manutencoes/:placa/:id", async (req, res) => {
  try {
    const manutencao = await Manutencao.findOneAndUpdate(
      { _id: req.params.id, placaVeiculo: req.params.placa },
      req.body,
      { new: true, runValidators: true }
    );
    if (!manutencao) {
      return res.status(404).json({ error: "Manutenção não encontrada" });
    }
    return res.json(manutencao);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.delete("/manutencoes/:placa/:id", async (req, res) => {
  try {
    const manutencao = await Manutencao.findOneAndDelete({
      _id: req.params.id,
      placaVeiculo: req.params.placa,
    });
    if (!manutencao) {
      return res.status(404).json({ error: "Manutenção não encontrada" });
    }
    return res.json({ message: "Manutenção deletada com sucesso" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
