import { createContext, useContext, useState } from "react";
import {
    getProductsRequest,
    getProductRequest,
    createProductRequest,
    updateProductRequest,
    deleteProductRequest
} from "../api/products.js";
import { registerSaleRequest } from "../api/sales.js"; 

const ProductsContext = createContext();

export const useProducts = () => {
    const context = useContext(ProductsContext);
    if (!context) throw new Error("useProducts must be used within a ProductsProvider");
    return context;
};

export function ProductsProvider({ children }) {

    const [products, setProducts] = useState([]);
    

    const getProducts = async () => {
        try {
            const res = await getProductsRequest();
            setProducts(res.data);
        } catch (error) {
            console.error("Error al obtener productos:", error);
        }
    };

    const createProduct = async (product) => {
        console.log("🚦 PASO 2: Contexto - createProduct llamado con:", product);
        try {
            await createProductRequest(product);
        } catch (error) {
            console.error("Error al crear producto:", error);
        }
    };

    const deleteProduct = async (id) => {
        try {
            await deleteProductRequest(id);
            setProducts(products.filter(product => product._id !== id));
        } catch (error) {
            console.error("Error al eliminar producto:", error);
        }
    };

    const getProduct = async (id) => {
        try {
            const res = await getProductRequest(id);
            return res.data;
        } catch (error) {
            console.error("Error al obtener un producto:", error);
        }
    };

    const updateProduct = async (id, product) => {
        try {
            await updateProductRequest(id, product);
        } catch (error) {
            console.error("Error al actualizar producto:", error);
        }
    };

  const registerSale = async (productId, sizeSold) => {
        try {
            const product = products.find(p => p._id === productId);
            if (!product) throw new Error("Producto no encontrado");

            const newProductsState = products.map(p => {
                if (p._id === productId) {
                    const updatedSizes = p.sizes.map(s => {
                        if (s.size === sizeSold) {
                            return { ...s, quantity: s.quantity - 1 };
                        }
                        return s;
                    });
                    return { ...p, sizes: updatedSizes };
                }
                return p;
            });
            setProducts(newProductsState);

            const saleData = { productId, sizeSold, finalPrice: product.price };
            await registerSaleRequest(saleData);

        } catch (error) {
            console.error("Error al registrar la venta:", error);
            getProducts();
        }
    };
    return (
        <ProductsContext.Provider value={{
            products,
            getProducts,
            createProduct,
            deleteProduct,
            getProduct,
            updateProduct,
            registerSale 
        }}>
            {children}
        </ProductsContext.Provider>
    );
}