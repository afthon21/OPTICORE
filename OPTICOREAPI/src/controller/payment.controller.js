// Ver pagos archivados
export const viewArchivedPayments = async (req, res) => {
    try {
        const archivedPayments = await payment.find({ Archived: true })
            .populate('Client', 'Name LastName Location')
            .populate('Admin', 'UserName')
            .exec();
        return res.status(200).json(archivedPayments);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error finding archived payments' });
    }
}
import payment from "../models/paymentsSchema.js";
import client from "../models/clientSchema.js";
import admin from '../models/adminSchema.js';

// Crear nuevo pago
export const createPayment = async (req, res) => {
    const {
        CreateDate,
        Client,
        Method,
        Amount,
        Abono,
        Note
    } = req.body;

    const Admin = req.adminId;

    try {
        const clientData = await client.findById(Client);
        const adminData = await admin.findById(Admin);

        if (!clientData || !adminData) {
            return res.status(404).json({ message: 'Client or Admin not found' });
        }

        const clientName = `${clientData.Name.FirstName} 
        ${clientData.Name.SecondName || ''} 
        ${clientData.LastName.FatherLastName} 
        ${clientData.LastName.MotherLastName}`
            .replace(/\s+/g, ' ').trim();

        const newPayment = payment({
            CreateDate,
            Client,
            Method,
            Amount,
            Abono,
            Note,
            Admin
        });

        //Creamos el folio
        newPayment.setFolio(newPayment._id, clientName, newPayment.CreateDate)

        await newPayment.save();
        // Populate related fields before returning so frontend can update UI immediately
        const populated = await payment.findById(newPayment._id)
            .populate('Client', 'Name LastName Location')
            .populate('Admin', 'UserName')
            .exec();
        return res.status(201).json(populated);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error creating pay' });
    }
}

//Ver todos los pagos
export const viewAllPayments = async (req, res) => {
    try {
        const allPayments = await payment.find()
            .populate('Client', 'Name LastName Location')
            .populate('Admin', 'UserName')
            .exec();
        return res.status(200).json(allPayments);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error finding payments' });
    }
}

//Ver un pago
export const viewOnePayment = async (req, res) => {
    const id = req.params.id;

    try {
        const idPayment = await payment.findById(id);

        if (!idPayment) {
            return res.status(404).json({ message: 'ticket does not exist' });
        }

        const viewPayment = await payment.findById(id)
            .populate('Client', 'Name LastName Location')
            .populate('Admin', 'UserName')
            .exec();

        return res.status(200).json(viewPayment);
    } catch (error) {
        return res.status(500).json({ message: 'Payment not already exist' });
    }
}

// Crear por Id
export const createPaymentById = async (req, res) => {
    const {
        CreateDate,
        Method,
        Amount,
        Abono,
        Note
    } = req.body;

    const Client = req.params.id; //Id del cliente
    const Admin = req.adminId;

    try {
        const clientExist = await client.findById(Client);
        const adminData = await admin.findById(Admin);

        if (!clientExist) {
            return res.status(404).json({ message: 'Client does not exist yet' });
        }

        const clientName = `${clientExist.Name.FirstName} 
        ${clientExist.Name.SecondName || ''} 
        ${clientExist.LastName.FatherLastName} 
        ${clientExist.LastName.MotherLastName}`
            .replace(/\s+/g, ' ').trim();

        const newPayment = new payment({
            CreateDate,
            Client: clientExist._id,
            Method,
            Amount,
            Abono,
            Note,
            Admin
        });

        //Creamos el folio
        newPayment.setFolio(newPayment._id, clientName, newPayment.CreateDate)

        await newPayment.save();
        const populated = await payment.findById(newPayment._id)
            .populate('Client', 'Name LastName Location')
            .populate('Admin', 'UserName')
            .exec();
        return res.status(201).json(populated);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error creating payment' });
    }
}

//Ver todos los pagos de un solo cliente
export const vieWClientPayments = async (req, res) => {
    const id = req.params.id;

    try {
        const idClient = await client.findById(id);

        if (!idClient) {
            return res.status(404).json({ message: 'Client does not exist yet' });
        }

        // Si se envía ?archived=true, devolver solo pagos archivados
        const archivedQuery = req.query.archived === 'true';
        const query = archivedQuery ? { Client: idClient._id, Archived: true } : { Client: idClient._id, Archived: { $ne: true } };

        // Buscar pagos por el _id del cliente (usar el ObjectId, no el documento completo)
        const payments = await payment.find(query)
            .populate('Client', 'Name LastName Location')
            .populate('Admin', 'UserName')
            .exec();

        return res.status(200).json(payments);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server error!' });
    }
}

//Editar pagos
export const editPayment = async (req, res) => {
    const id = req.params.id;

    try {
        const idPayment = await payment.findById(id);
        const UpdateQuery = {}

        if (!idPayment) {
            return res.status(404).json({ message: 'Payment doesnt exist' });
        }

        const fields = {
            CreateDate: (value) => { UpdateQuery['CreateDate'] = value },
            Method: (value) => { UpdateQuery['Method'] = value },
            Amount: (value) => { UpdateQuery['Amount'] = value },
            Abono: (value) => {UpdateQuery['Abono'] = value },
            Note: (value) => { UpdateQuery['Note'] = value },
            Status: (value) => { UpdateQuery['Status']=value}
        };

        for (const [key, updateFunction] of Object.entries(fields)) {
            if (req.body[key]) {
                await updateFunction(req.body[key]);
            }
        }

        await payment.findByIdAndUpdate(idPayment, { $set: UpdateQuery }, { $new: true });
        return res.status(200).json({ message: 'Payment update' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server Error!' });
    }
}

//Eliminar pago
export const deletePayment = async (req, res) => {
    const id = req.params.id;

    try {
        const idPayment = await payment.findById(id);

        if (!idPayment) {
            return res.status(404).json({ message: 'Payment doesnt exist' });
        }

        await payment.findByIdAndDelete(idPayment);
        return res.status(200).json({ message: 'Payment deleted' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server Error!' });
    }
}

//Archivar pagos
export const archivePayments = async (req, res) => {
    const id=req.params.id;
    try {
        const idPayment=await payment.findById(id);
           if (!idPayment) {
            return res.status(404).json({ message: 'Payment does not exist' });
        }

        idPayment.Archived = true;
        idPayment.ArchivedAt = new Date();
        await idPayment.save();

        return res.status(200).json({ message: 'Payment archived successfully' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error archiving payment' });
    }
}

//Desarchivar pagos
export const unarchivePayments = async (req, res) => {
    const id = req.params.id;
    try {
        const idPayment = await payment.findById(id);
        if (!idPayment) {
            return res.status(404).json({ message: 'Payment does not exist' });
        }

        idPayment.Archived = false;
        idPayment.ArchivedAt = null;
        await idPayment.save();

        return res.status(200).json({ message: 'Payment unarchived successfully' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error unarchiving payment' });
    }
}