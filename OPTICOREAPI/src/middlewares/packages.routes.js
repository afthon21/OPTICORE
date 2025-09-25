import { Router } from 'express';
import { createPackage, getAllPackages, getPackageByName, getPackageById, updatePackage, deletePackage } from '../controller/packages.controller.js';
import { protectRoute, getProfile } from '../controller/auth.controller.js';


const packageRoutes = Router();

packageRoutes.post('/new', protectRoute, getProfile, createPackage);
packageRoutes.get('/all', protectRoute, getProfile, getAllPackages);
packageRoutes.get('/view/:id', protectRoute, getProfile, getPackageById);
packageRoutes.get('/view-name/:name', protectRoute, getProfile, getPackageByName);
packageRoutes.put('/edit/:id', protectRoute, getProfile, updatePackage);
packageRoutes.delete('/delete/:id', protectRoute, getProfile, deletePackage);

export default packageRoutes;