import { Outlet, Link } from 'react-router-dom';
import './AuthLayout.css';

export default function AuthLayout() {
  return (
    <div className="auth-layout">
      <header className="auth-layout__header">
        <Link to="/" className="auth-layout__logo-link" aria-label="Taksha — Home" style={{ textDecoration: 'none' }}>
          <div className="auth-layout__logo-text">TAKSHA <span>WORKSPACE</span></div>
        </Link>
      </header>

      <main className="auth-layout__main">
        <Outlet />
      </main>
    </div>
  );
}