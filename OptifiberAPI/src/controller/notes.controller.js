import notes from '../models/notesSchema.js';
import client from '../models/clientSchema.js';

//Crear nota
export const newDocument = async (req, res) => {
    const { Description } = req.body;
    const Admin = req.adminId;
    const id = req.params.id; //Id del cliente

    try {
        const clientExist = await client.findById(id);

        if (!clientExist) {
            return res.status(404).json({ message: 'Client does not exist yet' });
        }

        const newNote = new notes({
            Description,
            Client: clientExist._id,
            Admin
        });

        await newNote.save();

        return res.status(201).json({ message: 'New note created' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error creating' });
    }
}

//Ver todas las notas
export const allNotes = async (req, res) => {
    try {
        const allNotes = await notes.find()
            .populate('Client', 'Name LastName')
            .populate('Admin', 'UserName')
            .exec();

        return res.status(200).json(allNotes);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error finding notes' });
    }
}

//Ver ticket por id
export const viewOneNote = async (req, res) => {
    const id = req.params.id;

    try {
        const oneNote = await notes.findById(id)
            .populate('Client', 'Name LastName')
            .populate('Admin', 'UserName')
            .exec();

        if (!oneNote) {
            return res.status(404).json({ message: 'Note does not exist yet' });
        }

        return res.status(200).json(oneNote);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error finding note' });
    }
}

//Ver notas de un solo cliente
export const allClientNotes = async (req, res) => {
    const id = req.params.id;

    try {
        const clientExist = await client.findById(id);

        if (!clientExist) {
            return res.status(404).json({ message: 'Client does not exist yet' });
        }

        const allNotes = await notes.find({ Client: clientExist._id })
            .populate('Client', 'Name LastName')
            .populate('Admin', 'UserName')
            .exec();

        return res.status(200).json(allNotes);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error finding notes' });
    }
}

// Editar notas
export const editNote = async (req, res) => {
    const id = req.params.id;

    try {
        const idNote = await notes.findById(id);
        const UpdateQuery = {};

        if (!idNote) {
            return res.status(404).json({ message: 'Note not found' });
        }

        const fields = {
            CreateDate: (value) => { UpdateQuery['CreateDate'] = value },
            Description: (value) => { UpdateQuery['Description'] = value },
        }

        for (const [key, updateFunction] of Object.entries(fields)) {
            if (req.body[key]) {
                await updateFunction(req.body[key]);
            }
        }

        await notes.findByIdAndUpdate(idNote, { $set: UpdateQuery }, { $new: true });
        return res.status(200).json({ message: 'Note update' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server error!' });
    }
}

//Borrar nota
export const deleteNote = async (req, res) => {
    const id = req.params.id;

    try {
        const idNote = await notes.findById(id);

        if (!idNote) {
            return res.status(404).json({ message: 'Note not found'})
        }

        await notes.findByIdAndDelete(idNote);
        return res.status(200).json({ message: 'Note deleted'});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server Error!'});
    }
}