import CarrinhoCard from './CarrinhoCard'
import './styles.css'

export default function PdvCenterPanel({
  carrinho,
  onIncrease,
  onDecrease,
  onRemove,
}) {
  return (
    <div className="pdv-center-panel">
      <CarrinhoCard
        carrinho={carrinho}
        onIncrease={onIncrease}
        onDecrease={onDecrease}
        onRemove={onRemove}
      />
    </div>
  )
}
