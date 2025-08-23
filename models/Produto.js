const mongoose = require('mongoose');

const ProdutoSchema = new mongoose.Schema({
  placaVeiculo: {
    type: String,
    required: true,
    ref: 'Veiculo'
  },
  titulo: {
    type: String,
    required: true,
    trim: true
  },
  descricao: {
    type: String,
    trim: true
  },
  categoria: {
    type: String,
    trim: true
  },
  quantidade: {
    type: Number,
    required: true,
    min: 1
  },
  observacoes: {
    type: String,
    trim: true
  },
  ativo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Índice único para evitar produtos duplicados no mesmo veículo
ProdutoSchema.index({ placaVeiculo: 1, titulo: 1 }, { unique: true });

module.exports = mongoose.model('Produto', ProdutoSchema);