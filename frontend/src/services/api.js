import axios from 'axios'

export const API_BASE = {
  produtos: 'http://localhost:7001',
  pessoas: 'http://localhost:7002',
  vendas: 'http://localhost:7003',
  resgate: 'http://localhost:7006',
}

export async function fetchJson(url, options = {}) {
  const response = await fetch(url, options)
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  return response.json()
}

const produtosApi = axios.create({ baseURL: API_BASE.produtos })
const resgateApi = axios.create({ baseURL: API_BASE.resgate })

export async function listProdutos() {
  const { data } = await produtosApi.get('/produtos')
  return data
}

export async function createProduto(payload) {
  const { data } = await produtosApi.post('/produtos', payload)
  return data.produto
}

export async function listResgates() {
  const { data } = await resgateApi.get('/resgate')
  return data
}

export async function createResgate(payload) {
  const { data } = await resgateApi.post('/resgate', payload)
  return data.resgate
}
