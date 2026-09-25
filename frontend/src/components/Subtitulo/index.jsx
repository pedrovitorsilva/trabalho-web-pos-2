import './styles.css'

export default function Subtitulo({ children, className = '' }) {
  const classes = `subtitulo ${className}`.trim()
  return <h2 className={classes}>{children}</h2>
}
