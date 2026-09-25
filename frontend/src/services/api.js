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
