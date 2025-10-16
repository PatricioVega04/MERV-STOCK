import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

function RegisterPage() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { signup, isAuthenticated, errors: registerErrors } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) navigate("/products");
    }, [isAuthenticated]);

   const onSubmit = async (values) => {
        const result = await signup(values);
        if (result) {
            navigate("/verify-email");
        }
    };

    return (
        <div className="auth-container">
            <div className="form-card">
                <h1>Registro</h1>

                {registerErrors.map((error, i) => (
                    <div className="error-message" key={i} style={{backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '5px', marginBottom: '1rem' }}>{error}</div>
                ))}

                <form onSubmit={handleSubmit(onSubmit)}>
                    <label htmlFor="username">Nombre de Usuario</label>
                    <input type="text" {...register("username", { required: true })} />
                    {errors.username && <p className="error-message">El nombre de usuario es requerido</p>}
                    
                    <label htmlFor="email">Email</label>
                    <input type="email" {...register("email", { required: true })} />
                    {errors.email && <p className="error-message">El email es requerido</p>}
                    
                    <label htmlFor="password">Contraseña</label>
                    <input type="password" {...register("password", { required: true })} />
                    {errors.password && <p className="error-message">La contraseña es requerida</p>}

                    <button type="submit" className="btn btn-primary">Registrarse</button>
                </form>

                <p style={{marginTop: '1.5rem'}}>
                    ¿Ya tienes una cuenta? <Link to="/login" className="form-link">Inicia Sesión</Link>
                </p>
            </div>
        </div>
    );
}

export default RegisterPage;