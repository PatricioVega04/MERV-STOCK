import Sale from '../models/Sales.js';
import Product from '../models/Product.js';
import Movement from '../models/Movement.js'; 

export const registerSale = async (req, res) => {
    const { productId, sizeSold } = req.body;

    try {
       
        const updatedProduct = await Product.findOneAndUpdate(
            {
                "_id": productId,
                "user": req.user.id,
                "sizes.size": sizeSold,
                "sizes.quantity": { $gt: 0 } 
            },
            { $inc: { "sizes.$.quantity": -1 } }, 
            { new: true } 
        );

        if (!updatedProduct) {
            return res.status(400).json({ message: "Stock insuficiente o el producto/talle no existe." });
        }

        const newSale = new Sale({
            productId,
            sizeSold,
            finalPrice: updatedProduct.price,
            user: req.user.id
        });
        await newSale.save();

        const movement = new Movement({
            user: req.user.id,
            product: updatedProduct._id,
            productName: updatedProduct.name,
            type: 'venta',
            size: sizeSold,
            quantityChange: -1, 
        });
        await movement.save();

        res.status(201).json({ message: "Venta registrada con éxito", sale: newSale });

    } catch (error) {
        res.status(500).json({ message: "Error en el servidor", error: error.message });
    }
};