import mongoose from 'mongoose';

const mapaSchema = new mongoose.Schema({
    nombreNodo: String,
    tipo: String,
    lat: Number,
    lon: Number,
    region: String
});

export default mongoose.model('Mapa', mapaSchema);