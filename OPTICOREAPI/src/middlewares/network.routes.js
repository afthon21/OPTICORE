import { Router } from 'express';
import { getOLTPorts, getNetworkHealthHistory, getDeviceInfo, getONUs } from '../controller/network.controller.js';
import { getUispTopology } from '../controller/topologia.controller.js';
import { protectRoute } from '../controller/auth.controller.js';

const router = Router();

router.get('/olt-ports-snmp', getOLTPorts);
router.get('/network-health-history', getNetworkHealthHistory);
router.get('/device-info', getDeviceInfo);
router.get('/onus', getONUs);

// Nueva ruta para topología UISP (protegida)
router.get('/uisp/topology', protectRoute, getUispTopology);

export default router;