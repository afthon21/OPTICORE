import { Router } from "express";
import { getInterfacesTraffic } from "../controller/network.controller.js";
const router = Router();

router.get('/devices-traffic', getInterfacesTraffic);

export default router;