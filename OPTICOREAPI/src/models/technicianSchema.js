import mongoose from 'mongoose';

const technicianSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    telefono: { type: String },
    mercado: { type: String },
    zona: { type: String },
    email: { type: String },
    ticketsAsignados: { type: Number, default: 0 },
    // Campos opcionales para compatibilidad
    apellidoP: { type: String },
    apellidoA: { type: String },
    activo: { type: Boolean, default: true },
    Archived: {
        type: Boolean,
        default: false
    }
});

const technician = mongoose.model('tecnicos', technicianSchema);

export default technician;