import { viewProfile, editProfile, deleteProfile } from "../controller/profile.controller.js";
import { protectRoute, getProfile } from "../controller/auth.controller.js";
import { Router } from "express";

const profileRoute = Router();

profileRoute.get('/', protectRoute, getProfile, viewProfile);
profileRoute.post('/edit', protectRoute, getProfile, editProfile);
profileRoute.delete('/delete/:id', protectRoute, getProfile, deleteProfile);

export default profileRoute;