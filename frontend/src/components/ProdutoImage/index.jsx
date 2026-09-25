import { useEffect, useState } from 'react'
import './styles.css'

export default function ProdutoImage({ codigo_barras }) {
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
