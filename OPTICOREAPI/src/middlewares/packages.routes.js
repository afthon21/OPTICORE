import { Router } from 'express';
import { createPackage, getAllPackages, getPackageByName, getPackageById, updatePackage, deletePackage, getPackagesByClient } from '../controller/packages.controller.js';
import { protectRoute, getProfile } from '../controller/auth.controller.js';


const packageRoutes = Router();

packageRoutes.post('/new', protectRoute, getProfile, createPackage);
packageRoutes.get('/all', protectRoute, getProfile, getAllPackages);
packageRoutes.get('/client/:clientId', protectRoute, getProfile, getPackagesByClient);
packageRoutes.get('/view/:id', protectRoute, getProfile, getPackageById);
packageRoutes.get('/view-name/:name', protectRoute, getProfile, getPackageByName);
packageRoutes.put('/edit/:id', protectRoute, getProfile, updatePackage);
packageRoutes.delete('/delete/:id', protectRoute, getProfile, deletePackage);

export default packageRoutes;