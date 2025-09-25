import client from '../models/clientSchema.js';
import document from '../models/documentSchema.js';
import notes from '../models/notesSchema.js';
import payment from '../models/paymentsSchema.js';
import ticket from '../models/ticketsSchema.js';

//Create a new client
export const newClient = async (req, res) => {
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
            }
        });


        await newClient.save();
        return res.status(201).json({ message: 'Client created' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error registering client' });
    }
}

//View all clients
export const viewAllClient = async (req, res) => {
    try {
        const allClients = await client.find();
        return res.status(200).json(allClients);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error finding clients' });
    }
}

//View id Client
export const viewIdClient = async (req, res) => {
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
export const editClient = async (req, res) => {
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
            PhoneNumber: (value) => { UpdateQuery['PhoneNumber'] = value }
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
export const deleteClient = async (req, res) => {
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
            ticket.deleteMany({ Client: id })
        ]);

        await client.findByIdAndDelete(id);
        return res.status(200).json({ message: 'Client deleted' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server Erro!' });
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
        return res.status(200).json({ message: 'Client archived', client: idClient });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server error!' });
    }
}
