import './styles.css'

export default function Tooltip({ children, content }) {
  return (
    <span className="tooltip" tabIndex={0}>
      {children}
      <span className="tooltip__content">{content}</span>
    </span>
  )
}
