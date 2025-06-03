import mongoose from 'mongoose';

const packageSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    description: { type: String },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Package', packageSchema);