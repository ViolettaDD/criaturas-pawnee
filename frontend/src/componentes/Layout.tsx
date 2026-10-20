import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";

type LayoutProps = {
  children: ReactNode;
};

export function Layout({ children }: LayoutProps) {
  return (
    <div className="app-shell container is-fluid">
      <header className="terminal-header navbar" role="banner">
        <div className="terminal-header__dots" aria-hidden="true">
          <span className="dot dot--red" />
          <span className="dot dot--amber" />
          <span className="dot dot--green" />
        </div>

        <div className="terminal-header__brand" aria-label="Criaturas de Pawnee terminal header">
          <span className="brand-mark" aria-hidden="true">👁</span>
          <div>
            <p className="brand-name">CRIATURAS DE PAWNEE</p>
            <small>archivo de campo · acceso restringido (pero no mucho)</small>
          </div>
        </div>
      </header>

      <nav className="top-nav navbar" aria-label="Navegación principal">
        <div className="navbar-menu is-active">
          <div className="navbar-start">
        <NavLink to="/" end className={({ isActive }) => `nav-link navbar-item ${isActive ? "is-active" : ""}`}>
          Criaturas
        </NavLink>
        <NavLink to="/avistamientos" className={({ isActive }) => `nav-link navbar-item ${isActive ? "is-active" : ""}`}>
          Avistamientos
        </NavLink>
          </div>
        </div>
      </nav>

      <main className="main-shell container is-fluid">{children}</main>
    </div>
  );
}
