import express from 'express';
//Import Routes
import clientRoutes from '../middlewares/client.routes.js';
import authRoutes from '../middlewares/auth.routes.js';
import ticketRoute from '../middlewares/ticket.routes.js';
import payRoutes from '../middlewares/payment.routes.js';
import documentRoutes from '../middlewares/document.routes.js';
import profileRoute from '../middlewares/profile.routes.js';
import notesRoutes from '../middlewares/notes.routes.js';
import serviceRoutes from '../middlewares/servicesPackage.routes.js';
import packageRoutes from '../middlewares/packages.routes.js';
import technicianRoutes from '../middlewares/technician.routes.js';


const configureRoutes = (app) => {

    const principal = '/api'

    app.use(`${principal}/client`, clientRoutes);
    app.use(`${principal}/auth`, authRoutes);
    app.use(`${principal}/ticket`, ticketRoute);
    app.use(`${principal}/pay`, payRoutes);
    app.use(`${principal}/document`, documentRoutes);
    app.use(`${principal}/public/`, express.static('./storage/img'));
    app.use(`${principal}/profile`, profileRoute);
    app.use(`${principal}/note`, notesRoutes);
    app.use(`${principal}/packages`, serviceRoutes);
    app.use(`${principal}/technician`, technicianRoutes);
}

export default configureRoutes;