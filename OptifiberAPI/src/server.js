import express from 'express';
import './db_conn.js';
import dotenv from 'dotenv';
import configureRoutes from '../routes/routes.js'
import cors from 'cors';
import corsOptions from '../libs/cors.js';

//Config
const app = express();
app.use(express.json());
app.use(cors(corsOptions));

//rutas
configureRoutes(app)

//Server
dotenv.config();

app.listen(process.env.PORT, () => {
    console.log('App Runnig');
    console.log(`${process.env.HOST}:${process.env.PORT}/api`);
});
