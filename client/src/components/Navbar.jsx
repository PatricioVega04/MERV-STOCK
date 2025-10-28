import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { isAuthenticated } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to={isAuthenticated ? "/products" : "/"} className="navbar-brand">
          Gestor de <span>Stock</span>
        </Link>
        
        <div className="navbar-right-cluster">
          <ul className="navbar-links">
            {isAuthenticated ? (
              <>
                <li className="navbar-item">
                  <Link to="/products" className="navbar-link">Mis Productos</Link>
                </li>
                <li className="navbar-item">
                  <Link to="/add-product" className="navbar-link">Añadir</Link>
                </li>
                <li className="navbar-item">
                  <Link to="/history" className="navbar-link">Historial</Link>
                </li>
              </>
            ) : (
              <>
                <li className="navbar-item">
                  <Link to="/login" className="navbar-link">Iniciar Sesión</Link>
                </li>
                <li className="navbar-item">
                  <Link to="/register" className="navbar-link btn-register">Registrarse</Link>
                </li>
              </>
            )}
          </ul>

          {isAuthenticated && (
            <div className="navbar-profile-item">
              <Link to="/profile" className="navbar-profile-icon">
                <i className="fas fa-user-circle"></i>
              </Link>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
}

export default Navbar;