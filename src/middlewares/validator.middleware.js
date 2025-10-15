import { ZodError } from 'zod';

export const validateSchema = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    } catch (error) {
        if (error instanceof ZodError) {
            console.error(
                "ERROR DE VALIDACIÓN DE ZOD:",
                error.issues.map(issue => ({
                    campo: issue.path.join('.'),
                    mensaje: issue.message
                }))
            );
            return res.status(400).json({
                errors: error.issues.map(issue => issue.message)
            });
        }
        console.error("Error inesperado en el middleware de validación:", error);
        return res.status(500).json({ message: "Error interno del servidor." });
    }
};