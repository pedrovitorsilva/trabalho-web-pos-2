import Card from '../../Card'
import Subtitle from '../../Subtitle'
import Button from '../../Button'
import SelectField from '../../SelectField'
import FormField from '../../FormField'
import './styles.css'

const PAYMENT_METHODS = [
  { value: 'PIX', label: 'PIX' },
  { value: 'Dinheiro', label: 'Dinheiro' },
  { value: 'Débito', label: 'Cartão Débito' },
  { value: 'Crédito', label: 'Cartão Crédito' },
]

export default function PagamentoCard({
  paymentMethod,
  setPaymentMethod,
  paymentValue,
  setPaymentValue,
  pagamentos,
  onAddPayment,
  onRemovePayment,
}) {
  return (
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
            <div key={i} className="pdv-right-panel__payment-row">
              <p className="pdv-right-panel__payment-item">
                {p.tipo}: R$ {p.valor.toFixed(2)}
              </p>
              <Button
                onClick={() => onRemovePayment(i)}
                className="pdv-right-panel__payment-remove"
              >
                −
              </Button>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
