import { useEffect, useMemo, useState } from 'react'
import Title from '../components/Title'
import Subtitle from '../components/Subtitle'
import FormField from '../components/FormField'
import Button from '../components/Button'
import FeedbackMessage from '../components/FeedbackMessage'
import List from '../components/List'
import { listResgates, createResgate } from '../services/api'

const PROMOCOES_INICIAIS = [
  {
    id: 1,
    nome: 'Desconto em café',
    codigo: 'PROMO-CAFE',
    pontos: 60,
    validade: 'Até 31/12/2026',
  },
  {
    id: 2,
    nome: 'Leite com 15% off',
    codigo: 'PROMO-LEITE',
    pontos: 90,
    validade: 'Até 30/11/2026',
  },
  {
    id: 3,
    nome: 'Pão integral especial',
    codigo: 'PROMO-PAO',
    pontos: 45,
    validade: 'Até 28/12/2026',
  },
]

export default function Resgates() {
  const [idCliente, setIdCliente] = useState('')
  const [codigo, setCodigo] = useState('')
  const [quantidade, setQuantidade] = useState('1')
  const [feedback, setFeedback] = useState(null)
  const [resgates, setResgates] = useState([])
  const [loading, setLoading] = useState(true)

  const promocoesDisponiveis = useMemo(() => PROMOCOES_INICIAIS, [])

  useEffect(() => {
    async function carregarResgates() {
      try {
        const dados = await listResgates()
        setResgates(dados)
      } catch (error) {
        setFeedback({
          type: 'error',
          message: 'Não foi possível carregar os resgates do servidor.',
        })
      } finally {
        setLoading(false)
      }
    }

    carregarResgates()
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()

    if (!idCliente.trim()) {
      return setFeedback({ type: 'error', message: 'Informe o ID do cliente.' })
    }

    if (!codigo.trim()) {
      return setFeedback({ type: 'error', message: 'Informe o código da promoção.' })
    }

    const quantidadeNumero = Number(quantidade)
    if (!Number.isFinite(quantidadeNumero) || quantidadeNumero <= 0) {
      return setFeedback({ type: 'error', message: 'Informe uma quantidade válida.' })
    }

    const promocaoEncontrada = promocoesDisponiveis.find(
      (item) => item.codigo.toLowerCase() === codigo.trim().toLowerCase(),
    )

    if (!promocaoEncontrada) {
      return setFeedback({ type: 'error', message: 'Promoção não encontrada ou código inválido.' })
    }

    try {
      const payload = {
        id_cliente: Number(idCliente),
        pontos_usados_total: promocaoEncontrada.pontos * quantidadeNumero,
        itens_resgatados: [
          {
            id_promocao: promocaoEncontrada.id,
            nome_promocao: promocaoEncontrada.nome,
            codigo_promocao: promocaoEncontrada.codigo,
            quantidade: quantidadeNumero,
            pontos_usados_unit: promocaoEncontrada.pontos,
          },
        ],
      }

      await createResgate(payload)
      const dadosAtualizados = await listResgates()
      setResgates(dadosAtualizados)
      setFeedback({
        type: 'success',
        message: `Resgate realizado com sucesso para o cliente ${idCliente}.`,
      })
      setIdCliente('')
      setCodigo('')
      setQuantidade('1')
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error.response?.data?.error || 'Erro ao realizar o resgate.',
      })
    }
  }

  const columns = [
    { key: 'id_cliente', header: 'Cliente' },
    { key: 'pontos_usados_total', header: 'Pontos usados' },
    { key: 'status', header: 'Status' },
  ]

  return (
    <main>
      <Title>Resgates de promoções</Title>
      <FeedbackMessage type={feedback?.type} message={feedback?.message} />

      <form onSubmit={handleSubmit} noValidate>
        <Subtitle>Fazer resgate</Subtitle>

        <FormField
          id="resgate-cliente"
          label="ID do cliente"
          type="number"
          value={idCliente}
          onChange={(event) => setIdCliente(event.target.value)}
          placeholder="Ex: 101"
        />

        <FormField
          id="resgate-codigo"
          label="Código da promoção"
          value={codigo}
          onChange={(event) => setCodigo(event.target.value)}
          placeholder="Ex: PROMO-CAFE"
        />

        <FormField
          id="resgate-quantidade"
          label="Quantidade"
          type="number"
          min="1"
          value={quantidade}
          onChange={(event) => setQuantidade(event.target.value)}
        />

        <Button type="submit">Resgatar promoção</Button>
      </form>

      <div style={{ marginTop: '2rem' }}>
        <Subtitle>Promoções disponíveis</Subtitle>
        <List
          columns={[
            { key: 'nome', header: 'Promoção' },
            { key: 'codigo', header: 'Código' },
            { key: 'pontos', header: 'Pontos' },
            { key: 'validade', header: 'Validade' },
          ]}
          items={promocoesDisponiveis}
          emptyMessage="Nenhuma promoção disponível no momento."
        />
      </div>

      <div style={{ marginTop: '2rem' }}>
        <Subtitle>Histórico de resgates</Subtitle>
        <List
          columns={columns}
          items={resgates}
          loading={loading}
          emptyMessage="Nenhum resgate registrado ainda."
        />
      </div>
    </main>
  )
}
