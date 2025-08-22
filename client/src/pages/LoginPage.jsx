
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import { Link } from 'react-router-dom';

function LoginPage() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    // Obtener signin, user, isAuthenticated y los errores del backend (authErrors renombrados a loginErrors)
    const { signin, user, isAuthenticated, errors: loginErrors } = useAuth();
    const navigate = useNavigate(); // Inicializa navigate

    // Redirigir al usuario después de un login exitoso
    useEffect(() => {
        if (isAuthenticated) {
            navigate("/tasks"); // O a la ruta que desees después del login
        }
    }, [isAuthenticated, navigate]); // Añade navigate a las dependencias

    const onSubmit = handleSubmit((data) => {
        signin(data);
    });

    return (
        <div>
            {/* BLOQUE PARA MOSTRAR ERRORES DEL BACKEND (authErrors del AuthContext) */}
            {loginErrors.length > 0 && (
                <div style={{ color: 'red', marginBottom: '10px', padding: '10px', border: '1px solid red', borderRadius: '4px' }}>
                    {loginErrors.map((error, i) => (
                        <p key={i} style={{ margin: '5px 0' }}>
                            {error.message} {/* Muestra el mensaje de error */}
                            {error.field && ` (Campo: ${error.field})`} {/* Muestra el campo si está disponible */}
                        </p>
                    ))}
                </div>
            )}

            <form onSubmit={onSubmit}>
                <input type="email" {...register("email", { required: true })} placeholder="Email" />
                {errors.email && <span style={{ color: 'orange', fontSize: '0.8em' }}>Este campo es obligatorio</span>}

                <input type="password" {...register("password", { required: true })} placeholder="Contraseña" />
                {errors.password && <span style={{ color: 'orange', fontSize: '0.8em' }}>Este campo es obligatorio</span>}

                <button type="submit">Iniciar Sesión</button>
            </form>

            <p>
                ¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link>
            </p>
        </div>
    );
}

export default LoginPage;