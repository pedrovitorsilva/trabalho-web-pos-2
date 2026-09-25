import './styles.css'

export default function Botao({ children, variant = 'primary', className = '', ...rest }) {
  const classes = `botao botao--${variant} ${className}`.trim()
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  )
}
