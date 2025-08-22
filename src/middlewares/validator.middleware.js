// src/middlewares/validator.middleware.js
import { ZodError } from 'zod';

export const validateSchema = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body); // Intenta validar el cuerpo de la solicitud con el esquema Zod
        next(); // Si todo es válido, pasa al siguiente middleware
    } catch (error) {
        // console.log para depuración (puedes eliminarlos una vez que funcione)
        console.log("--- INICIO DEPURACIÓN DE VALIDATOR MIDDLEWARE ---");
        console.log("Tipo de error capturado:", typeof error);
        console.log("¿Es 'error' una instancia de ZodError?", error instanceof ZodError);
        console.log("Objeto 'error' completo (serializado):", JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
        console.log("Valor de 'error.issues':", error.issues); // <-- AHORA BUSCAMOS 'issues'
        console.log("---------------------------------------------------");

        if (error instanceof ZodError) {
            // ¡¡¡CAMBIO CLAVE: Usar error.issues en lugar de error.errors!!!
            if (Array.isArray(error.issues)) {
                const formattedErrors = error.issues.map(err => ({
                    message: err.message, // El mensaje de error específico de Zod
                    // `path` en 'issues' también está presente, igual que en 'errors'
                    field: err.path && err.path.length > 0 ? err.path.join('.') : undefined
                }));

                // Responde con un estado 400 (Bad Request) y los errores de validación
                return res.status(400).json({
                    status: "error",
                    message: "Validation failed", // Mensaje general de fallo de validación
                    errors: formattedErrors // Enviamos esto como 'errors' al frontend para consistencia
                });
            } else {
                // Este caso NO debería ocurrir si es un ZodError válido
                console.error("ERROR CRÍTICO: ZodError.issues no es un array.", { issuesProperty: error.issues, fullError: error });
                return res.status(500).json({
                    status: "error",
                    message: "Error de validación: Estructura de ZodError inesperada (issues no es un array)."
                });
            }
        } else {
            // Si el error no es un ZodError (es un error inesperado de otro tipo)
            console.error("Ocurrió un error inesperado (no ZodError) en validateSchema middleware:", error);
            // Responde con un estado 500 (Internal Server Error)
            return res.status(500).json({
                status: "error",
                message: "Ocurrió un error inesperado en el servidor durante la validación."
            });
        }
    }
};