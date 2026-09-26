import mongoose from "mongoose";

const itemResgatadoSchema = new mongoose.Schema(
  {
    id_promocao: {
      type: Number,
      required: true,
    },
    nome_promocao: {
      type: String,
      required: true,
    },
    codigo_promocao: {
      type: String,
      required: true,
    },
    quantidade: {
      type: Number,
      required: true,
    },
    pontos_usados_unit: {
      type: Number,
      required: true,
    },
  },
  { _id: false },
);

const resgateSchema = new mongoose.Schema(
  {
    data_resgate: {
      type: Date,
      default: Date.now,
    },
    id_cliente: {
      type: Number,
      required: true,
    },
    pontos_usados_total: {
      type: Number,
      required: true,
    },
    itens_resgatados: {
      type: [itemResgatadoSchema],
      required: true,
      validate: {
        validator: (value) => Array.isArray(value) && value.length > 0,
        message: "itens_resgatados deve conter ao menos um item",
      },
    },
    status: {
      type: String,
      enum: ["resgatado", "cancelado", "entregue"],
      default: "resgatado",
    },
  },
  { timestamps: true },
);

const Resgate = mongoose.model("Resgate", resgateSchema);

export { Resgate, resgateSchema };
