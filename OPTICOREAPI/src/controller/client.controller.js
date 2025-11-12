import client from '../models/clientSchema.js';
import document from '../models/documentSchema.js';
import notes from '../models/notesSchema.js';
import payment from '../models/paymentsSchema.js';
import ticket from '../models/ticketsSchema.js';
import packages from '../models/packagesSchema.js';

//Create a new client
export const newClient = async(req, res) => {
    const {
        Name: {
            FirstName,
            SecondName
        },
        LastName: {
            FatherLastName,
            MotherLastName
        },
        PhoneNumber,
        Email,
        Location: {
            State,
            Municipality,
            ZIP,
            Address,
            Cologne,
            Locality,
            OutNumber,
            InNumber,
            Latitude,
            Length
        }
    } = req.body;
    
    try {
        const newClient = client({
            Name: {
                FirstName,
                SecondName
            },
            LastName: {
                FatherLastName,
                MotherLastName
            },
            PhoneNumber,
            Email,
            Location: {
                State,
                Municipality,
                ZIP,
                Address,
                Cologne,
                Locality,
                OutNumber,
                InNumber,
                Latitude,
                Length
            },
            // Status por defecto (el schema ya lo coloca, pero lo dejamos explícito si llega en body)
            Status: req.body.Status ? req.body.Status : undefined
        });


        await newClient.save();
        await logInfo('Gestión de Clientes', 'Crear Cliente', `Cliente creado exitosamente: ${newClient.Name.FirstName} ${newClient.LastName.FatherLastName}`);
        return res.status(201).json({ message: 'Client created' });
    } catch (error) {
        await logError('Gestión de Clientes', 'Crear Cliente', 'Error al registrar nuevo cliente', error);
        console.log(error);
        return res.status(500).json({ message: 'Error registering client' });
    }
}

//View all clients
export const viewAllClient = async(req, res) => {
    try {
        const allClients = await client.find();

        return res.status(200).json(allClients);
    } catch (error) {
        await logError('Gestión de Clientes', 'Consultar Clientes', 'Error al obtener lista de clientes', error);
        console.log(error);
        return res.status(500).json({ message: 'Error finding clients' });
    }
}

//View id Client
export const viewIdClient = async(req, res) => {
    const id = req.params.id;

    try {
        const idClient = await client.findById(id);
        if (!idClient) {
            return res.status(404).json({ message: 'Client does not exist yet' })
        }
        return res.status(200).json(idClient);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server error!' });
    }
}

//Editar el cliente
export const editClient = async(req, res) => {
    const id = req.params.id;

    try {
        const idClient = await client.findById(id);

        if (!idClient) {
            return res.status(404).json({ message: 'Client does not exist yet' });
        }

        const UpdateQuery = {};

        const fields = {
            FirstName: (value) => { UpdateQuery['Name.FirstName'] = value },
            SecondName: (value) => { UpdateQuery['Name.SecondName'] = value },
            FatherLastName: (value) => { UpdateQuery['LastName.FatherLastName'] = value },
            MotherLastName: (value) => { UpdateQuery['LastName.MotherLastName'] = value },
            Email: (value) => { UpdateQuery['Email'] = value },
            State: (value) => { UpdateQuery['Location.State'] = value },
            Municipality: (value) => { UpdateQuery['Location.Municipality'] = value },
            ZIP: (value) => { UpdateQuery['Location.ZIP'] = value },
            Address: (value) => { UpdateQuery['Location.Address'] = value },
            Cologne: (value) => { UpdateQuery['Location.Cologne'] = value },
            Locality: (value) => { UpdateQuery['Location.Locality'] = value },
            OutNumber: (value) => { UpdateQuery['Location.OutNumber'] = value },
            InNumber: (value) => { UpdateQuery['Location.InNumber'] = value },
            Latitude: (value) => { UpdateQuery['Location.Latitude'] = value },
            Length: (value) => { UpdateQuery['Location.Length'] = value },
            PhoneNumber: (value) => { UpdateQuery['PhoneNumber'] = value },
            Status: (value) => { UpdateQuery['Status'] = value }
        }

        for (const [key, updateFunction] of Object.entries(fields)) {
            if (req.body[key] !== undefined) {
                updateFunction(req.body[key]);
            }
        }

        const update = await client.findByIdAndUpdate(id, { $set: UpdateQuery }, { new: true });
        return res.status(200).json(update);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server error!' });
    }
}

//Eliminar cliente
export const deleteClient = async(req, res) => {
    const id = req.params.id;

    try {
        const idClient = await client.findById(id);

        if (!idClient) {
            return res.status(404).json({ message: 'Client doesnt exist' });
        }

        await Promise.all([
            notes.deleteMany({ Client: id }),
            document.deleteMany({ Client: id }),
            payment.deleteMany({ Client: id }),
            ticket.deleteMany({ Client: id }),
            packages.deleteMany({ Client: id })
        ]);

        await client.findByIdAndDelete(id);
        return res.status(200).json({ message: 'Client deleted' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server Error!' });
    }
}
//Archivar cliente
export const archiveClient = async (req, res) => {
    const id = req.params.id;
    try {
        const idClient = await client.findById(id);
        if (!idClient) {
            return res.status(404).json({ message: 'Client does not exist yet' });
        }
        idClient.Archived = true;
        await idClient.save();
        // Archivar en cascada: tickets, pagos, notas, documentos y paquetes
        await Promise.all([
            ticket.updateMany({ Client: id }, { $set: { Archived: true } }),
            payment.updateMany({ Client: id }, { $set: { Archived: true } }),
            notes.updateMany({ Client: id }, { $set: { Archived: true } }),
            document.updateMany({ Client: id }, { $set: { Archived: true } }),
            packages.updateMany({ Client: id }, { $set: { Archived: true } })
        ]);

        return res.status(200).json({ message: 'Client archived', client: idClient });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server error!' });
    }
}

// Desarchivar cliente
export const unarchiveClient = async (req, res) => {
    const id = req.params.id;
    try {
        const idClient = await client.findById(id);
        if (!idClient) {
            return res.status(404).json({ message: 'Client does not exist yet' });
        }
        idClient.Archived = false;
        await idClient.save();
        await Promise.all([
            ticket.updateMany({ Client: id }, { $set: { Archived: false } }),
            payment.updateMany({ Client: id }, { $set: { Archived: false } }),
            notes.updateMany({ Client: id }, { $set: { Archived: false } }),
            document.updateMany({ Client: id }, { $set: { Archived: false } }),
            packages.updateMany({ Client: id }, { $set: { Archived: false } })
        ]);

        return res.status(200).json({ message: 'Client unarchived', client: idClient });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server error!' });
    }
}
