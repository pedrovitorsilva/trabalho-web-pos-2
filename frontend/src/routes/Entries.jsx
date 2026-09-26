import { useEffect, useState } from 'react'
import {
  listEntradas,
  createEntrada,
  updateEntrada,
  deleteEntrada,
} from '../services/api'
import Title from '../components/Title'
import FeedbackMessage from '../components/FeedbackMessage'
import List from '../components/List'
import Button from '../components/Button'
import EntryForm from '../components/EntryForm'

const brl = (v) => Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const formatDate = (d) => (d ? new Date(d).toLocaleDateString('pt-BR') : '-')

export default function Entries() {
  const [entradas, setEntradas] = useState([])
  const [listLoading, setListLoading] = useState(true)
  const [listError, setListError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [editingEntry, setEditingEntry] = useState(null)

  const columns = [
    {
      key: 'data_entrada',
      header: 'Data da Entrada',
      render: (e) => formatDate(e.data_entrada),
    },
    {
      key: 'id_fornecedor',
      header: 'Fornecedor (ID)',
      render: (e) => e.id_fornecedor ?? '-',
    },
    {
      key: 'valor_total',
      header: 'Valor Total',
      render: (e) => brl(e.valor_total),
      cellClassName: 'list__cell--highlight',
    },
    {
      key: 'itens',
      header: 'Itens',
      render: (e) =>
        e.itens && e.itens.length > 0
          ? e.itens.map((i) => `${i.nome_produto} (${i.quantidade}x)`).join(', ')
          : '-',
    },
    {
      key: 'acoes',
      header: 'Ações',
      render: (e) => (
        <div className="list__actions">
          <Button type="button" variant="secondary" className="button--sm" onClick={() => handleEdit(e)}>
            Editar
          </Button>
          <Button type="button" variant="danger" className="button--sm" onClick={() => handleDelete(e)}>
            Excluir
          </Button>
        </div>
      ),
    },
  ]

  useEffect(() => {
    async function load() {
      try {
        setEntradas(await listEntradas())
      } catch {
        setListError('Erro ao carregar entradas de estoque.')
      } finally {
        setListLoading(false)
      }
    }
    load()
  }, [])

  async function handleSave(payload) {
    setSubmitting(true)
    try {
      if (editingEntry) {
        const id = editingEntry._id ?? editingEntry.id
        const atualizada = await updateEntrada(id, payload)
        setEntradas((prev) => prev.map((e) => ((e._id ?? e.id) === id ? atualizada : e)))
        setEditingEntry(null)
        setFeedback({ type: 'success', message: 'Entrada atualizada com sucesso.' })
      } else {
        const nova = await createEntrada(payload)
        setEntradas((prev) => [nova, ...prev])
        setFeedback({ type: 'success', message: 'Entrada cadastrada com sucesso.' })
      }
      return true
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.response?.data?.message || err.response?.data?.error || 'Erro ao salvar entrada.',
      })
      return false
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(entry) {
    const id = entry._id ?? entry.id
    if (!id || !window.confirm('Deseja excluir esta entrada?')) return
    try {
      await deleteEntrada(id)
      setEntradas((prev) => prev.filter((e) => (e._id ?? e.id) !== id))
      setFeedback({ type: 'success', message: 'Entrada excluída com sucesso.' })
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.response?.data?.message || err.response?.data?.error || 'Erro ao excluir entrada.',
      })
    }
  }

  function handleEdit(entry) {
    setEditingEntry(entry)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <main>
      <Title>Mercadinho São Miguel - Entradas</Title>
      <FeedbackMessage type={feedback?.type} message={feedback?.message} />
      <EntryForm
        onSubmit={handleSave}
        submitting={submitting}
        editingEntry={editingEntry}
        onCancelEdit={() => setEditingEntry(null)}
      />
      <List
        header="Entradas cadastradas"
        columns={columns}
        items={entradas}
        loading={listLoading}
        error={listError}
        emptyMessage="Nenhuma entrada cadastrada ainda."
      />
    </main>
  )
}