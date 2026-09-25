import Card from '../Card'
import './styles.css'

export default function ScrollableCard({ children, className = '' }) {
  return (
    <Card className={`scrollable-card ${className}`}>
      <div className="scrollable-card__content">{children}</div>
    </Card>
  )
}
