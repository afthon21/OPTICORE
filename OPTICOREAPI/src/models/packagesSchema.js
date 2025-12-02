import mongoose from 'mongoose';

const packageSchema = new mongoose.Schema({
    folio: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    type: {
        type: String,
        default: 'No especificado'
    },
    connectionType: {
        type: String,
        default: 'No especificado'
    },
    price: { type: Number, required: true },
    description: { type: String },
    platforms: [{ name: String, price: Number }], // Plataformas adicionales
    Client: { type: mongoose.Schema.Types.ObjectId, ref: 'client', required: true },
    createdAt: { type: Date, default: Date.now },
    Admin: { type: mongoose.Schema.Types.ObjectId, ref: 'admin' },
    Archived: {
        type: Boolean,
        default: false
    },
    ArchivedAt: {
        type: Date,
        default: null
    }
});

// Índice compuesto para optimizar consultas (sin restricción única)
// Esto permite que un cliente tenga múltiples paquetes del mismo tipo
packageSchema.index({ name: 1, Client: 1 });
// Index para eliminar automáticamente paquetes archivados después de 30 días
packageSchema.index({ ArchivedAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 30 });

export default mongoose.model('Packages', packageSchema);