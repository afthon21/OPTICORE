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

        const adminName = `${adminData.Name.FirstName} 
        ${adminData.Name.SecondName || ''} 
        ${adminData.LastName.FatherLastName} 
        ${adminData.LastName.MotherLastName}`
            .replace(/\s+/g, ' ').trim();


        const newPayment = payment({
            CreateDate,
            Client,
            Method,
            Amount,
            Note,
            Admin
        });

        //Creamos el folio
        newPayment.setFolio(newPayment._id, clientName, adminName, newPayment.CreateDate)

        await newPayment.save();
        return res.status(201).json({ message: 'New payment created'});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error creating pay' });
    }
}

//Ver todos los pagos
export const viewAllPayments = async (req, res) => {
    try {
        const allPayments = await payment.find()
            .populate('Client', 'Name LastName')
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
    const { id } = req.params;

    try {
        const exist = await payment.findById(id);
        if (!exist) {
            return res.status(404).json({ message: 'ticket does not exist yet' });
        }
        const idPayment = await payment.findById(id)
            .populate('Client', 'Name LastName')
            .populate('Admin', 'UserName')
            .exec();
        return res.status(200).json(idPayment);
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

        const adminName = `${adminData.Name.FirstName} 
        ${adminData.Name.SecondName || ''} 
        ${adminData.LastName.FatherLastName} 
        ${adminData.LastName.MotherLastName}`
            .replace(/\s+/g, ' ').trim();

        const newPayment = new payment({
            CreateDate,
            Client: clientExist._id,
            Method,
            Amount,
            Note,
            Admin
        });

        //Creamos el folio
        newPayment.setFolio(newPayment._id, clientName, adminName, newPayment.CreateDate)

        await newPayment.save();
        return res.status(201).json({ message: 'New payment created'});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error creating payment' });
    }
}

//Ver todos los pagos de un solo cliente
export const vieWClientPayments = async (req, res) => {
    const id = req.params.id;

    try {
        const exist = await client.findById(id);

        if (!exist) {
            return res.status(404).json({ message: 'Client does not exist yet' });
        } else {
            const payments = await payment.find({ Client: exist._id })
                .populate('Client', 'Name LastName')
                .populate('Admin', 'UserName')
                .exec();

            return res.status(200).json(payments);
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server error!' });
    }
}