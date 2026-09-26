import './styles.css'

export default function EmptyState({ icon, title }) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon">{icon}</div>
      <p className="empty-state__title">{title}</p>
    </div>
  )
}
