import axios from 'axios'

export const API_BASE = {
  produtos: 'http://localhost:7001',
  pessoas: 'http://localhost:7002',
  vendas: 'http://localhost:7003',
}

export async function fetchJson(url, options = {}) {
  const response = await fetch(url, options)
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  return response.json()
}

const produtosApi = axios.create({ baseURL: API_BASE.produtos })

export async function listProdutos() {
  const { data } = await produtosApi.get('/produtos')
  return data
}

export async function createProduto(payload) {
  const { data } = await produtosApi.post('/produtos', payload)
  return data.produto
}

export async function listEntradas() {
  const { data } = await produtosApi.get('/entrada')
  return data
}

export async function createEntrada(payload) {
  const { data } = await produtosApi.post('/entrada', payload)
  return data.entrada
}

export async function updateEntrada(id, payload) {
  const { data } = await produtosApi.patch(`/entrada/${id}`, payload)
  return data.entrada
}

export async function deleteEntrada(id) {
  const { data } = await produtosApi.delete(`/entrada/${id}`)
  return data.entrada
}
