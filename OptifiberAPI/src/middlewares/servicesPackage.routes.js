import { Router } from 'express';
import * as controller from '../controller/servicesPackage.controller.js';
import { protectRoute, getProfile } from '../controller/auth.controller.js';

const serviceRoutes = Router();

serviceRoutes.post('/new', protectRoute, getProfile, controller.newService);
serviceRoutes.get('/all', (req, res) => {
    res.json([{ test: "ok" }]);
});
serviceRoutes.get('/view/:id', protectRoute, getProfile, controller.viewOneService);
serviceRoutes.post('/edit/:id', protectRoute, getProfile, controller.editService);
serviceRoutes.delete('/delete/:id', protectRoute, getProfile, controller.deleteService);

export default serviceRoutes;