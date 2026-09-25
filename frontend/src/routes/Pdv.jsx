import { useState, useEffect } from 'react'
import {
  listClientes,
  listFuncionarios,
  getProdutoByBarcode,
  listProdutos,
  createVenda,
  updatePessoaPontos,
} from '../services/api'
import Banner from '../components/Banner'
import Card from '../components/Card'
import SelectField from '../components/SelectField'
import FormField from '../components/FormField'
import EmptyState from '../components/EmptyState'
import CartItem from '../components/CartItem'
import Button from '../components/Button'
import FeedbackMessage from '../components/FeedbackMessage'
import Title from '../components/Title'
import Subtitle from '../components/Subtitle'
import List from '../components/List'
import './Pdv.css'

const PAYMENT_METHODS = [
  { value: 'PIX', label: 'PIX' },
  { value: 'Dinheiro', label: 'Dinheiro' },
  { value: 'Débito', label: 'Cartão Débito' },
  { value: 'Crédito', label: 'Cartão Crédito' },
]

function calculatePoints(subtotal) {
  const today = new Date()
  const dayOfWeek = today.getDay()
  const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 3

  if (isWeekday) {
    return subtotal > 10 ? subtotal : 0
  } else {
    if (subtotal <= 40) return subtotal * 0.25
    if (subtotal <= 60) return subtotal * 0.5
    return subtotal
  }
}

function getDayRangeLabel() {
  const today = new Date()
  const dayOfWeek = today.getDay()
  if (dayOfWeek >= 1 && dayOfWeek <= 3) return 'Seg-Qua: 1 ponto/R$'
  return 'Qui-Dom: progressivo'
}

export default function Pdv() {
  const [clientes, setClientes] = useState([])
  const [funcionarios, setFuncionarios] = useState([])
  const [produtos, setProdutos] = useState([])
  const [clienteSelecionado, setClienteSelecionado] = useState(null)
  const [operadorId, setOperadorId] = useState('')
  const [cpfSearch, setCpfSearch] = useState('')
  const [codigoBarrasInput, setCodigoBarrasInput] = useState('')
  const [showGrade, setShowGrade] = useState(false)
  const [carrinho, setCarrinho] = useState([])
  const [pagamentos, setPagamentos] = useState([])
  const [paymentMethod, setPaymentMethod] = useState('')
  const [paymentValue, setPaymentValue] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [c, f, p] = await Promise.all([
          listClientes(),
          listFuncionarios(),
          listProdutos(),
        ])
        setClientes(c || [])
        setFuncionarios(f || [])
        setProdutos(p || [])
      } catch (err) {
        setFeedback({
          type: 'error',
          message: 'Erro ao carregar dados iniciais.',
        })
      } finally {
        setCarregando(false)
      }
    }
    load()
  }, [])

  function buscarClientePorCpf() {
    const cliente = clientes.find((c) => c.cpf === cpfSearch)
    if (cliente) {
      setClienteSelecionado(cliente)
      setCpfSearch('')
      setFeedback(null)
    } else {
      setClienteSelecionado(null)
      setFeedback({
        type: 'error',
        message: 'Cliente não encontrado.',
      })
    }
  }

  async function buscarPorBarcode(codigo) {
    try {
      const produto = await getProdutoByBarcode(codigo)
      adicionarAoCarrinho(produto)
      setCodigoBarrasInput('')
      setFeedback(null)
    } catch {
      setFeedback({
        type: 'error',
        message: 'Produto não encontrado.',
      })
    }
  }

  function adicionarAoCarrinho(produto) {
    setCarrinho((prev) => {
      const existe = prev.find((item) => item.id_produto === produto._id)
      if (existe) {
        return prev.map((item) =>
          item.id_produto === produto._id
            ? { ...item, quantidade: (item.quantidade || 1) + 1 }
            : item
        )
      }
      return [
        ...prev,
        {
          id_produto: produto._id,
          nome_produto: produto.nome,
          preco_venda: produto.preco_venda,
          quantidade: 1,
        },
      ]
    })
  }

  function aumentarQuantidade(id) {
    setCarrinho((prev) =>
      prev.map((item) =>
        item.id_produto === id
          ? { ...item, quantidade: (item.quantidade || 1) + 1 }
          : item
      )
    )
  }

  function diminuirQuantidade(id) {
    setCarrinho((prev) =>
      prev
        .map((item) =>
          item.id_produto === id
            ? { ...item, quantidade: Math.max(0, (item.quantidade || 1) - 1) }
            : item
        )
        .filter((item) => item.quantidade > 0)
    )
  }

  function removerDoCarrinho(id) {
    setCarrinho((prev) => prev.filter((item) => item.id_produto !== id))
  }

  function adicionarPagamento() {
    if (!paymentMethod || !paymentValue) {
      setFeedback({
        type: 'error',
        message: 'Selecione método e valor de pagamento.',
      })
      return
    }
    setPagamentos((prev) => [
      ...prev,
      {
        tipo: paymentMethod,
        valor: parseFloat(paymentValue),
        data: new Date(),
      },
    ])
    setPaymentMethod('')
    setPaymentValue('')
  }

  async function finalizarVenda() {
    if (carrinho.length === 0) {
      setFeedback({
        type: 'error',
        message: 'Carrinho vazio.',
      })
      return
    }
    if (pagamentos.length === 0) {
      setFeedback({
        type: 'error',
        message: 'Adicione ao menos um pagamento.',
      })
      return
    }

    const subtotal = carrinho.reduce((acc, item) => {
      return acc + (item.preco_venda || 0) * (item.quantidade || 1)
    }, 0)
    const totalRecebido = pagamentos.reduce((acc, p) => acc + (p.valor || 0), 0)

    if (totalRecebido < subtotal) {
      setFeedback({
        type: 'error',
        message: `Pagamento insuficiente. Faltam R$ ${(subtotal - totalRecebido).toFixed(2)}`,
      })
      return
    }

    const pontosGanhos = calculatePoints(subtotal)
    const itens = carrinho.map((item) => ({
      id_produto: item.id_produto,
      nome_produto: item.nome_produto,
      quantidade: item.quantidade || 1,
      preco_unitario: item.preco_venda || 0,
      desconto: 0,
      pontos_ganhos_unit: pontosGanhos / (item.quantidade || 1),
    }))

    const vendaPayload = {
      data_venda: new Date(),
      valor_total: subtotal,
      pontos_ganhos_total: pontosGanhos,
      id_cliente: clienteSelecionado?._id || null,
      id_funcionario: operadorId || null,
      itens,
      pagamentos,
    }

    try {
      await createVenda(vendaPayload)

      if (clienteSelecionado) {
        await updatePessoaPontos(
          clienteSelecionado._id,
          (clienteSelecionado.pontos_acumulados || 0) + pontosGanhos
        )
      }

      setFeedback({
        type: 'success',
        message: 'Venda finalizada com sucesso!',
      })
      setCarrinho([])
      setPagamentos([])
      setClienteSelecionado(null)
      setOperadorId('')
    } catch {
      setFeedback({
        type: 'error',
        message: 'Erro ao finalizar venda.',
      })
    }
  }

  if (carregando) {
    return <main><p>Carregando...</p></main>
  }

  const subtotal = carrinho.reduce((acc, item) => {
    return acc + (item.preco_venda || 0) * (item.quantidade || 1)
  }, 0)
  const totalRecebido = pagamentos.reduce((acc, p) => acc + (p.valor || 0), 0)
  const troco = totalRecebido - subtotal
  const pontosGanhos = calculatePoints(subtotal)

  const produtosColumns = [
    { key: 'nome', header: 'Produto' },
    {
      key: 'preco_venda',
      header: 'Preço',
      render: (p) =>
        `R$ ${(p.preco_venda || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    },
    {
      key: 'acao',
      header: '',
      render: (p) => (
        <Button onClick={() => adicionarAoCarrinho(p)}>Adicionar</Button>
      ),
    },
  ]

  return (
    <main className="pdv">
      <Banner
        icon="🛒"
        title="Mercadinho São Miguel"
        subtitle="Sistema PDV - Caixa Aberto"
      />

      <FeedbackMessage type={feedback?.type} message={feedback?.message} />

      <div className="pdv__grid">
        {/* Coluna Esquerda */}
        <div className="pdv__left">
          <Card>
            <Subtitle>Cliente (CPF)</Subtitle>
            <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
              <FormField
                id="cpf"
                value={cpfSearch}
                onChange={(e) => setCpfSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && buscarClientePorCpf()}
                placeholder="CPF"
              />
              <Button onClick={buscarClientePorCpf}>🔍</Button>
            </div>
            {clienteSelecionado && (
              <p style={{ margin: '8px 0 0 0', color: 'var(--color-success)' }}>
                {clienteSelecionado.nome}
              </p>
            )}
          </Card>

          <Card>
            <Subtitle>Operador</Subtitle>
            <SelectField
              id="operador"
              value={operadorId}
              onChange={(e) => setOperadorId(e.target.value)}
              options={funcionarios.map((f) => ({
                value: f._id,
                label: f.nome,
              }))}
            />
          </Card>

          <Card>
            <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
              <Button
                variant={!showGrade ? 'primary' : 'primary'}
                onClick={() => setShowGrade(false)}
                style={{
                  opacity: !showGrade ? 1 : 0.5,
                }}
              >
                📱 Código
              </Button>
              <Button
                variant={showGrade ? 'primary' : 'primary'}
                onClick={() => setShowGrade(true)}
                style={{
                  opacity: showGrade ? 1 : 0.5,
                }}
              >
                📋 Grade
              </Button>
            </div>

            {!showGrade && (
              <>
                <FormField
                  id="barcode"
                  type="text"
                  value={codigoBarrasInput}
                  onChange={(e) => setCodigoBarrasInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === 'Enter' && buscarPorBarcode(codigoBarrasInput)
                  }
                  placeholder="Código de Barras"
                  style={{ marginTop: 'var(--space-md)' }}
                />
              </>
            )}

            {showGrade && (
              <div style={{ marginTop: 'var(--space-md)' }}>
                <List
                  columns={produtosColumns}
                  items={produtos}
                  loading={false}
                  error={null}
                  emptyMessage="Nenhum produto cadastrado."
                />
              </div>
            )}
          </Card>

          <Card>
            <div
              style={{
                background: 'var(--color-accent)',
                padding: 'var(--space-md)',
                borderRadius: 'var(--radius)',
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: '0.85rem',
                  color: 'var(--color-text)',
                }}
              >
                Pontos desta Venda
              </p>
              <p
                style={{
                  margin: '8px 0 0 0',
                  fontSize: '1.75rem',
                  fontWeight: 700,
                  color: '#CC0000',
                }}
              >
                {pontosGanhos.toFixed(2)}
              </p>
              <p
                style={{
                  margin: '4px 0 0 0',
                  fontSize: '0.75rem',
                  color: 'var(--color-heading)',
                }}
              >
                {getDayRangeLabel()}
              </p>
            </div>
          </Card>
        </div>

        {/* Coluna Centro - Carrinho */}
        <div className="pdv__center">
          <Card>
            <Subtitle>Lista de Produtos</Subtitle>
            {carrinho.length === 0 ? (
              <EmptyState icon="🛒" title="Carrinho vazio" />
            ) : (
              <div>
                {carrinho.map((item) => (
                  <CartItem
                    key={item.id_produto}
                    item={item}
                    onIncrease={aumentarQuantidade}
                    onDecrease={diminuirQuantidade}
                    onRemove={removerDoCarrinho}
                  />
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Coluna Direita - Resumo e Pagamento */}
        <div className="pdv__right">
          <Card>
            <div className="pdv__summary">
              <div className="pdv__summary-item">
                <span>SUBTOTAL</span>
                <span className="pdv__summary-value">
                  R$ {subtotal.toFixed(2)}
                </span>
              </div>
              <div className="pdv__summary-item">
                <span>Total Recebido</span>
                <span
                  className="pdv__summary-value"
                  style={{
                    color:
                      totalRecebido > 0 ? 'var(--color-success)' : 'inherit',
                  }}
                >
                  R$ {totalRecebido.toFixed(2)}
                </span>
              </div>
              <div className="pdv__summary-item">
                <span>Troco</span>
                <span
                  className="pdv__summary-value"
                  style={{
                    color: troco < 0 ? 'var(--color-error)' : 'inherit',
                  }}
                >
                  R$ {troco.toFixed(2)}
                </span>
              </div>
            </div>
          </Card>

          <Card>
            <Subtitle>Pagamento</Subtitle>
            <SelectField
              id="metodo"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              options={PAYMENT_METHODS}
            />
            <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-md)' }}>
              <FormField
                id="valor"
                type="number"
                value={paymentValue}
                onChange={(e) => setPaymentValue(e.target.value)}
                placeholder="Valor"
                step="0.01"
              />
              <Button onClick={adicionarPagamento}>+</Button>
            </div>

            {pagamentos.length > 0 && (
              <div style={{ marginTop: 'var(--space-md)' }}>
                <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600 }}>
                  Pagamentos:
                </p>
                {pagamentos.map((p, i) => (
                  <p
                    key={i}
                    style={{
                      margin: '4px 0',
                      fontSize: '0.85rem',
                      color: 'var(--color-text)',
                    }}
                  >
                    {p.tipo}: R$ {p.valor.toFixed(2)}
                  </p>
                ))}
              </div>
            )}
          </Card>

          <Button
            onClick={finalizarVenda}
            style={{
              width: '100%',
              background: 'var(--color-success)',
              color: 'white',
              padding: 'var(--space-lg)',
              fontSize: '1.1rem',
              marginTop: 'var(--space-md)',
            }}
          >
            Finalizar Venda
          </Button>
        </div>
      </div>
    </main>
  )
}
