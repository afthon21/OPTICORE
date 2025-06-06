import { Router } from 'express';
import { createPackage, getAllPackages, getPackageByName } from '../controller/packages.controller.js';
import { protectRoute, getProfile } from '../controller/auth.controller.js';

const packageRoutes = Router();

packageRoutes.post('/new', protectRoute, getProfile, createPackage);
packageRoutes.get('/all', protectRoute, getProfile, getAllPackages);
packageRoutes.get('/view/:name', protectRoute, getProfile, getPackageByName);

export default packageRoutes;