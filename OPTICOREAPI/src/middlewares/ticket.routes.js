import { Router } from "express";
import { createTicket, viewAllTickets, viewOneTicket, createTicketById, viewClientTicketS, editTicket, deleteTicket, archiveTicket } from "../controller/ticket.controller.js";
import { protectRoute, getProfile } from "../controller/auth.controller.js";

const ticketRoute = Router();

ticketRoute.post('/new', protectRoute, getProfile, createTicket); // Crear ticket
ticketRoute.get('/all', protectRoute, getProfile, viewAllTickets); //Ver todos los tickets
ticketRoute.get('/view/:id', protectRoute, getProfile, viewOneTicket); // Buscar ticket por id de ticket
ticketRoute.post('/new/:id', protectRoute, getProfile, createTicketById); // Crear ticket por id de cliente
ticketRoute.get('/all/:id', protectRoute, getProfile, viewClientTicketS); // Ver todos los tickets de un solo cliente buscado por id
ticketRoute.post('/edit/:id', protectRoute, getProfile, editTicket); // Editar  ticket
ticketRoute.delete('/delete/:id', protectRoute, getProfile, deleteTicket);
ticketRoute.post('/archive/:id', protectRoute, getProfile, archiveTicket); //Archivar ticket 
export default ticketRoute;