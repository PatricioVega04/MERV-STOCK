import { z } from "zod";

export const createProductSchema = z.object({
    name: z.string({
        required_error: "El nombre es requerido",
    }).min(1, { message: "El nombre no puede estar vacío" }),

    category: z.string({
        required_error: "La categoría es requerida",
    }).min(1, { message: "Debes seleccionar una categoría" }),

    color: z.string({
        required_error: "El color es requerido",
    }).min(1, { message: "El color no puede estar vacío" }),

   price: z.coerce.number({ 
        required_error: "El precio es requerido",
        invalid_type_error: "El precio debe ser un número",
    }).gt(0, { 
    message: "El precio debe ser mayor que 0" 
   }),

    sizes: z.array(z.object({
        size: z.string({ required_error: "El talle es requerido" }).min(1, { message: "El talle no puede estar vacío" }),
        quantity: z.number({ 
            required_error: "La cantidad es requerida",
            invalid_type_error: "La cantidad debe ser un número",
        }).int().nonnegative({ message: "La cantidad no puede ser negativa" })
    })).min(1, { message: "Debes añadir al menos un talle" })
});