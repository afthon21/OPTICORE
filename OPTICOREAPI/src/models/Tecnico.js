import mongoose from 'mongoose';

// Función para normalizar strings: quita acentos y pasa a minúsculas
const normalizeString = str =>
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

const allowedMarkets = ["estado de mexico", "puebla"];

const TecnicoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  telefono: { type: String, required: true },
  mercado: {
    type: String,
    required: true,
    validate: {
      validator: function(value) {
        const normalized = normalizeString(value);
        return allowedMarkets.includes(normalized);
      },
      message: props => `${props.value} no es un mercado válido`
    },
    set: normalizeString // Normaliza el valor antes de guardarlo
  },
  ticketsAsignados: { type: Number, default: 0 }
});

// Exportamos como ESM
export default mongoose.model('Tecnico', TecnicoSchema);
