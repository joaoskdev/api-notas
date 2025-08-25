const express = require("express");
const router = express.Router();

const Veiculo = require("../models/Veiculo");
const Produto = require("../models/Produto");
const Manutencao = require("../models/Manutencao");
const CatalogoProduto = require("../models/CatalogoProduto");

/**
 * =========================
 * ROOT /notas (compatível com seu app)
 * =========================
 */

// GET /notas - Buscar todos ou filtrar por tipo/placa
router.get("/", async (req, res) => {
  try {
    const { tipo, placa } = req.query;
    let resultados = {};

    if (tipo === "veiculo" || !tipo) {
      resultados.veiculos = await Veiculo.find({});
    }

    if (tipo === "produto" || !tipo) {
      if (placa) {
        resultados.produtos = await Produto.find({ placaVeiculo: placa });
      } else {
        resultados.produtos = await Produto.find({});
      }
    }

    if (tipo === "manutencao" || !tipo) {
      if (placa) {
        resultados.manutencoes = await Manutencao.find({ placaVeiculo: placa });
      } else {
        resultados.manutencoes = await Manutencao.find({});
      }
    }

    return res.json(resultados);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// POST /notas - Criar novo registro (veiculo | produto | manutencao)
router.post("/", async (req, res) => {
  try {
    const { tipo } = req.body;
    let novoRegistro;

    switch (tipo) {
      case "veiculo": {
        const veiculoExistente = await Veiculo.findOne({
          placa: req.body.placa,
        });
        if (veiculoExistente) {
          return res
            .status(400)
            .json({ error: "Veículo com esta placa já existe" });
        }
        novoRegistro = new Veiculo(req.body);
        break;
      }
      case "produto": {
        const veiculoProduto = await Veiculo.findOne({
          placa: req.body.placaVeiculo,
        });
        if (!veiculoProduto) {
          return res.status(404).json({ error: "Veículo não encontrado" });
        }
        novoRegistro = new Produto(req.body);
        break;
      }
      case "manutencao": {
        const veiculoManutencao = await Veiculo.findOne({
          placa: req.body.placaVeiculo,
        });
        if (!veiculoManutencao) {
          return res.status(404).json({ error: "Veículo não encontrado" });
        }
        novoRegistro = new Manutencao(req.body);
        break;
      }
      default:
        return res.status(400).json({ error: "Tipo de registro inválido" });
    }

    const registroSalvo = await novoRegistro.save();
    return res.status(201).json(registroSalvo);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

/**
 * =========================
 * VEÍCULOS
 * =========================
 */

router.get("/veiculos", async (req, res) => {
  try {
    const veiculos = await Veiculo.find({});
    return res.json(veiculos);
  } catch (error) {
    return res.status(500).json({ error: error.message });
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

// DELETE /notas/veiculos/:id - Hard delete + cascade em produtos/manutenções
router.delete("/veiculos/:id", async (req, res) => {
  try {
    const veiculo = await Veiculo.findByIdAndDelete(req.params.id);
    if (!veiculo) {
      return res.status(404).json({ error: "Veículo não encontrado" });
    }

    // deletar associados pela placa
    await Produto.deleteMany({ placaVeiculo: veiculo.placa });
    await Manutencao.deleteMany({ placaVeiculo: veiculo.placa });

    return res.json({
      message: "Veículo e dados associados deletados com sucesso",
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * =========================
 * PRODUTOS (por veículo)
 * =========================
 */

/**
 * =========================
 * MANUTENÇÕES
 * =========================
 */

// GET único (sem duplicatas) — lista manutenções do veículo
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

/**
 * =========================
 * CATÁLOGO DE PRODUTOS
 * =========================
 */

// GET catálogo (se quiser apenas ativos, troque para { ativo: true })
router.get("/catalogo-produtos/:veiculoId", async (req, res) => {
  try {
    const produtos = await CatalogoProduto.find({
      veiculo: req.params.veiculoId,
    });
    return res.json(produtos);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/veiculos/:veiculoId/catalogo-produtos", async (req, res) => {
  try {
    const produtos = await CatalogoProduto.find({ veiculo: req.params.veiculoId });
    return res.json(produtos);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// CRIAR novo produto no catálogo de um veículo
router.post("/veiculos/:veiculoId/catalogo-produtos", async (req, res) => {
  try {
    const produto = new CatalogoProduto({
      ...req.body,
      veiculo: req.params.veiculoId,
    });
    const produtoSalvo = await produto.save();
    return res.status(201).json(produtoSalvo);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

// GET produto específico do catálogo
router.get("/catalogo-produtos/:id", async (req, res) => {
  try {
    const produto = await CatalogoProduto.findById(req.params.id);
    if (!produto) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }
    return res.json(produto);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post("/catalogo-produtos/:veiculoId", async (req, res) => {
  try {
    const produto = new CatalogoProduto({
      ...req.body,
      veiculo: req.params.veiculoId, // vínculo
    });
    const produtoSalvo = await produto.save();
    return res.status(201).json(produtoSalvo);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

// PUT correto (antes estava deletando por engano)
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

// DELETE correto (antes usava Model errado e lia placa inexistente)
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

/**
 * =========================
 * CATCH-ALL genérico (opcional)
 * =========================
 * Mantido por compatibilidade, mas colocado NO FINAL
 * para não capturar rotas específicas acima.
 */
router.delete("/:tipo/:id", async (req, res) => {
  try {
    const { tipo, id } = req.params;
    let modelo;

    switch (tipo) {
      case "veiculo":
      case "veiculos":
        modelo = Veiculo;
        break;
      case "produto":
      case "produtos":
        modelo = Produto;
        break;
      case "manutencao":
      case "manutencoes":
        modelo = Manutencao;
        break;
      default:
        return res.status(400).json({ error: "Tipo de registro inválido" });
    }

    const registro = await modelo.findByIdAndDelete(id);
    if (!registro) {
      return res.status(404).json({ error: "Registro não encontrado" });
    }

    return res.json({ message: "Registro deletado com sucesso" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
