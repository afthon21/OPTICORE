// controllers/packageController.js
import Package from '../models/packagesSchema.js';
import Client from '../models/clientSchema.js';

// Crear paquete
export const createPackage = async(req, res) => {

    try {
        const { name, price, description, clientId } = req.body;
        const admin = req.adminId;

        // Validaciones
        if (!name) {
            return res.status(400).json({ message: 'El nombre del paquete es requerido' });
        }
        
        if (!price) {
            return res.status(400).json({ message: 'El precio del paquete es requerido' });
        }
        
        if (!clientId) {
            return res.status(400).json({ message: 'Se requiere seleccionar un cliente' });
        }

        // Verificar que el cliente existe
        const clientExists = await Client.findById(clientId);
        if (!clientExists) {
            return res.status(404).json({ message: 'El cliente seleccionado no existe' });
        }

        // Generar folio único
        const folio = `PKG-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        
        // Extraer información estructurada del nombre del paquete
        const packageSpeed = req.body.packageSpeed || 'No especificado';
        const connectionType = req.body.type || 'No especificado';
        const fullName = name; // Usar el nombre completo que incluye timestamp y plataformas
        

        const newPackage = new Package({
            folio,
            name: fullName, // Usar el nombre completo para evitar duplicados
            type: packageSpeed, // Aquí guardamos la velocidad (100 Megas, etc.)
            connectionType: connectionType, // Aquí guardamos el tipo de conexión
            price,
            description,
            platforms: req.body.platforms || [],
            Client: clientId,
            Admin: admin || null
        });

        const savedPackage = await newPackage.save();
        
        await savedPackage.populate('Client', 'Name LastName Email Location');
        
        return res.status(201).json({ 
            message: 'Paquete creado correctamente',
            package: savedPackage
        });
    } catch (error) {
        return res.status(500).json({ 
            message: 'Error al crear el paquete', 
            error: error.message
        });
    }
};

// Obtener todos los paquetes
export const getAllPackages = async(req, res) => {
    try {
        const packages = await Package.find()
            .populate('Client', 'Name LastName Email Location')
            .populate('Admin', 'UserName')
            .exec();

        
        
        return res.status(200).json(packages);
    } catch (error) {
        return res.status(500).json({ message: 'Error al obtener los paquetes' });
    }
};

// Obtener paquete por ID
export const getPackageById = async(req, res) => {
    try {
        const { id } = req.params;
        const packageFound = await Package.findById(id)
            .populate('Admin', 'UserName')
            .exec();

        if (!packageFound) {
            return res.status(404).json({ message: 'Paquete no encontrado' });
        }

        return res.status(200).json(packageFound);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al buscar el paquete' });
    }
};

// Obtener paquete por nombre
export const getPackageByName = async(req, res) => {
    try {
        const { name } = req.params;
        const packageFound = await Package.findOne({ name });

        if (!packageFound) {
            return res.status(404).json({ message: 'Paquete no encontrado' });
        }

        return res.status(200).json(packageFound);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al buscar el paquete' });
    }
};

// Editar paquete
export const updatePackage = async(req, res) => {
    try {
        const { id } = req.params;
        const { type, connectionType, platforms, price, description } = req.body;

        const updatedPackage = await Package.findByIdAndUpdate(
            id,
            { $set: { type, connectionType, platforms, price, description } },
            { new: true }
        );

        if (!updatedPackage) {
            return res.status(404).json({ message: 'Paquete no encontrado' });
        }

        return res.status(200).json({ message: 'Paquete actualizado', updatedPackage });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al actualizar el paquete' });
    }
};

// Eliminar paquete
export const deletePackage = async(req, res) => {
    try {
        const { id } = req.params;

        const deletedPackage = await Package.findByIdAndDelete(id);

        if (!deletedPackage) {
            return res.status(404).json({ message: 'Paquete no encontrado' });
        }

        return res.status(200).json({ message: 'Paquete eliminado correctamente' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al eliminar el paquete' });
    }
};

// Obtener paquetes por cliente
export const getPackagesByClient = async(req, res) => {
    try {
        const { clientId } = req.params;
        
        // Verificar que el cliente existe
        const clientExists = await Client.findById(clientId);
        if (!clientExists) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }

        const packages = await Package.find({ Client: clientId })
            .populate('Admin', 'UserName')
            .exec();

        return res.status(200).json(packages);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al obtener los paquetes del cliente' });
    }
};