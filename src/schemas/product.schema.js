import { z } from "zod";

const allowedCategories = ['Adidas', 'Nike', 'New Balance', 'Vans', 'Puma', 'Botas/Zapatos', 'Nacional'];

export const createProductSchema = z.object({
    name: z.string({
        required_error: "El nombre es requerido",
    }),
    category: z.enum(allowedCategories, {
        required_error: "La categoría es requerida",
        errorMap: () => ({ message: "Categoría no válida" }),
    }),
    color: z.string({
        required_error: "El color es requerido",
    }),
    price: z.number({
        required_error: "El precio es requerido",
    }).positive(),
    sizes: z.array(z.object({
        size: z.string({ required_error: "El talle es requerido" }),
        quantity: z.number({ required_error: "La cantidad es requerida" }).int().nonnegative()
    })).min(1, { message: "Debes añadir al menos un talle" })
});