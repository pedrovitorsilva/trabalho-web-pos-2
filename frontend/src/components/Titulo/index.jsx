import './styles.css'

export default function Titulo({ children, className = '' }) {
  const classes = `titulo ${className}`.trim()
  return <h1 className={classes}>{children}</h1>
}
