import {z} from 'zod';

export const registerSchema = z.object({
      username: z.string({ required_error: "El nombre de Usuario es requerido" }),

      email: z.string({ required_error: "El correo electrónico es requerido" }).email({ message: "El correo electrónico no es válido" }),

      password: z.string({ required_error: "La contraseña es requerida" }).min(4, { message: "La contraseña debe tener al menos 4 caracteres" }),
});

export const loginSchema = z.object({
    email: z.string({ required_error: "El correo electrónico es requerido" }).email({ message: "El correo electrónico no es válido" }),
    password: z.string({ required_error: "La contraseña es requerida" }).min(4, { message: "La contraseña debe tener al menos 4 caracteres" }),
});
