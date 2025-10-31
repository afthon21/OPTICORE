import { Router } from 'express';
import { getMapaByRegion } from '../controller/mapa.controller.js';

const router = Router();
router.get('/mapa', getMapaByRegion);
// Ejemplo en src/routes/routes.js
import mapaRoutes from '../middlewares/mapa.routes.js';
// ...
app.use('/api', mapaRoutes);
export default router;