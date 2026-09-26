import Card from '../../Card'
import ScrollableCard from '../../ScrollableCard'
import FormField from '../../FormField'
import Button from '../../Button'
import List from '../../List'
import './styles.css'

export default function ProdutoCard({
  showGrade,
  setShowGrade,
  codigoBarrasInput,
  setCodigoBarrasInput,
  buscarPorBarcode,
  produtos,
  produtosColumns,
}) {
  return (
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
  )
}
