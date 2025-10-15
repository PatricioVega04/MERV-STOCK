import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function ProfilePage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/'); // Redirige al inicio después de cerrar sesión
    };

    return (
        <div className="auth-container">
            <div className="form-card" style={{ textAlign: 'center' }}>
                <h1 style={{ fontSize: '2rem' }}>Perfil de Usuario</h1>
                <div style={{ margin: '2rem 0', fontSize: '1.2rem' }}>
                    <p><strong>Usuario:</strong> {user.username}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                </div>
                <button onClick={handleLogout} className="btn btn-danger" style={{ width: '100%' }}>
                    Cerrar Sesión
                </button>
            </div>
        </div>
    );
}

export default ProfilePage;