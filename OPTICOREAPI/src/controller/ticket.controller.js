import Ticket from '../models/ticketsSchema.js';
import Client from '../models/clientSchema.js';

// Obtener solo tickets archivados
export const viewArchivedTickets = async (req, res) => {
    try {
        const archivedTickets = await Ticket.find({ Archived: true })
            .populate('Client', 'Name LastName Location')
            .populate('Admin', 'UserName')
            .populate('tecnico')
            .exec();

        return res.status(200).json(archivedTickets);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error finding archived tickets' });
    }
};

//Create a new Ticket
export const createTicket = async (req, res) => {
    const { Issue, Description, Client: ClientId, Priority, tecnico } = req.body;
    const Admin = req.adminId;

    try {
        const clientData = await Client.findById(ClientId);
        if (!clientData) return res.status(404).json({ message: 'Client not found' });

        const clientName = `${clientData.Name.FirstName} ${clientData.Name.SecondName || ''} ${clientData.LastName.FatherLastName} ${clientData.LastName.MotherLastName}`
            .replace(/\s+/g, ' ')
            .trim();

        const newTicket = new Ticket({
            Issue,
            Description,
            Priority,
            Client: ClientId,
            Admin,
            tecnico,
        });

        //Creamos el folio
        newTicket.setFolio(newTicket._id, clientName, newTicket.CreateDate);

        await newTicket.save();

        return res.status(201).json({ message: 'New ticket created', ticket: newTicket });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error creating ticket' });
    }
};

//View all tickets
export const viewAllTickets = async (req, res) => {
    try {
        const allTickets = await Ticket.find()
            .populate('Client', 'Name LastName Location')
            .populate('Admin', 'UserName')
            .populate('tecnico')
            .exec();

        return res.status(200).json(allTickets);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error finding tickets' });
    }
};

//View by id ticket
export const viewOneTicket = async (req, res) => {
    const id = req.params.id;

    try {
        const oneTicket = await Ticket.findById(id)
            .populate('Client', 'Name LastName')
            .populate('Admin', 'UserName')
            .exec();

        if (!oneTicket) return res.status(404).json({ message: 'Ticket does not exist' });
        return res.status(200).json(oneTicket);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

//Crear por Id
export const createTicketById = async (req, res) => {
    const { Issue, Description, Priority, tecnico } = req.body;
    const ClientId = req.params.id;
    const Admin = req.adminId;

    try {
        const clientExist = await Client.findById(ClientId);
        if (!clientExist) return res.status(404).json({ message: 'Client does not exist' });

        const clientName = `${clientExist.Name.FirstName} ${clientExist.Name.SecondName || ''} ${clientExist.LastName.FatherLastName} ${clientExist.LastName.MotherLastName}`
            .replace(/\s+/g, ' ')
            .trim();

        const newTicket = new Ticket({
            Issue,
            Description,
            Priority,
            tecnico,
            Client: clientExist._id,
            Admin,
        });

        //Creamos el folio
        newTicket.setFolio(newTicket._id, clientName, newTicket.CreateDate);

        await newTicket.save();

        return res.status(201).json({ message: 'New ticket created', ticket: newTicket });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error creating ticket' });
    }
};

//Ver ticket de un solo cliente
export const viewClientTicketS = async (req, res) => {
    const id = req.params.id;
    try {
        if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).json({ message: 'Invalid client ID format' });

        const exist = await Client.findById(id);
        if (!exist) return res.status(404).json({ message: 'Client does not exist' });

        const tickets = await Ticket.find({ Client: exist._id })
            .populate('Client', 'Name LastName Location')
            .populate('Admin', 'UserName')
            .populate('tecnico')
            .exec();

        // Retornar array vacío si no hay tickets en lugar de null
        return res.status(200).json(tickets || []);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server Error' });
    }
};

//Editar ticket
export const editTicket = async (req, res) => {
    const id = req.params.id;

    try {
        const idTicket = await Ticket.findById(id);
        if (!idTicket) return res.status(404).json({ message: 'Ticket not found' });

        const UpdateQuery = {};
        const allowedFields = ['CreateDate', 'Issue', 'Description', 'Status', 'Priority', 'tecnico', 'Archived'];
        for (const field of allowedFields) {
            if (req.body[field] !== undefined) UpdateQuery[field] = req.body[field];
        }

        if (Object.keys(UpdateQuery).length === 0) return res.status(400).json({ message: 'No fields provided to update' });

        const updatedTicket = await Ticket.findByIdAndUpdate(id, { $set: UpdateQuery }, { new: true })
            .populate('Client', 'Name LastName Location')
            .populate('Admin', 'UserName')
            .populate('tecnico');

        if (!updatedTicket) return res.status(400).json({ message: 'Failed to update ticket' });
        return res.status(200).json(updatedTicket);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error!' });
    }
};

//Eliminar ticket
export const deleteTicket = async (req, res) => {
    const id = req.params.id;

    try {
        const idTicket = await Ticket.findById(id);
        if (!idTicket) return res.status(404).json({ message: 'Ticket doesnt exist' });

        await Ticket.findByIdAndDelete(id);
        return res.status(200).json({ message: 'Ticket deleted' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server Error!' });
    }
};

//Archivar ticket
export const archiveTicket = async (req, res) => {
    const id = req.params.id;
    try {
        const idTicket = await Ticket.findById(id);
        if (!idTicket) return res.status(404).json({ message: 'Ticket doesnt exist' });

        idTicket.Archived = true;
        await idTicket.save();
        return res.status(200).json({ message: 'Ticket archived', ticket: idTicket });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error!' });

    }
};