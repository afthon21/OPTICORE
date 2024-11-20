import { createPayment,viewAllPayments,viewOnePayment,createPaymentById,vieWClientPayments } from "../controller/payment.controller.js";
import { protectRoute,getProfile } from "../controller/auth.controller.js";
import { Router } from "express";

const payRoutes = Router();

payRoutes.post('/new',protectRoute,getProfile,createPayment);
payRoutes.get('/all',protectRoute,getProfile,viewAllPayments);
payRoutes.get('/view/:id',protectRoute,getProfile,viewOnePayment);
payRoutes.post('/new/:id',protectRoute,getProfile,createPaymentById);
payRoutes.get('/all/:id',protectRoute,getProfile,vieWClientPayments);

export default payRoutes;