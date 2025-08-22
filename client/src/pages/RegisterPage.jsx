import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";    

function RegisterPage() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    
    const { signUp, user, isAuthenticated, errors: registerErrors } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/tasks");
            console.log("Usuario ya autenticado:", user);
        }
    }, [isAuthenticated, user, navigate]); 

 
    const onSubmit = handleSubmit(async (values) => {
        signUp(values); 
    });

    return (
        <div>
            
            {registerErrors.length > 0 && ( 
                <div style={{ color: 'red', marginBottom: '10px', padding: '10px', border: '1px solid red', borderRadius: '4px' }}>
                    {registerErrors.map((error, i) => (
                        <p key={i} style={{ margin: '5px 0' }}>
                            {error.message} 
                            {error.field && ` (Campo: ${error.field})`} 
                        </p>
                    ))}
                </div>
            )}

           
            <form onSubmit={onSubmit}>
                <input type="text" {...register("username", { required: true })} placeholder="Nombre de usuario" />
                {errors.username && <span style={{ color: 'orange', fontSize: '0.8em' }}>Este campo es obligatorio</span>}

                <input type="email" {...register("email", { required: true })} placeholder="Email" />
                {errors.email && <span style={{ color: 'orange', fontSize: '0.8em' }}>Este campo es obligatorio</span>}

                <input type="password" {...register("password", { required: true })} placeholder="Contraseña" />
                {errors.password && <span style={{ color: 'orange', fontSize: '0.8em' }}>Este campo es obligatorio</span>}

                <button type="submit">Registrar</button>
            </form>
            <p>
                ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link>
            </p>
        </div>
    );
}

export default RegisterPage;