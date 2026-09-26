import { useState, useEffect } from 'react'
import FormField from '../FormField'
import Subtitle from '../Subtitle'
import Button from '../Button'
import './styles.css'

const EMPTY_ITEM = {
  id_produto: '',
  nome_produto: '',
  quantidade: '',
  valor_unitario_custo: '',
}

const INITIAL_FORM = {
  data_entrada: new Date().toISOString().slice(0, 10),
  id_fornecedor: '',
  valor_total: '',
  itens: [{ ...EMPTY_ITEM }],
}

export default function EntryForm({ onSubmit, editingEntry, onCancelEdit, submitting }) {
  const [values, setValues] = useState(INITIAL_FORM)
  const [fieldErrors, setFieldErrors] = useState({})

  useEffect(() => {
    if (editingEntry) {
      const formattedDate = editingEntry.data_entrada
        ? new Date(editingEntry.data_entrada).toISOString().slice(0, 10)
        : ''
      setValues({
        data_entrada: formattedDate,
        id_fornecedor: editingEntry.id_fornecedor ?? '',
        valor_total: editingEntry.valor_total ?? '',
        itens:
          editingEntry.itens && editingEntry.itens.length > 0
            ? editingEntry.itens.map((it) => ({
                id_produto: it.id_produto ?? '',
                nome_produto: it.nome_produto ?? '',
                quantidade: it.quantidade ?? '',
                valor_unitario_custo: it.valor_unitario_custo ?? '',
              }))
            : [{ ...EMPTY_ITEM }],
      })
      setFieldErrors({})
    } else {
      setValues({
        ...INITIAL_FORM,
        data_entrada: new Date().toISOString().slice(0, 10),
      })
      setFieldErrors({})
    }
  }, [editingEntry])

  const handleChange = (field) => (e) => {
    setValues((prev) => ({ ...prev, [field]: e.target.value }))
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handleItemChange = (index, field) => (e) => {
    const val = e.target.value
    setValues((prev) => {
      const nextItens = [...prev.itens]
      nextItens[index] = { ...nextItens[index], [field]: val }

      let autoTotal = 0
      let hasValidItem = false
      nextItens.forEach((item) => {
        const q = Number(item.quantidade)
        const c = Number(item.valor_unitario_custo)
        if (q > 0 && c >= 0) {
          autoTotal += q * c
          hasValidItem = true
        }
      })

      return {
        ...prev,
        itens: nextItens,
        valor_total: hasValidItem ? autoTotal.toString() : prev.valor_total,
      }
    })
    setFieldErrors((prev) => ({ ...prev, [`item_${index}_${field}`]: undefined }))
  }

  const addItem = () => {
    setValues((prev) => ({
      ...prev,
      itens: [...prev.itens, { ...EMPTY_ITEM }],
    }))
  }

  const removeItem = (index) => {
    setValues((prev) => {
      if (prev.itens.length <= 1) return prev
      const nextItens = prev.itens.filter((_, i) => i !== index)
      let autoTotal = 0
      let hasValidItem = false
      nextItens.forEach((item) => {
        const q = Number(item.quantidade)
        const c = Number(item.valor_unitario_custo)
        if (q > 0 && c >= 0) {
          autoTotal += q * c
          hasValidItem = true
        }
      })
      return {
        ...prev,
        itens: nextItens,
        valor_total: hasValidItem ? autoTotal.toString() : prev.valor_total,
      }
    })
  }

  function validate() {
    const errors = {}
    if (!values.data_entrada.trim()) {
      errors.data_entrada = 'Informe a data da entrada.'
    }
    if (!values.id_fornecedor.toString().trim()) {
      errors.id_fornecedor = 'Informe o código do fornecedor.'
    }

    if (!values.itens || values.itens.length === 0) {
      errors.itens = 'Adicione pelo menos um item.'
    } else {
      values.itens.forEach((it, idx) => {
        if (!it.nome_produto.trim()) {
          errors[`item_${idx}_nome_produto`] = 'Informe o nome.'
        }
        const q = Number(it.quantidade)
        if (!it.quantidade.toString().trim() || !Number.isFinite(q) || q <= 0) {
          errors[`item_${idx}_quantidade`] = 'Qtd > 0.'
        }
        const c = Number(it.valor_unitario_custo)
        if (!it.valor_unitario_custo.toString().trim() || !Number.isFinite(c) || c < 0) {
          errors[`item_${idx}_valor_unitario_custo`] = 'Custo ≥ 0.'
        }
      })
    }
    return errors
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errors = validate()
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    const payloadItens = values.itens.map((it) => ({
      id_produto: it.id_produto ? Number(it.id_produto) : undefined,
      nome_produto: it.nome_produto.trim(),
      quantidade: Number(it.quantidade),
      valor_unitario_custo: Number(it.valor_unitario_custo),
    }))

    const computedTotal = payloadItens.reduce(
      (sum, it) => sum + it.quantidade * it.valor_unitario_custo,
      0
    )

    const payload = {
      data_entrada: new Date(values.data_entrada).toISOString(),
      id_fornecedor: Number(values.id_fornecedor),
      valor_total: values.valor_total ? Number(values.valor_total) : computedTotal,
      itens: payloadItens,
    }

    const ok = await onSubmit(payload)
    if (ok && !editingEntry) {
      setValues({
        ...INITIAL_FORM,
        data_entrada: new Date().toISOString().slice(0, 10),
      })
      setFieldErrors({})
    }
  }

  return (
    <form className="entry-form" onSubmit={handleSubmit} noValidate>
      <Subtitle>{editingEntry ? 'Editar entrada' : 'Nova entrada'}</Subtitle>
      <div className="entry-form__grid">
        <FormField
          id="entrada-data"
          label="Data da entrada"
          type="date"
          required
          value={values.data_entrada}
          onChange={handleChange('data_entrada')}
          error={fieldErrors.data_entrada}
        />
        <FormField
          id="entrada-fornecedor"
          label="ID do fornecedor"
          type="number"
          min="1"
          required
          placeholder="Ex.: 21"
          value={values.id_fornecedor}
          onChange={handleChange('id_fornecedor')}
          error={fieldErrors.id_fornecedor}
        />
        <FormField
          id="entrada-valor-total"
          label="Valor total (R$)"
          type="number"
          step="0.01"
          min="0"
          placeholder="Calculado pelos itens"
          value={values.valor_total}
          onChange={handleChange('valor_total')}
          error={fieldErrors.valor_total}
        />
      </div>

      <div className="entry-form__items-section">
        <Subtitle>Itens da Entrada</Subtitle>
        {(editingEntry ? values.itens.slice(0, 1) : values.itens).map((item, index) => (
          <div key={index} className="entry-form__item-row">
            <FormField
              id={`item-nome-${index}`}
              label="Nome do produto"
              required
              placeholder="Ex.: FEIJÃO"
              value={item.nome_produto}
              onChange={handleItemChange(index, 'nome_produto')}
              error={fieldErrors[`item_${index}_nome_produto`]}
            />
            <FormField
              id={`item-id-prod-${index}`}
              label="ID produto (Opcional)"
              type="number"
              placeholder="Ex.: 100"
              value={item.id_produto}
              onChange={handleItemChange(index, 'id_produto')}
            />
            <FormField
              id={`item-qtd-${index}`}
              label="Quantidade"
              type="number"
              min="1"
              required
              placeholder="Ex.: 10"
              value={item.quantidade}
              onChange={handleItemChange(index, 'quantidade')}
              error={fieldErrors[`item_${index}_quantidade`]}
            />
            <FormField
              id={`item-custo-${index}`}
              label="Custo unitário (R$)"
              type="number"
              step="0.01"
              min="0"
              required
              placeholder="Ex.: 7.00"
              value={item.valor_unitario_custo}
              onChange={handleItemChange(index, 'valor_unitario_custo')}
              error={fieldErrors[`item_${index}_valor_unitario_custo`]}
            />
            {!editingEntry && values.itens.length > 1 && (
              <button
                type="button"
                className="entry-form__remove-btn"
                onClick={() => removeItem(index)}
                title="Remover item"
              >
                &times;
              </button>
            )}
          </div>
        ))}

        {!editingEntry && (
          <Button
            type="button"
            variant="accent"
            className="entry-form__add-item-btn"
            onClick={addItem}
          >
            + Adicionar outro item
          </Button>
        )}
      </div>

      <div className="entry-form__actions">
        <Button type="submit" variant="primary" disabled={submitting}>
          {submitting
            ? 'Salvando...'
            : editingEntry
            ? 'Salvar alterações'
            : 'Cadastrar entrada'}
        </Button>
        {editingEntry && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancelEdit}
            disabled={submitting}
          >
            Cancelar
          </Button>
        )}
      </div>
    </form>
  )
}