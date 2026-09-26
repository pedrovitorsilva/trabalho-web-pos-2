import { Link } from 'react-router-dom'
import Title from '../Title'
import './styles.css'

export default function Header() {
  return (
    <header className="header">
      <div className="header__container">
        <Title className="header__title">Mercadinho São Miguel</Title>
        <nav className="header__nav">
          <ul className="header__nav-list">
            <li>
              <Link to="/" className="header__nav-link">
                Home
              </Link>
            </li>
            <li>
              <Link to="/produtos" className="header__nav-link">
                Produtos
              </Link>
            </li>
            <li>
              <Link to="/resgates" className="header__nav-link">
                Resgates
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
