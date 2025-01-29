import { registerUser,loginUser } from "../controller/auth.controller.js";
import { Router } from "express";

const auhtRoutes = Router();

auhtRoutes.post('/register',registerUser);
auhtRoutes.post('/login',loginUser);

export default auhtRoutes;