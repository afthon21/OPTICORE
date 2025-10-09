import mongoose from 'mongoose';

const technicianSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    apellidoP: { type: String, required: true },
    apellidoA: { type: String, required: true },
    activo: { type: Boolean, default: true },
    Archived: {
        type: Boolean,
        default: false
    }
});

const technician = mongoose.model('technician', technicianSchema);

export default technician;