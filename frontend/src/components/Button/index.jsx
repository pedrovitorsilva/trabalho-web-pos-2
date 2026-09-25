import './styles.css'

export default function Button({ children, variant = 'primary', className = '', ...rest }) {
  const classes = `button button--${variant} ${className}`.trim()
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  )
}
