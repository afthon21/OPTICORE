import { viewProfile,editProfile } from "../controller/profile.controller.js";
import { protectRoute,getProfile } from "../controller/auth.controller.js";
import { Router } from "express";

const profileRoute = Router();

profileRoute.get('/',protectRoute,getProfile,viewProfile);
profileRoute.post('/edit',protectRoute,getProfile,editProfile);

export default profileRoute;