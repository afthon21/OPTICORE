import { Router } from "express";
import { newTechnician, viewAllTechnicians, viewTechnicianById, editTechnician, deleteTechnician } from "../controller/technician.controller.js";
import { protectRoute, getProfile } from "../controller/auth.controller.js";

const technicianRoutes = Router();

technicianRoutes.post('/new', protectRoute, getProfile, newTechnician);
technicianRoutes.get('/all', protectRoute, getProfile, viewAllTechnicians);
technicianRoutes.get('/view/:id', protectRoute, getProfile, viewTechnicianById);
technicianRoutes.post('/edit/:id', protectRoute, getProfile, editTechnician);
technicianRoutes.delete('/delete/:id', protectRoute, getProfile, deleteTechnician);

export default technicianRoutes;