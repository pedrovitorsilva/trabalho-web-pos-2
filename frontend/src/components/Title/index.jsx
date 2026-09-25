import './styles.css'

export default function Title({ children, className = '' }) {
  const classes = `title ${className}`.trim()
  return <h1 className={classes}>{children}</h1>
}
