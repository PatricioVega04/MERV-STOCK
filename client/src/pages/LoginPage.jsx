import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

function LoginPage() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { signin, errors: signinErrors, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const onSubmit = (data) => signin(data);

    useEffect(() => {
        if (isAuthenticated) navigate("/products");
    }, [isAuthenticated]);

    return (
        <div className="auth-container">
            <div className="form-card">
                <h1>Iniciar Sesión</h1>
                
                {signinErrors.map((error, i) => (
                    <div className="error-message" key={i} style={{backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '5px', marginBottom: '1rem' }}>{error}</div>
                ))}
                
                <form onSubmit={handleSubmit(onSubmit)}>
                    <label htmlFor="email">Email</label>
                    <input type="email" {...register("email", { required: true })} />
                    {errors.email && <p className="error-message">El email es requerido</p>}

                    <label htmlFor="password">Contraseña</label>
                    <input type="password" {...register("password", { required: true })} />
                    {errors.password && <p className="error-message">La contraseña es requerida</p>}

                    <button type="submit" className="btn btn-primary">Ingresar</button>
                </form>

                <p style={{marginTop: '1.5rem'}}>
                    ¿No tienes una cuenta? <Link to="/register" className="form-link">Regístrate</Link>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;