const mongoose = require("mongoose");

const ManutencaoSchema = new mongoose.Schema(
  {
    placaVeiculo: {
      type: String,
      required: true,
      ref: "Veiculo",
    },
    titulo: {
      type: String,
      required: true,
      trim: true,
    },
    descricao: {
      type: String,
      required: true,
      trim: true,
    },
    km: {
      type: Number,
      required: true,
      min: 0,
    },
    dataManutencao: {
      type: Date,
      default: Date.now,
    },
    custo: {
      type: Number,
      min: 0,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

ManutencaoSchema.index({ placaVeiculo: 1 });

module.exports = mongoose.model("Manutencao", ManutencaoSchema);
