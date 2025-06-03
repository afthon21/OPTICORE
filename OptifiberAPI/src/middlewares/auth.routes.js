import { registerUser, loginUser, sendMailRecovery, verifyRecoveryCode, resetPassword } from "../controller/auth.controller.js";
import { Router } from "express";

const authRoutes = Router();

authRoutes.post('/register', registerUser);
authRoutes.post('/login', loginUser);
authRoutes.post('/sent-recovery-code', sendMailRecovery);
authRoutes.post('/verify-recovery-code', verifyRecoveryCode);
authRoutes.post('/reset-password', resetPassword);

export default authRoutes;