import './styles.css'

export default function FeedbackMessage({ type, message }) {
  if (!message) return null
  return <p role="status" className={`feedback feedback--${type}`}>{message}</p>
}
