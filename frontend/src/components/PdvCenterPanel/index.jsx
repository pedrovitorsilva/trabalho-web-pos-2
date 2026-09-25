import Card from '../Card'
import Subtitle from '../Subtitle'
import EmptyState from '../EmptyState'
import CartItem from '../CartItem'
import './styles.css'

export default function PdvCenterPanel({
  carrinho,
  onIncrease,
  onDecrease,
  onRemove,
}) {
  return (
    <div className="pdv-center-panel">
      <Card>
        <Subtitle>Lista de Produtos</Subtitle>
        {carrinho.length === 0 ? (
          <EmptyState icon="🛒" title="Carrinho vazio" />
        ) : (
          <div className="pdv-center-panel__items">
            {carrinho.map((item) => (
              <CartItem
                key={item.id_produto}
                item={item}
                onIncrease={onIncrease}
                onDecrease={onDecrease}
                onRemove={onRemove}
              />
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
