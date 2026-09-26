import Button from '../Button'
import './styles.css'

export default function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  const subtotal = (item.preco_venda || 0) * (item.quantidade || 1)

  return (
    <div className="cart-item">
      <div className="cart-item__info">
        <p className="cart-item__name">{item.nome_produto}</p>
        <p className="cart-item__price">R$ {(item.preco_venda || 0).toFixed(2)}</p>
      </div>

      <div className="cart-item__quantity">
        <Button onClick={() => onDecrease(item.id_produto)} className="cart-item__btn">
          −
        </Button>
        <span className="cart-item__count">{item.quantidade || 1}</span>
        <Button onClick={() => onIncrease(item.id_produto)} className="cart-item__btn">
          +
        </Button>
      </div>

      <div className="cart-item__subtotal">
        <p className="cart-item__subtotal-label">Subtotal</p>
        <p className="cart-item__subtotal-value">R$ {subtotal.toFixed(2)}</p>
      </div>

      <button
        onClick={() => onRemove(item.id_produto)}
        className="cart-item__remove"
      >
        Remover
      </button>
    </div>
  )
}
