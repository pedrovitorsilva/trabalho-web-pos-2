import { useEffect, useState } from 'react'
import './styles.css'

export default function ProductImage({ codigo_barras }) {
  const [imageUrl, setImageUrl] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isVisible, setIsVisible] = useState(false)

  const handleView = (node) => {
    if (!node) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true)
        observer.disconnect()
      }
    })
    observer.observe(node)
  }

  useEffect(() => {
    if (!isVisible) return
    const fetchImage = async () => {
      try {
        const res = await fetch(
          `https://world.openfoodfacts.org/api/v3/product/${codigo_barras}.json?fields=image_url`
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
  }, [codigo_barras, isVisible])

  if (!isVisible) return <div ref={handleView} className="product-image__placeholder">Carregando...</div>
  if (loading) return <div ref={handleView} className="product-image__placeholder">...</div>
  if (!imageUrl) return <div ref={handleView} className="product-image__placeholder">Sem imagem</div>
  return <img ref={handleView} src={imageUrl} alt="Produto" className="product-image" />
}
