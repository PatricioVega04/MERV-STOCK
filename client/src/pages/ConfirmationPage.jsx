import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../api/axios';

function ConfirmationPage() {
    const [message, setMessage] = useState('Verificando tu cuenta...');
    const [error, setError] = useState(false);
    const { token } = useParams();

    const verificationAttempted = useRef(false);

    useEffect(() => {
        if (token && !verificationAttempted.current) {
            verificationAttempted.current = true;

            const confirmAccount = async () => {
                try {
                    const res = await axios.get(`/confirm/${token}`);
                    setMessage(res.data.message);
                    setError(false);
                } catch (err) {
                    setMessage(err.response?.data?.message || 'Error al procesar la solicitud.');
                    setError(true);
                }
            };

            confirmAccount();
        }
    }, [token]); 

    return (
        <div className="auth-container">
            <div className="form-card" style={{ textAlign: 'center' }}>
                <h1 style={{ color: error ? 'var(--color-red)' : 'var(--color-primary)' }}>
                    {error ? 'Error en la Verificación' : '¡Cuenta Verificada!'}
                </h1>
                <p>{message}</p>
                {!error && (
                    <Link to="/login" className="btn btn-primary" style={{ marginTop: '1rem', width: 'auto' }}>
                        Ir a Iniciar Sesión
                    </Link>
                )}
            </div>
        </div>
    );
}

export default ConfirmationPage;