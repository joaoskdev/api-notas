const mongoose = require("mongoose");

const VeiculoSchema = new mongoose.Schema(
  {
    placa: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    marca: {
      type: String,
      required: true,
      trim: true,
    },
    modelo: {
      type: String,
      required: true,
      trim: true,
    },
    ano: {
      type: Number,
      required: true,
      min: 1900,
      max: new Date().getFullYear() + 1,
    },
    ativo: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Veiculo", VeiculoSchema);
