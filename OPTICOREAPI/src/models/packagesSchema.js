import mongoose from 'mongoose';

const packageSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    description: { type: String },
    createdAt: { type: Date, default: Date.now },
    Admin: { type: mongoose.Schema.Types.ObjectId, ref: 'Admins' } // 👈 agrega esto
});

export default mongoose.model('Packages', packageSchema);