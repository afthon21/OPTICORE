// src/controller/tecnicoController.js
import Tecnico from '../models/Tecnico.js';

// Crear un técnico
export const crearTecnico = async (req, res) => {
  try {
    const { nombre, telefono, mercado } = req.body;

    const nuevoTecnico = new Tecnico({ nombre, telefono, mercado });
    const tecnicoGuardado = await nuevoTecnico.save();

    res.status(201).json(tecnicoGuardado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtener todos los técnicos
export const obtenerTecnicos = async (req, res) => {
  try {
    const tecnicos = await Tecnico.find();
    res.json(tecnicos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Incrementar el contador de tickets asignados a un técnico
export const actualizarTickets = async (req, res) => {
  try {
    const { id } = req.params;

    // Incrementa ticketsAsignados en 1
    const tecnico = await Tecnico.findByIdAndUpdate(
      id,
      { $inc: { ticketsAsignados: 1 } },
      { new: true } // Devuelve el documento actualizado
    );

    if (!tecnico) {
      return res.status(404).json({ error: 'Técnico no encontrado' });
    }

    res.json(tecnico);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
