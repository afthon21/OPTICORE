import ticket from '../models/ticketsSchema.js';
import client from "../models/clientSchema.js";

//Create a new Ticket
export const createTicket = async (req, res) => {
    const {
        Issue,
        Description,
        Client,
        Priority,
        tecnico
    } = req.body;

    const Admin = req.adminId;

    try {
        const clientData = await client.findById(Client);

        if (!clientData) {
            return res.status(404).json({ message: 'Client does not found' });
        }

        const clientName = `${clientData.Name.FirstName} 
            ${clientData.Name.SecondName || ''} 
            ${clientData.LastName.FatherLastName} 
            ${clientData.LastName.MotherLastName}`
            .replace(/\s+/g, ' ').trim();


        const newTicket = ticket({
            Issue,
            Description,
            Priority,
            Client,
            Admin,
            tecnico
        });

        //Creamos el folio
        newTicket.setFolio(newTicket._id, clientName, newTicket.CreateDate);

        await newTicket.save();

        return res.status(201).json({ message: 'New ticket created' });
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
            .populate('tecnico')
            .exec();

        return res.status(200).json(allTickets);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error finding tickets' });
    }
}

//View by id ticket
export const viewOneTicket = async (req, res) => {
    const id = req.params.id;

    try {
        const oneTicket = await ticket.findById(id)
            .populate('Client', 'Name LastName')
            .populate('Admin', 'UserName')
            .exec();

        if (!oneTicket) {
            return res.status(404).json({ message: 'ticket does not exist yet' });
        }

        return res.status(200).json(oneTicket);
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
        Priority,
        tecnico
    } = req.body;

    const Client = req.params.id;
    const Admin = req.adminId;

    try {
        const clientExist = await client.findById(Client);

        if (!clientExist) {
            return res.status(404).json({ message: 'Client does not exist yet' });
        }

        const clientName = `${clientExist.Name.FirstName} 
        ${clientExist.Name.SecondName || ''} 
        ${clientExist.LastName.FatherLastName} 
        ${clientExist.LastName.MotherLastName}`
            .replace(/\s+/g, ' ').trim();

        const newTicket = new ticket({
            Issue,
            Description,
            Priority,
            tecnico,
            Client: clientExist._id,
            Admin
        });

        //Creamos el folio
        newTicket.setFolio(newTicket._id, clientName, newTicket.CreateDate);

        await newTicket.save();
        return res.status(201).json({ message: 'New ticket created' });
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
        }

        const tickets = await ticket.find({ Client: exist._id })
            .populate('Client', 'Name LastName')
            .populate('Admin', 'UserName')
            .exec();

        return res.status(200).json(tickets);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server Error!' })
    }
}

//Editar ticket
export const editTicket = async (req, res) => {
    const id = req.params.id;

    try {
        const idTicket = await ticket.findById(id);
        const UpdateQuery = {};

        if (!idTicket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        const fields = {
            CreateDate: (value) => { UpdateQuery['CreateDate'] = value },
            Issue: (value) => { UpdateQuery['Issue'] = value },
            Description: (value) => { UpdateQuery['Description'] = value },
            Status: (value) => { UpdateQuery['Status'] = value },
            Priority: (value) => { UpdateQuery['Priority'] = value }
        };

        for (const [key, updateFunction] of Object.entries(fields)) {
            if (req.body[key]) {
                await updateFunction(req.body[key]);
            }
        }

        await ticket.findByIdAndUpdate(idTicket, { $set: UpdateQuery }, { $new: true });
        return res.status(200).json({ message: 'Ticket update' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server error!' });
    }
}

//Eliminar ticket
export const deleteTicket = async (req, res) => {
    const id = req.params.id;

    try {
        const idTicket = await ticket.findById(id);

        if (!idTicket) {
            return res.status(404).json({ message: 'Ticket doesnt exist' });
        }

        await ticket.findByIdAndDelete(idTicket);
        return res.status(200).json({ message: 'Ticked deleted' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server Error!' });
    }
}
