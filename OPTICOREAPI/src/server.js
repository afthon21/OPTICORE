import express from 'express';
import './db_conn.js';
import dotenv from 'dotenv';
import configureRoutes from './routes/routes.js';
import cors from 'cors';
import corsOptions from './libs/cors.js';
import { iniciarMonitoreoSalud } from './controller/network.controller.js';
import servicesRoutes from './middlewares/servicesPackage.routes.js';
import tecnicoRoutes from './routes/tecnicoRoutes.js';

// Configuración
dotenv.config();
const app = express();

// Middlewares
app.use(express.json());
app.use(cors(corsOptions));

// Rutas
app.use('/api', tecnicoRoutes); // módulo Técnico
configureRoutes(app);
app.use('/api/services', servicesRoutes);

// Inicia monitoreo de red
iniciarMonitoreoSalud();

// Server
app.listen(process.env.PORT, () => {
  console.log('App running');
  console.log(`${process.env.HOST}:${process.env.PORT}/api`);
});
