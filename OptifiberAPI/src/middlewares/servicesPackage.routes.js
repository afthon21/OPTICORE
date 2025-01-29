import { Router } from 'express';
import { newService, viewAllServices, viewOneService, editService, deleteService } from '../controller/servicesPackage.controller.js';
import { protectRoute, getProfile } from '../controller/auth.controller.js';

const serviceRoutes = Router();

serviceRoutes.post('/new', protectRoute, getProfile, newService);
serviceRoutes.get('/all', protectRoute, getProfile, viewAllServices);
serviceRoutes.get('/view/:id', protectRoute, getProfile, viewOneService);
serviceRoutes.post('/edit/:id', protectRoute, getProfile, editService);
serviceRoutes.delete('/delete/:id', protectRoute, getProfile, deleteService);

export default serviceRoutes;