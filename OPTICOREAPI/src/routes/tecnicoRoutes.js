import express from 'express';
import { crearTecnico, obtenerTecnicos, actualizarTickets } from '../controller/tecnicoController.js';

const router = express.Router();

// Crear técnico
router.post('/tecnicos', crearTecnico);

// Obtener todos los técnicos
router.get('/tecnicos', obtenerTecnicos);

// Incrementar tickets de un técnico
router.patch('/tecnicos/:id/ticket', actualizarTickets);

export default router;
