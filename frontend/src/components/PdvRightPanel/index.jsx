import Button from '../Button'
import ResumoCard from './ResumoCard'
import PagamentoCard from './PagamentoCard'
import './styles.css'

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
  onRemovePayment,
  onFinalize,
}) {
  return (
    <div className="pdv-right-panel">
      <ResumoCard
        subtotal={subtotal}
        totalRecebido={totalRecebido}
        troco={troco}
      />

      <PagamentoCard
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        paymentValue={paymentValue}
        setPaymentValue={setPaymentValue}
        pagamentos={pagamentos}
        onAddPayment={onAddPayment}
        onRemovePayment={onRemovePayment}
      />

      <Button
        onClick={onFinalize}
        className="pdv-right-panel__finalize-btn"
      >
        Finalizar Venda
      </Button>
    </div>
  )
}
