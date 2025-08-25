const mongoose = require('mongoose');

const CatalogoProdutoSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descricao: String,
  veiculo: { type: mongoose.Schema.Types.ObjectId, ref: "Veiculo", required: true }
});

module.exports = mongoose.model('CatalogoProduto', CatalogoProdutoSchema);