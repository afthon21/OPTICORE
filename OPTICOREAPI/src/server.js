import express from 'express';
import './db_conn.js';
import dotenv from 'dotenv';
import configureRoutes from './routes/routes.js';
import cors from 'cors';
import corsOptions from './libs/cors.js';
import { iniciarMonitoreoSalud } from './controller/network.controller.js';
import packageRoutes from "./middlewares/packages.routes.js";
// Logger imports removed for privacy

//Config
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors(corsOptions));

//Rutas
configureRoutes(app);
app.use('/api/services', packageRoutes);

// Logging functions removed for privacy

// Inicia monitoreo de red 
iniciarMonitoreoSalud();

//Server
app.listen(process.env.PORT, () => {
    console.log(`${process.env.HOST}:${process.env.PORT}/api`);
});