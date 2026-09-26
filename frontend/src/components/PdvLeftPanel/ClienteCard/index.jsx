import Card from '../../Card'
import ScrollableCard from '../../ScrollableCard'
import FormField from '../../FormField'
import Button from '../../Button'
import Subtitle from '../../Subtitle'
import './styles.css'

export default function ClienteCard({
  clientes,
  clienteSelecionado,
  cpfSearch,
  setCpfSearch,
  buscarClientePorCpf,
  useClienteList,
  setUseClienteList,
  selecionarClientePorNome,
}) {
  return (
    <Card>
      <Subtitle>Cliente</Subtitle>
      <div className="pdv-left-panel__tabs">
        <Button
          variant="primary"
          onClick={() => setUseClienteList(false)}
          className={!useClienteList ? "active" : ""}
        >
          CPF
        </Button>
        <Button
          variant="primary"
          onClick={() => setUseClienteList(true)}
          className={useClienteList ? "active" : ""}
        >
          Lista
        </Button>
      </div>

      {!useClienteList ? (
        <div className="pdv-left-panel__search">
          <FormField
            id="cpf"
            value={cpfSearch}
            onChange={(e) => setCpfSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && buscarClientePorCpf()}
            placeholder="CPF"
          />
          <Button onClick={buscarClientePorCpf}>🔍</Button>
        </div>
      ) : (
        <ScrollableCard>
          <div className="pdv-left-panel__clients-list">
            {clientes.length > 0 ? (
              clientes.map((c) => (
                <button
                  key={c._id}
                  className={`pdv-left-panel__client-item ${clienteSelecionado?._id === c._id ? "selected" : ""}`}
                  onClick={() => selecionarClientePorNome(c._id)}
                >
                  <div style={{ fontWeight: 600 }}>{c.nome}</div>
                  <div style={{ fontSize: "0.75rem", opacity: 0.8 }}>
                    {c.cpf || "sem CPF"}
                  </div>
                </button>
              ))
            ) : (
              <p style={{ textAlign: "center", color: "var(--color-text)" }}>
                Nenhum cliente cadastrado
              </p>
            )}
          </div>
        </ScrollableCard>
      )}

      {clienteSelecionado && (
        <p className="pdv-left-panel__selected">
          ✓ {clienteSelecionado.nome}
        </p>
      )}
    </Card>
  )
}
