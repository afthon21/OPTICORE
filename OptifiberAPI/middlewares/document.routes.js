import { Router } from "express";
import { protectRoute,getProfile } from "../controller/auth.controller.js";
import { createDocument,viewDocuments } from "../controller/document.controller.js";
import upload from "../libs/multer.js";

const documentRoutes = Router();

documentRoutes.post('/new/:id', upload.single('file'),protectRoute,getProfile,createDocument);
documentRoutes.get('/all/:id',protectRoute,getProfile,viewDocuments);

export default documentRoutes;