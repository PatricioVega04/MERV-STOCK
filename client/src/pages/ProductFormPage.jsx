import { useForm, useFieldArray } from 'react-hook-form';
import { useProducts } from '../context/ProductsContext';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { createProductSchema } from '../schemas/product.schema.js'; 

function ProductFormPage() {
    const { createProduct, getProduct, updateProduct } = useProducts();
    const navigate = useNavigate();
    const params = useParams();

    const { 
        register, 
        handleSubmit, 
        control, 
        setValue, 
        formState: { errors } 
    } = useForm({
        resolver: zodResolver(createProductSchema),
        defaultValues: {
            sizes: [{ size: "", quantity: 0 }] 
        }
    });

    const { fields, append, remove } = useFieldArray({ control, name: "sizes" });

    const categories = ['Adidas', 'Nike', 'New Balance', 'Vans', 'Puma', 'Botas/Zapatos', 'Nacional'];

    useEffect(() => {
        const loadProduct = async () => {
            if (params.id) {
                const product = await getProduct(params.id);
                setValue('name', product.name);
                setValue('category', product.category);
                setValue('color', product.color);
                setValue('price', product.price);
                setValue('sizes', product.sizes.length > 0 ? product.sizes : [{ size: '', quantity: 0 }]);
            }
        };
        loadProduct();
    }, [params.id]);

    const onSubmit = async (data) => {
        try {
            if (params.id) {
                await updateProduct(params.id, data);
            } else {
                await createProduct(data);
            }
            navigate("/products");
        } catch (error) {
            console.error("Error al guardar el producto:", error);
        }
    };

    return (
        <div className="form-card" style={{ margin: '2rem auto' }}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <h1>{params.id ? "Editar Producto" : "Nuevo Producto"}</h1>

                <label htmlFor="name">Nombre</label>
                <input type="text" {...register("name")} autoFocus />
                {errors.name && <p className="error-message">{errors.name.message}</p>}

                <label htmlFor="category">Marca / Categoría</label>
                <select {...register("category")}>
                    <option value="">Selecciona una marca</option>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                {errors.category && <p className="error-message">{errors.category.message}</p>}

                <label htmlFor="color">Color</label>
                <input type="text" {...register("color")} />
                {errors.color && <p className="error-message">{errors.color.message}</p>}
                
                <label htmlFor="price">Precio</label>
                <input type="number" step="0.01" {...register("price", { valueAsNumber: true })} />
                {errors.price && <p className="error-message">{errors.price.message}</p>}

                <h2>Talles y Stock</h2>
                <div>
                    {fields.map((field, index) => (
                        <div key={field.id} className="field-array-row">
                            <input {...register(`sizes.${index}.size`)} placeholder="Talle" />
                            <input type="number" {...register(`sizes.${index}.quantity`, { valueAsNumber: true })} placeholder="Cantidad" />
                            <button type="button" onClick={() => remove(index)} className="btn btn-danger" style={{ margin: 0, padding: '0.5rem 1rem' }}>X</button>
                        </div>
                    ))}
                   
                    {errors.sizes && !errors.sizes.root && <p className="error-message">{errors.sizes.message}</p>}
                </div>
                
                <button type="button" onClick={() => append({ size: '', quantity: 0 })} className="btn btn-secondary" style={{ width: '100%', marginTop: '0.5rem' }}>
                    Añadir Talle
                </button>
                
                <button type="submit" className="btn-primary" style={{ width: '100%' }}>Guardar Producto</button>
            </form>
        </div>
    );
}

export default ProductFormPage;