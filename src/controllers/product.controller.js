import Product from '../models/Product.js';
import Movement from '../models/Movement.js'; 

export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({ user: req.user.id })
            .populate('user')
            .sort({ name: 1 })
            .collation({ locale: 'es', strength: 2 });
            
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los productos", error: error.message });
    }
};

export const createProduct = async (req, res) => {
    try {
        const { name, category, color, price, sizes } = req.body;

        const newProduct = new Product({
            name,
            category,
            color,
            price,
            sizes,
            user: req.user.id
        });
        await newProduct.save();

        if (newProduct.sizes && newProduct.sizes.length > 0) {
            const movements = newProduct.sizes.map(s => ({
                user: req.user.id,
                product: newProduct._id,
                productName: newProduct.name,
                type: 'creacion',
                size: s.size,
                quantityChange: s.quantity,
            }));
            await Movement.insertMany(movements);
        }

        res.status(201).json(newProduct);
    } catch (error) {
        console.error("Error al crear producto:", error);
        res.status(500).json({ message: "Error en el servidor", error: error.message });
    }
};

export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findOne({ _id: id, user: req.user.id });

        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el producto", error: error.message });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const originalProduct = await Product.findOne({ _id: id, user: req.user.id });
        if (!originalProduct) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        const originalSizesMap = new Map(
            originalProduct.sizes.map(s => [s.size, s.quantity])
        );

        const newSizes = req.body.sizes || [];
        const movementsToCreate = [];

        newSizes.forEach(newSize => {
            const oldQuantity = originalSizesMap.get(newSize.size) || 0;
            const quantityChange = newSize.quantity - oldQuantity;

            if (quantityChange !== 0) {
                movementsToCreate.push({
                    user: req.user.id,
                    product: originalProduct._id,
                    productName: req.body.name || originalProduct.name,
                    type: 'ajuste',
                    size: newSize.size,
                    quantityChange: quantityChange,
                });
            }
            originalSizesMap.delete(newSize.size);
        });

        originalSizesMap.forEach((oldQuantity, size) => {
            movementsToCreate.push({
                user: req.user.id,
                product: originalProduct._id,
                productName: originalProduct.name,
                type: 'ajuste',
                size: size,
                quantityChange: -oldQuantity,
            });
        });

        if (movementsToCreate.length > 0) {
            await Movement.insertMany(movementsToCreate);
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );

        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el producto", error: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findOne({ _id: id, user: req.user.id });
        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        if (product.sizes && product.sizes.length > 0) {
            const movements = product.sizes.map(s => ({
                user: req.user.id,
                product: product._id,
                productName: product.name,
                type: 'eliminacion',
                size: s.size,
                quantityChange: -s.quantity,
            }));
            await Movement.insertMany(movements);
        }
        
        await Product.findByIdAndDelete(id);

        res.status(200).json({ message: "Producto eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el producto", error: error.message });
    }
};