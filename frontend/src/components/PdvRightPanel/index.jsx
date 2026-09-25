import Card from '../Card'
import Subtitle from '../Subtitle'
import Button from '../Button'
import SelectField from '../SelectField'
import FormField from '../FormField'
import './styles.css'

const PAYMENT_METHODS = [
  { value: 'PIX', label: 'PIX' },
  { value: 'Dinheiro', label: 'Dinheiro' },
  { value: 'Débito', label: 'Cartão Débito' },
  { value: 'Crédito', label: 'Cartão Crédito' },
]

export default function PdvRightPanel({
  subtotal,
  totalRecebido,
  troco,
  paymentMethod,
  setPaymentMethod,
  paymentValue,
  setPaymentValue,
  pagamentos,
  onAddPayment,
  onFinalize,
}) {
  return (
    <div className="pdv-right-panel">
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

      <Card>
        <Subtitle>Pagamento</Subtitle>
        <SelectField
          id="metodo"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          options={PAYMENT_METHODS}
        />
        <div className="pdv-right-panel__payment-input">
          <FormField
            id="valor"
            type="number"
            value={paymentValue}
            onChange={(e) => setPaymentValue(e.target.value)}
            placeholder="Valor"
            step="0.01"
          />
          <Button onClick={onAddPayment}>+</Button>
        </div>

        {pagamentos.length > 0 && (
          <div className="pdv-right-panel__payments-list">
            <p className="pdv-right-panel__payments-label">Pagamentos:</p>
            {pagamentos.map((p, i) => (
              <p key={i} className="pdv-right-panel__payment-item">
                {p.tipo}: R$ {p.valor.toFixed(2)}
              </p>
            ))}
          </div>
        )}
      </Card>

      <Button
        onClick={onFinalize}
        className="pdv-right-panel__finalize-btn"
      >
        Finalizar Venda
      </Button>
    </div>
  )
}
