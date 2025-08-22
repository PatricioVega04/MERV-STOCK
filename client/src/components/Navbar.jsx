
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <nav>
      <h1 >
        <Link to={isAuthenticated ? "/tasks" : "/"}>Gestor de Tareas</Link>
      </h1>
      <ul>
        {isAuthenticated ? (
          <>
            <li >
              Bienvenido, {user.username}!
            </li>
              <li>
              <Link to="/tasks">Mis Tareas</Link>
            </li>
            <li>
              <Link to="/add-task">Crear Tarea</Link>
            </li>
            <li>
              
            </li>
          
            <li>
              <button onClick={logout}>
                Cerrar Sesión
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Iniciar Sesión</Link>
            </li>
            <li>
              <Link to="/register">Registrarse</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;