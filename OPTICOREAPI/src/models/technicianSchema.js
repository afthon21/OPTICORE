import mongoose from 'mongoose';

const technicianSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    telefono: { type: String },
    mercado: { type: String },
    ticketsAsignados: { type: Number, default: 0 },
    apellidoP: { type: String },
    apellidoA: { type: String },
    activo: { type: Boolean, default: true },
}, {
    timestamps: true
});

const technician = mongoose.model('tecnicos', technicianSchema);

export default technician;