import { Resgate } from "../models/Resgate.js";

async function getAllResgates() {
  const resgates = await Resgate.find().sort({ data_resgate: -1 });
  return resgates;
}

async function getResgate(id) {
  const resgate = await Resgate.findById(id);
  if (!resgate) {
    throw new Error("Resgate não encontrado");
  }
  return resgate;
}

async function getResgatesPorCliente(idCliente) {
  const idNumerico = Number(idCliente);
  const filtro = Number.isFinite(idNumerico) && idCliente.trim() !== ""
    ? { $or: [{ id_cliente: idNumerico }, { id_cliente: idCliente }] }
    : { id_cliente: idCliente };
  const resgates = await Resgate.find(filtro).sort({
    data_resgate: -1,
  });
  return resgates;
}

async function createResgate(dados) {
  const newResgate = new Resgate(dados);
  const savedResgate = await newResgate.save();
  return savedResgate;
}

async function updateResgate(id, modificacoes) {
  const updatedResgate = await Resgate.findByIdAndUpdate(id, modificacoes, {
    new: true,
    runValidators: true,
  });
  if (!updatedResgate) {
    throw new Error("Resgate não encontrado");
  }
  return updatedResgate;
}

async function deleteResgate(id) {
  const deletedResgate = await Resgate.findByIdAndDelete(id);
  if (!deletedResgate) {
    throw new Error("Resgate não encontrado");
  }
  return deletedResgate;
}

export {
  getAllResgates,
  getResgate,
  getResgatesPorCliente,
  createResgate,
  updateResgate,
  deleteResgate,
};
