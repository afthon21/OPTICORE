<<<<<<< HEAD

import ticket from '../models/ticketsSchema.js';
import client from "../models/clientSchema.js";
=======
import ticket from '../models/ticketsSchema.js';
import client from "../models/clientSchema.js";

// Obtener solo tickets archivados
export const viewArchivedTickets = async (req, res) => {
    try {
        const archivedTickets = await ticket.find({ Archived: true });
        return res.status(200).json(archivedTickets);
    } catch (error) {
        return res.status(500).json({ message: 'Error finding archived tickets' });
    }
}
>>>>>>> origin/Yanez

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
        return res.status(500).json({ message: 'Error creating ticket' });
    }
}

//View all tickets
export const viewAllTickets = async (req, res) => {
    try {
        const allTickets = await ticket.find()
            .populate('Client', 'Name LastName Location')
            .populate('Admin', 'UserName')
            .populate('tecnico')
            .exec();

        return res.status(200).json(allTickets);
    } catch (error) {
        return res.status(500).json({ message: 'Error finding tickets' });
    }
}
// Obtener solo tickets archivados
export const viewArchivedTickets = async (req, res) => {
    try {
        const archivedTickets = await ticket.find({ Archived: true })
            .populate('Client', 'Name LastName Location')
            .populate('Admin', 'UserName')
            .populate('tecnico')
            .exec();
        return res.status(200).json(archivedTickets);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error finding archived tickets' });
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
        return res.status(500).json({ message: 'Error creating ticket' });
    }
}

//Ver ticket de un solo cliente
export const viewClientTicketS = async (req, res) => {
    const id = req.params.id;

    try {
        // Validar que el ID tenga formato válido de MongoDB ObjectId
        if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: 'Invalid client ID format' });
        }

        const exist = await client.findById(id);

        if (!exist) {
            return res.status(404).json({ message: 'Client does not exist yet' });
        }

        const tickets = await ticket.find({ Client: exist._id })
            .populate('Client', 'Name LastName Location')
            .populate('Admin', 'UserName')
            .populate('tecnico')
            .exec();

        // Retornar array vacío si no hay tickets en lugar de null
        return res.status(200).json(tickets || []);

    } catch (error) {
        return res.status(500).json({ message: 'Server Error' })
    }
}

//Editar ticket
export const editTicket = async (req, res) => {
    const id = req.params.id;

    try {
        const idTicket = await ticket.findById(id);

        if (!idTicket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

<<<<<<< HEAD
        const fields = {
            CreateDate: (value) => { UpdateQuery['CreateDate'] = value },
            Issue: (value) => { UpdateQuery['Issue'] = value },
            Description: (value) => { UpdateQuery['Description'] = value },
            Status: (value) => { UpdateQuery['Status'] = value },
            Priority: (value) => { UpdateQuery['Priority'] = value },
            Archived: (value) => { UpdateQuery['Archived'] = value }
        };

        for (const [key, updateFunction] of Object.entries(fields)) {
            if (req.body[key] !== undefined) {
                await updateFunction(req.body[key]);
=======
        const UpdateQuery = {};

        // Campos permitidos para actualizar
        const allowedFields = ['CreateDate', 'Issue', 'Description', 'Status', 'Priority', 'tecnico'];
        
        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                UpdateQuery[field] = req.body[field];
>>>>>>> origin/Yanez
            }
        }

        if (Object.keys(UpdateQuery).length === 0) {
            return res.status(400).json({ message: 'No fields provided to update' });
        }

        const updatedTicket = await ticket.findByIdAndUpdate(
            id, 
            { $set: UpdateQuery }, 
            { new: true }
        ).populate('Client', 'Name LastName Location')
         .populate('Admin', 'UserName')
         .populate('tecnico');

        if (!updatedTicket) {
            return res.status(400).json({ message: 'Failed to update ticket' });
        }

        return res.status(200).json(updatedTicket);

    } catch (error) {
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
        return res.status(500).json({ message: 'Server Error!' });
    }
}
//Archivar ticket
export const archiveTicket = async (req, res) => {
    const id = req.params.id;
    try {
        const idTicket = await ticket.findById(id);
        if (!idTicket) {
            return res.status(404).json({ message: 'Ticket doesnt exist' });
        }
        idTicket.Archived = true;
        await idTicket.save();
        return res.status(200).json({ message: 'Ticket archived', ticket: idTicket });
    } catch (error) {
        return res.status(500).json({ message: 'Server error!' });

    }
}