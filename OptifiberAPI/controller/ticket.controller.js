import ticket from '../models/ticketsSchema.js';
import client from "../models/clientSchema.js";
import admin from '../models/adminSchema.js';

//Create a new Ticket
export const createTicket = async (req, res) => {
    const {
        Issue,
        Description,
        Client
    } = req.body;

    const Admin = req.adminId;

    try {
        const clientData = await client.findById(Client);
        const adminData = await admin.findById(Admin);

        if (!clientData) {
            return res.status(404).json({ message: 'Client does not found' });
        }

        const clientName = `${clientData.Name.FirstName} 
            ${clientData.Name.SecondName || ''} 
            ${clientData.LastName.FatherLastName} 
            ${clientData.LastName.MotherLastName}`
            .replace(/\s+/g, ' ').trim();;

        const adminName = `${adminData.Name.FirstName} 
            ${adminData.Name.SecondName || ''} 
            ${adminData.LastName.FatherLastName} 
            ${adminData.LastName.MotherLastName}`
            .replace(/\s+/g, ' ').trim();;

        const newTicket = ticket({
            Issue,
            Description,
            Client,
            Admin,
        });

        //Creamos el folio
        newTicket.setFolio(newTicket._id, clientName, adminName, newTicket.CreateDate);

        await newTicket.save();

        return res.status(201).json(newTicket);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error creating ticket' });
    }
}

//View all tickets
export const viewAllTickets = async (req, res) => {
    try {
        const allTickets = await ticket.find()
            .populate('Client', 'Name LastName')
            .populate('Admin', 'UserName')
            .exec();
        return res.status(200).json(allTickets);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error finding tickets' });
    }
}

//View by id ticket
export const viewOneTicket = async (req, res) => {
    const { id } = req.params;

    try {
        const exist = await ticket.findById(id);

        if (!exist) {
            return res.status(404).json({ message: 'ticket does not exist yet' });
        } else {
            const oneTicket = await ticket.findById(id)
                .populate('Client', 'Name LastName')
                .populate('Admin', 'UserName')
                .exec();
            return res.status(200).json(oneTicket);
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Ticket not already exist' });
    }
}

//Crear por Id
export const createTicketById = async (req, res) => {
    const {
        Issue,
        Description,
    } = req.body;

    const id = req.params.id;
    const Admin = req.adminId;

    try {
        const clientExist = await client.findById(id);

        if (!clientExist) {
            return res.status(404).json({ message: 'Client does not exist yet' });
        } else {
            const newTicket = new ticket({
                Issue,
                Description,
                Client: clientExist._id,
                Admin
            });

            await newTicket.save();
            return res.status(201).json(newTicket);
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error creating ticket' });
    }
}

//Ver ticket de un solo cliente
export const viewClientTicketS = async (req, res) => {
    const id = req.params.id;

    try {
        const exist = await client.findById(id);

        if (!exist) {
            return res.status(404).json({ message: 'Client does not exist yet' });
        } else {
            const tickets = await ticket.find({ Client: exist._id })
                .populate('Client', 'Name LastName')
                .populate('Admin', 'UserName')
                .exec();
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server Error!' })
    }
}