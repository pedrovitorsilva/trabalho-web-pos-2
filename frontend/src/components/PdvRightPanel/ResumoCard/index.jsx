import Card from '../../Card'
import './styles.css'

export default function ResumoCard({ subtotal, totalRecebido, troco }) {
  return (
    <Card>
      <div className="pdv-right-panel__summary">
        <div className="pdv-right-panel__summary-item">
          <span>SUBTOTAL</span>
          <span className="pdv-right-panel__summary-value">
            R$ {subtotal.toFixed(2)}
          </span>
        </div>
        <div className="pdv-right-panel__summary-item">
          <span>Total Recebido</span>
          <span
            className="pdv-right-panel__summary-value"
            style={{
              color:
                totalRecebido > 0 ? 'var(--color-success)' : 'inherit',
            }}
          >
            R$ {totalRecebido.toFixed(2)}
          </span>
        </div>
        <div className="pdv-right-panel__summary-item">
          <span>Troco</span>
          <span
            className="pdv-right-panel__summary-value"
            style={{
              color: troco < 0 ? 'var(--color-error)' : 'inherit',
            }}
          >
            R$ {troco.toFixed(2)}
          </span>
        </div>
      </div>
    </Card>
  )
}
