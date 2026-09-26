import './styles.css'

export default function Banner({ icon, title, subtitle }) {
  return (
    <div className="banner">
      {icon && <span className="banner__icon">{icon}</span>}
      <div className="banner__content">
        <h1 className="banner__title">{title}</h1>
        {subtitle && <p className="banner__subtitle">{subtitle}</p>}
      </div>
    </div>
  )
}
