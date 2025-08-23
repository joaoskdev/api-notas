const mongoose = require('mongoose');

const ProdutoSchema = new mongoose.Schema({
  placaVeiculo: {
    type: String,
    required: true,
    ref: 'Veiculo'
  },
  catalogoProdutoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CatalogoProduto',
    required: true
  },
  quantidade: {
    type: Number,
    required: true,
    min: 1
  },
  observacoes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Índice para melhor performance
ProdutoSchema.index({ placaVeiculo: 1, catalogoProdutoId: 1 });

module.exports = mongoose.model('Produto', ProdutoSchema);