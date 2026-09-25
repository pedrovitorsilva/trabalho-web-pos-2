import { useEffect, useState } from 'react'
import { listProdutos, createProduto } from '../services/api'
import Title from '../components/Title'
import FeedbackMessage from '../components/FeedbackMessage'
import ProductForm from '../components/ProductForm'
import List from '../components/List'
import ProductImage from '../components/ProductImage'

const brl = (v) => Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export default function Products() {
  const [produtos, setProdutos] = useState([])
  const [listLoading, setListLoading] = useState(true)
  const [listError, setListError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState(null)

  const columns = [
    {
      key: 'imagem',
      header: 'Imagem',
      render: (p) => <ProductImage codigo_barras={p.codigo_barras} />,
      cellClassName: 'list__cell--compact',
    },
    { key: 'nome', header: 'Nome' },
    { key: 'codigo_barras', header: 'Código de Barras' },
    {
      key: 'preco_venda',
      header: 'Preço de Venda',
      render: (p) => brl(p.preco_venda),
      cellClassName: 'list__cell--highlight',
    },
    { key: 'qtd_atual', header: 'Estoque' },
  ]

  useEffect(() => {
    async function load() {
      try {
        setProdutos(await listProdutos())
      } catch {
        setListError('Erro ao carregar produtos.')
      } finally {
        setListLoading(false)
      }
    }
    load()
  }, [])

  async function handleCreate(payload) {
    setSubmitting(true)
    try {
      const novo = await createProduto(payload)
      setProdutos((prev) => [novo, ...prev])
      setFeedback({ type: 'success', message: 'Produto cadastrado com sucesso.' })
      return true
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.response?.data?.message || err.response?.data?.error || 'Erro ao cadastrar produto.',
      })
      return false
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main>
      <Title>Mercadinho São Miguel - Produtos</Title>
      <FeedbackMessage type={feedback?.type} message={feedback?.message} />
      <ProductForm onSubmit={handleCreate} submitting={submitting} />
      <List
        header="Produtos cadastrados"
        columns={columns}
        items={produtos}
        loading={listLoading}
        error={listError}
        emptyMessage="Nenhum produto cadastrado ainda."
        rowClassName={(p) => (p.qtd_atual < p.qtd_minima ? 'list__row--warning' : undefined)}
      />
    </main>
  )
}
