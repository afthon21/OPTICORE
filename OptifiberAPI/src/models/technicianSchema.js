import mongoose from 'mongoose';

const technicianSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    apellidoP: { type: String, required: true },
    apellidoA: { type: String, required: true },
    
});

const technician = mongoose.model('technician', technicianSchema);

export default technician;