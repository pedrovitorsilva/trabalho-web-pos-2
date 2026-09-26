import { Link } from "react-router-dom";
import Title from "../Title";
import "./styles.css";

export default function Header() {
  return (
    <header className="header">
      <div className="header__container">
        <Title className="header__title">Mercadinho São Miguel</Title>
        <nav className="header__nav">
          <ul className="header__nav-list">
            <li>
              <Link to="/pdv" className="header__nav-link">
                PDV
              </Link>
            </li>
            <li>
              <Link to="/produtos" className="header__nav-link">
                Produtos
              </Link>
            </li>
            <li>
              <Link to="/pessoas" className="header__nav-link">
                Pessoas
              </Link>
            </li>
            <li>
              <Link to="/resgates" className="header__nav-link">
                Resgates
              </Link>
            </li>
            <li>
              <Link to="/entradas" className="header__nav-link">
                Entradas
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
