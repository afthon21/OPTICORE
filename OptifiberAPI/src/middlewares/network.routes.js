// middlewares/network.routes.js
import { Router } from 'express';
import { getOLTPorts, getNetworkHealthHistory, getDeviceInfo, getONUs } from '../controller/network.controller.js';

const router = Router();

router.get('/olt-ports-snmp', getOLTPorts);
router.get('/network-health-history', getNetworkHealthHistory);
router.get('/device-info', getDeviceInfo);
router.get('/onus', getONUs);

export default router;
