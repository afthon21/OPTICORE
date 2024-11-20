import { Router } from "express";
import { createTicket,viewAllTickets,viewOneTicket,createTicketById,viewClientTicketS } from "../controller/ticket.controller.js";
import { protectRoute,getProfile } from "../controller/auth.controller.js";

const ticketRoute = Router();

ticketRoute.post('/new',protectRoute,getProfile,createTicket);
ticketRoute.get('/all',protectRoute,getProfile,viewAllTickets);
ticketRoute.get('/view/:id',protectRoute,getProfile,viewOneTicket);
ticketRoute.post('/new/:id',protectRoute,getProfile,createTicketById);
ticketRoute.get('/all/:id',protectRoute,getProfile,viewAllTickets);

export default ticketRoute;