import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    category: {
        type: String,
        required: true,
        enum: ['Adidas', 'Nike', 'New Balance', 'Vans', 'Puma', 'Botas/Zapatos', 'Nacional']
    },
    color: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    sizes: [{
        size: { type: String, required: true },
        quantity: { type: Number, required: true, min: 0 }
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);