import { createPayment, viewAllPayments, viewOnePayment, createPaymentById, vieWClientPayments, deletePayment, editPayment, archivePayments } from "../controller/payment.controller.js";
import { protectRoute, getProfile } from "../controller/auth.controller.js";
import { Router } from "express";

const payRoutes = Router();

payRoutes.post('/new', protectRoute, getProfile, createPayment);
payRoutes.get('/all', protectRoute, getProfile, viewAllPayments);
payRoutes.get('/view/:id', protectRoute, getProfile, viewOnePayment);
payRoutes.post('/new/:id', protectRoute, getProfile, createPaymentById);
payRoutes.get('/all/:id', protectRoute, getProfile, vieWClientPayments);
payRoutes.post('/edit/:id', protectRoute, getProfile, editPayment);
payRoutes.delete('/delete/:di', protectRoute, getProfile, deletePayment);
payRoutes.get('/archive/:id', protectRoute, getProfile, archivePayments);

export default payRoutes;