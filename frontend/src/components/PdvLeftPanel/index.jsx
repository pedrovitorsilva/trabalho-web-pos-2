import Card from '../Card'
import ScrollableCard from '../ScrollableCard'
import SelectField from '../SelectField'
import FormField from '../FormField'
import Button from '../Button'
import Subtitle from '../Subtitle'
import List from '../List'
import './styles.css'

export default function PdvLeftPanel({
  clientes,
  funcionarios,
  clienteSelecionado,
  cpfSearch,
  setCpfSearch,
  buscarClientePorCpf,
  useClienteList,
  setUseClienteList,
  clienteSelectId,
  setClienteSelectId,
  selecionarClientePorNome,
  operadorId,
  setOperadorId,
  showGrade,
  setShowGrade,
  codigoBarrasInput,
  setCodigoBarrasInput,
  buscarPorBarcode,
  produtos,
  produtosColumns,
  pontosGanhos,
  getDayRangeLabel,
}) {
  return (
    <div className="pdv-left-panel">
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
        <div className="pdv-left-panel__mode-toggle">
          <Button
            variant="primary"
            onClick={() => setShowGrade(false)}
            className={!showGrade ? "active" : ""}
          >
            📱 Código
          </Button>
          <Button
            variant="primary"
            onClick={() => setShowGrade(true)}
            className={showGrade ? "active" : ""}
          >
            📋 Grade
          </Button>
        </div>

        {!showGrade && (
          <FormField
            id="barcode"
            type="text"
            value={codigoBarrasInput}
            onChange={(e) => setCodigoBarrasInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && buscarPorBarcode(codigoBarrasInput)
            }
            placeholder="Código de Barras"
            className="pdv-left-panel__barcode"
          />
        )}

        {showGrade && (
          <ScrollableCard className="pdv-left-panel__grid">
            <List
              columns={produtosColumns}
              items={produtos}
              loading={false}
              error={null}
              emptyMessage="Nenhum produto cadastrado."
            />
          </ScrollableCard>
        )}
      </Card>

      <Card>
        <div className="pdv-left-panel__points">
          <p className="pdv-left-panel__points-label">Pontos desta Venda</p>
          <p className="pdv-left-panel__points-value">
            {pontosGanhos.toFixed(2)}
          </p>
          <p className="pdv-left-panel__points-range">{getDayRangeLabel()}</p>
        </div>
      </Card>
    </div>
  );
}
