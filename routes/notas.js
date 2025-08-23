const express = require("express");
const router = express.Router();
const Veiculo = require("../models/Veiculo");
const Produto = require("../models/Produto");
const Manutencao = require("../models/Manutencao");

// GET /notas - Buscar todos os registros ou filtrar por tipo
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

    res.json(resultados);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /notas - Criar novo registro
router.post("/", async (req, res) => {
  try {
    const { tipo } = req.body;
    let novoRegistro;

    switch (tipo) {
      case "veiculo":
        // Verificar se veículo já existe
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

      case "produto":
        // Verificar se veículo existe
        const veiculoProduto = await Veiculo.findOne({
          placa: req.body.placaVeiculo,
        });
        if (!veiculoProduto) {
          return res.status(404).json({ error: "Veículo não encontrado" });
        }
        novoRegistro = new Produto(req.body);
        break;

      case "manutencao":
        // Verificar se veículo existe
        const veiculoManutencao = await Veiculo.findOne({
          placa: req.body.placaVeiculo,
        });
        if (!veiculoManutencao) {
          return res.status(404).json({ error: "Veículo não encontrado" });
        }
        novoRegistro = new Manutencao(req.body);
        break;

      default:
        return res.status(400).json({ error: "Tipo de registro inválido" });
    }

    const registroSalvo = await novoRegistro.save();
    res.status(201).json(registroSalvo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /notas/veiculos - Buscar todos os veículos
router.get("/veiculos", async (req, res) => {
  try {
    const veiculos = await Veiculo.find({});
    res.json(veiculos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /notas/produtos/:placa - Buscar produtos por placa
router.get("/produtos/:placa", async (req, res) => {
  try {
    const produtos = await Produto.find({ placaVeiculo: req.params.placa });
    res.json(produtos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /notas/manutencoes/:placa - Buscar manutenções por placa
router.get("/manutencoes/:placa", async (req, res) => {
  try {
    const manutencoes = await Manutencao.find({
      placaVeiculo: req.params.placa,
    });
    res.json(manutencoes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /notas/:tipo/:id - Deletar registro
router.delete("/:tipo/:id", async (req, res) => {
  try {
    const { tipo, id } = req.params;
    let modelo;

    switch (tipo) {
      case "veiculo":
        modelo = Veiculo;
        break;
      case "produto":
        modelo = Produto;
        break;
      case "manutencao":
        modelo = Manutencao;
        break;
      default:
        return res.status(400).json({ error: "Tipo de registro inválido" });
    }

    const registro = await modelo.findByIdAndDelete(id);
    if (!registro) {
      return res.status(404).json({ error: "Registro não encontrado" });
    }

    res.json({ message: "Registro deletado com sucesso" });
  } catch (error) {
    res.status(500).json({ error: error.message });
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

    res.json(veiculo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /notas/veiculos/:id - Deletar veículo
router.delete("/veiculos/:id", async (req, res) => {
  try {
    const veiculo = await Veiculo.findByIdAndDelete(req.params.id);

    if (!veiculo) {
      return res.status(404).json({ error: "Veículo não encontrado" });
    }

    // Opcional: Deletar também produtos e manutenções associadas
    await Produto.deleteMany({ placaVeiculo: veiculo.placa });
    await Manutencao.deleteMany({ placaVeiculo: veiculo.placa });

    res.json({ message: "Veículo e dados associados deletados com sucesso" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /notas/manutencoes/:placa - Buscar manutenções por placa
router.get("/manutencoes/:placa", async (req, res) => {
  try {
    const manutencoes = await Manutencao.find({
      placaVeiculo: req.params.placa,
    });
    res.json(manutencoes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /notas/produtos/:placa - Buscar produtos por placa
router.get("/produtos/:placa", async (req, res) => {
  try {
    const produtos = await Produto.find({ placaVeiculo: req.params.placa });
    res.json(produtos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const CatalogoProduto = require("../models/CatalogoProduto");

// Rotas para Catálogo de Produtos
router.get("/catalogo-produtos", async (req, res) => {
  try {
    const produtos = await CatalogoProduto.find({ ativo: true });
    res.json(produtos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/catalogo-produtos", async (req, res) => {
  try {
    const produto = new CatalogoProduto(req.body);
    const produtoSalvo = await produto.save();
    res.status(201).json(produtoSalvo);
  } catch (error) {
    res.status(400).json({ error: error.message });
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

    res.json(produto);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/catalogo-produtos/:id", async (req, res) => {
  try {
    const produto = await CatalogoProduto.findByIdAndUpdate(
      req.params.id,
      { ativo: false },
      { new: true }
    );

    if (!produto) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    res.json({ message: "Produto desativado com sucesso" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/catalogo-produtos/:id", async (req, res) => {
  try {
    const produto = await CatalogoProduto.findById(req.params.id);

    if (!produto) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    res.json(produto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/produtos/:placa", async (req, res) => {
  try {
    const produtos = await Produto.find({
      placaVeiculo: req.params.placa,
      ativo: true,
    });
    res.json(produtos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/produtos/:placa", async (req, res) => {
  try {
    // Verificar se veículo existe
    const veiculo = await Veiculo.findOne({ placa: req.params.placa });
    if (!veiculo) {
      return res.status(404).json({ error: "Veículo não encontrado" });
    }

    const produto = new Produto({
      ...req.body,
      placaVeiculo: req.params.placa,
    });

    const produtoSalvo = await produto.save();
    res.status(201).json(produtoSalvo);
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ error: "Este produto já existe neste veículo" });
    }
    res.status(400).json({ error: error.message });
  }
});

router.put("/produtos/:placa/:id", async (req, res) => {
  try {
    const produto = await Produto.findOneAndUpdate(
      {
        _id: req.params.id,
        placaVeiculo: req.params.placa,
      },
      req.body,
      { new: true, runValidators: true }
    );

    if (!produto) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    res.json(produto);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/produtos/:placa/:id", async (req, res) => {
  try {
    const produto = await Produto.findOneAndUpdate(
      {
        _id: req.params.id,
        placaVeiculo: req.params.placa,
      },
      { ativo: false },
      { new: true }
    );

    if (!produto) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    res.json({ message: "Produto removido com sucesso" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
