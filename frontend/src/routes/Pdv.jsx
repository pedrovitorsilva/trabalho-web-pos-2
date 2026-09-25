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
import PdvLeftPanel from '../components/PdvLeftPanel'
import PdvCenterPanel from '../components/PdvCenterPanel'
import PdvRightPanel from '../components/PdvRightPanel'
import FeedbackMessage from '../components/FeedbackMessage'
import Title from '../components/Title'

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
  const [clienteSelectId, setClienteSelectId] = useState('')
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
      setClienteSelectId('')
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

  function selecionarClientePorNome(id) {
    if (!id) {
      setClienteSelecionado(null)
      return
    }
    const cliente = clientes.find((c) => c._id === id)
    if (cliente) {
      setClienteSelecionado(cliente)
      setCpfSearch('')
      setFeedback(null)
    }
  }

  async function buscarPorBarcode(codigo) {
    if (!codigo || codigo.trim() === '') {
      setFeedback({
        type: 'error',
        message: 'Digite um código de barras.',
      })
      return
    }
    try {
      console.log('Buscando código de barras:', codigo)
      const produto = await getProdutoByBarcode(codigo)
      console.log('Produto encontrado:', produto)
      adicionarAoCarrinho(produto)
      setCodigoBarrasInput('')
      setFeedback(null)
    } catch (err) {
      console.error('Erro ao buscar código de barras:', err)
      setFeedback({
        type: 'error',
        message: `Produto não encontrado. Erro: ${err.message || 'Verifique o código e tente novamente.'}`,
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
        <button
          onClick={() => adicionarAoCarrinho(p)}
          style={{
            background: 'var(--color-primary)',
            color: '#FFFFFF',
            border: 'none',
            padding: 'var(--space-sm) var(--space-md)',
            borderRadius: 'var(--radius)',
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: '0.85rem',
          }}
        >
          Adicionar
        </button>
      ),
    },
  ]

  return (
    <main style={{ maxWidth: '1400px', margin: '0 auto', padding: 'var(--space-lg)' }}>
      <Banner
        icon="🛒"
        title="Mercadinho São Miguel"
        subtitle="Sistema PDV - Caixa Aberto"
      />

      <FeedbackMessage type={feedback?.type} message={feedback?.message} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-lg)', marginTop: 'var(--space-lg)' }}>
        <PdvLeftPanel
          clientes={clientes}
          funcionarios={funcionarios}
          clienteSelecionado={clienteSelecionado}
          cpfSearch={cpfSearch}
          setCpfSearch={setCpfSearch}
          buscarClientePorCpf={buscarClientePorCpf}
          clienteSelectId={clienteSelectId}
          setClienteSelectId={setClienteSelectId}
          selecionarClientePorNome={selecionarClientePorNome}
          operadorId={operadorId}
          setOperadorId={setOperadorId}
          showGrade={showGrade}
          setShowGrade={setShowGrade}
          codigoBarrasInput={codigoBarrasInput}
          setCodigoBarrasInput={setCodigoBarrasInput}
          buscarPorBarcode={buscarPorBarcode}
          produtos={produtos}
          produtosColumns={produtosColumns}
          pontosGanhos={pontosGanhos}
          getDayRangeLabel={getDayRangeLabel}
        />

        <PdvCenterPanel
          carrinho={carrinho}
          onIncrease={aumentarQuantidade}
          onDecrease={diminuirQuantidade}
          onRemove={removerDoCarrinho}
        />

        <PdvRightPanel
          subtotal={subtotal}
          totalRecebido={totalRecebido}
          troco={troco}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          paymentValue={paymentValue}
          setPaymentValue={setPaymentValue}
          pagamentos={pagamentos}
          onAddPayment={adicionarPagamento}
          onFinalize={finalizarVenda}
        />
      </div>
    </main>
  )
}
