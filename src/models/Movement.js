import mongoose from 'mongoose';

const movementSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    productName: { type: String, required: true }, 
    type: {
        type: String,
        required: true,
        enum: ['creacion', 'venta', 'ajuste', 'eliminacion'], 
    },
    size: { type: String, required: true },
    quantityChange: { type: Number, required: true }, 
}, { timestamps: true });

export default mongoose.model('Movement', movementSchema);