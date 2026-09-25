import './styles.css'

export default function Subtitle({ children, className = '' }) {
  const classes = `subtitle ${className}`.trim()
  return <h2 className={classes}>{children}</h2>
}
