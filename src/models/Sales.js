import mongoose from 'mongoose';

const saleSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    sizeSold: { type: String, required: true },
    finalPrice: { type: Number, required: true },
    saleDate: { type: Date, default: Date.now },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

export default mongoose.model('Sale', saleSchema);