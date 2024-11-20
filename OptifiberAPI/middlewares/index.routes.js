import { Router } from "express";
import { index } from "../controller/inicio.controller.js";

const routerIndex = Router();

routerIndex.get('/',index)

export default routerIndex;