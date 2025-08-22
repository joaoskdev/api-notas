const mongoose = require('mongoose');

const ProdutoSchema = new mongoose.Schema({
  placaVeiculo: {
    type: String,
    required: true,
    ref: 'Veiculo'
  },
  nome: {
    type: String,
    required: true,
    trim: true
  },
  quantidade: {
    type: Number,
    required: true,
    min: 0
  },
  descricao: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Índice para melhor performance nas buscas por veículo
ProdutoSchema.index({ placaVeiculo: 1 });

module.exports = mongoose.model('Produto', ProdutoSchema);