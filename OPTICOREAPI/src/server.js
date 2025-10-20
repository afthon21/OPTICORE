import express from 'express';
import './db_conn.js';
import dotenv from 'dotenv';
import configureRoutes from './routes/routes.js';
import cors from 'cors';
import corsOptions from './libs/cors.js';
import { iniciarMonitoreoSalud } from './controller/network.controller.js'; // 👈 Agrega esta línea
import packageRoutes from "./middlewares/packages.routes.js"; // <-- Corrige el nombre aquí
import { logInfo, logWarning, logError } from './libs/logger.js';

//Config
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors(corsOptions));

//Rutas
configureRoutes(app);
app.use('/api/services', packageRoutes);

// Función para crear logs iniciales del sistema
const createInitialLogs = async () => {
    try {
        await logInfo('Sistema', 'Inicio del Servidor', 'Servidor OptiCore iniciado correctamente');
        // Crear algunos logs de ejemplo para demostrar el funcionamiento
        setTimeout(async () => {
            await logWarning('Sistema', 'Monitoreo', 'Verificación rutinaria del sistema iniciada');
        }, 5000);
        
        setTimeout(async () => {
            await logError('Sistema', 'Simulación de Error', 'Este es un error de prueba para verificar el sistema de logs');
        }, 10000);
    } catch (err) {
        // Removido console.error para no mostrar en terminal
    }
};

// Inicia monitoreo de red 
iniciarMonitoreoSalud();

//Server
app.listen(process.env.PORT, () => {
    console.log('App running');
    console.log(`${process.env.HOST}:${process.env.PORT}/api`);
    
    // Crear logs iniciales después de que el servidor esté funcionando
    setTimeout(createInitialLogs, 2000);
});