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

export async function getProdutoByBarcode(codigo_barras) {
  const { data } = await produtosApi.get(`/codigo/${codigo_barras}`)
  return data
}

const pessoasApi = axios.create({ baseURL: API_BASE.pessoas })
const vendasApi = axios.create({ baseURL: API_BASE.vendas })

export async function listClientes() {
  const { data } = await pessoasApi.get('/pessoa/clientes')
  return data
}

export async function getPessoaByCpf(cpf) {
  const { data } = await pessoasApi.get(`/pessoa/cpf/${cpf}`)
  return data
}

export async function listFuncionarios() {
  const { data } = await pessoasApi.get('/pessoa/funcionarios')
  return data
}

export async function updatePessoaPontos(id, pontos_acumulados) {
  const { data } = await pessoasApi.patch(`/pessoa/${id}`, { pontos_acumulados })
  return data.pessoa
}

export async function createVenda(payload) {
  const { data } = await vendasApi.post('/vendas', payload)
  return data.venda
}
