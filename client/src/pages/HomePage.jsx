import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="homepage-container">
      <div>
        <h1 style={{ fontSize: '3rem', fontWeight: 'bold' }}>Bienvenido al Gestor de Stock</h1>
        <p style={{ maxWidth: '600px', margin: '1rem auto' }}>
          Una herramienta eficiente y moderna para llevar el control de tu inventario.
          Registra, actualiza y visualiza tus productos en tiempo real.
        </p>
        <Link to="/register" className="btn btn-primary" style={{ marginTop: '1rem', width: 'auto' }}>
          Comenzar ahora
        </Link>
      </div>
    </div>
  );
}

export default HomePage;