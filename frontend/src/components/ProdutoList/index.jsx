import { useEffect, useState } from 'react'
import './styles.css'

const brl = (v) => Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

const ProdutoImage = ({ codigo_barras }) => {
  const [imageUrl, setImageUrl] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const res = await fetch(
          `https://world.openfoodfacts.org/api/v3/product/${codigo_barras}.json`
        )
        if (res.ok) {
          const data = await res.json()
          if (data.product?.image_url) {
            setImageUrl(data.product.image_url)
          }
        }
      } catch (err) {
        // API error ou barcode não encontrado
      } finally {
        setLoading(false)
      }
    }
    fetchImage()
  }, [codigo_barras])

  if (loading) return <div className="produto-image__placeholder">...</div>
  if (!imageUrl) return <div className="produto-image__placeholder">Sem imagem</div>
  return <img src={imageUrl} alt="Produto" className="produto-image" />
}

export default function ProdutoList({ produtos, loading, error }) {
  if (loading) return <p className="produto-list__status">Carregando produtos...</p>
  if (error) return <p className="produto-list__status produto-list__status--error">{error}</p>
  if (produtos.length === 0) return <p className="produto-list__status">Nenhum produto cadastrado ainda.</p>

  return (
    <div className="produto-list">
      <h2>Produtos cadastrados</h2>
      <table className="produto-list__table">
        <thead>
          <tr>
            <th>Imagem</th>
            <th>Nome</th>
            <th>Código de Barras</th>
            <th>Preço de Venda</th>
            <th>Estoque</th>
          </tr>
        </thead>
        <tbody>
          {produtos.map((p, i) => (
            <tr key={p._id ?? i} className={p.qtd_atual < p.qtd_minima ? 'produto-list__row--low' : undefined}>
              <td className="produto-list__image-cell">
                <ProdutoImage codigo_barras={p.codigo_barras} />
              </td>
              <td>{p.nome}</td>
              <td>{p.codigo_barras}</td>
              <td className="produto-list__price">{brl(p.preco_venda)}</td>
              <td>{p.qtd_atual}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
