import { Link } from 'react-router-dom';

function VerifyEmailPage() {
    return (
        <div className="auth-container">
            <div className="form-card" style={{ textAlign: 'center' }}>
                <h1 style={{ color: 'var(--color-primary)', fontSize: '2rem' }}>¡Casi listo!</h1>
                <p style={{ margin: '1.5rem 0' }}>
                    Hemos enviado un enlace de verificación a tu correo electrónico.
                    Por favor, revisa tu bandeja de entrada (y la carpeta de spam) para activar tu cuenta.
                </p>
                <i className="fas fa-envelope-open-text" style={{ fontSize: '4rem', color: 'var(--color-primary)', margin: '1rem 0' }}></i>
                <p style={{ color: 'var(--color-text-muted)' }}>
                    Una vez verificada, podrás iniciar sesión.
                </p>
                <Link to="/login" className="btn btn-primary" style={{ marginTop: '2rem', width: 'auto' }}>
                    Ir a Iniciar Sesión
                </Link>
            </div>
        </div>
    );
}

export default VerifyEmailPage;