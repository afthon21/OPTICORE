import document from '../models/documentSchema.js';
import client from '../models/clientSchema.js';

//Crear nuevo documento
export const createDocument = async (req, res) => {
    const { Description } = req.body;
    const Admin = req.adminId;
    const id = req.params.id; //Id del cliente

    try {
        const clientExist = await client.findById(id);

        if (!clientExist) {
            return res.status(500).json({ message: 'Client does not exist yet' });
        }

        const newDocument = new document({
            Description,
            Client: clientExist._id,
            Admin
        });

        if (req.file) {
            const { filename } = req.file;
            newDocument.setImgUrl(filename);
        }

        await newDocument.save();
        return res.status(201).json({ message: 'Upload successfully' });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error creating document' });
    }
}

//Ver documentos
export const viewDocuments = async (req, res) => {
    const id = req.params.id;

    try {
        const exist = await client.findById(id);

        if (!exist) {
            return res.status(404).json({ message: 'Client does not exist yet' });
        }
        const documents = await document.find({ Client: exist._id })
            .populate('Client', 'Name LastName')
            .populate('Admin', 'UserName')
            .exec();

        return res.status(200).json(documents);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server error!' });

    }
}

//Eliminar documento 
export const deleteDocument = async (req, res) => {
    const id = req.params.id;

    try {
        const idDocument = await document.findById(id);

        if (!idDocument) {
            return res.status(404).json({ message: 'Document doesnt exist' });
        }

        await document.findByIdAndDelete(idDocument);
        return res.status(200).json({ message: 'Document deleted' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server Error!' });
    }
}