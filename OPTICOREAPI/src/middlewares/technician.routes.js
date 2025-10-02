import { Router } from "express";
import { newTechnician, viewAllTechnicians, viewTechnicianById, editTechnician, deleteTechnician } from "../controller/technician.controller.js";
import { protectRoute, getProfile } from "../controller/auth.controller.js";
import { viewActiveTechnicians, viewInactiveTechnicians } from "../controller/technician.controller.js";


const technicianRoutes = Router();

technicianRoutes.post('/new', protectRoute, getProfile, newTechnician);
technicianRoutes.get('/all', viewAllTechnicians);
technicianRoutes.get('/view/:id', protectRoute, getProfile, viewTechnicianById);
technicianRoutes.post('/edit/:id', protectRoute, getProfile, editTechnician);
technicianRoutes.delete('/delete/:id', protectRoute, getProfile, deleteTechnician);
technicianRoutes.get('/active', viewActiveTechnicians);
technicianRoutes.get('/inactive', viewInactiveTechnicians);

export default technicianRoutes;