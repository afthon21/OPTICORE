// controllers/packageController.js
import Package from '../models/packagesSchema.js';

// Crear paquete
export const createPackage = async(req, res) => {
    console.log('=== CREATING PACKAGE ===');
    console.log('Request body:', req.body);
    console.log('Admin ID:', req.adminId);
    
    try {
        const { name, price, description, clientId } = req.body;
        const admin = req.adminId;

        // Validaciones
        if (!name) {
            console.log('ERROR: Missing name');
            return res.status(400).json({ message: 'El nombre del paquete es requerido' });
        }
        
        if (!price) {
            console.log('ERROR: Missing price');
            return res.status(400).json({ message: 'El precio del paquete es requerido' });
        }
        
        if (!clientId) {
            console.log('ERROR: Missing clientId');
            return res.status(400).json({ message: 'Se requiere seleccionar un cliente' });
        }

        // Generar folio único
        const folio = `PKG-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        
        // Extraer información estructurada del nombre del paquete
        const packageSpeed = req.body.packageSpeed || 'No especificado';
        const connectionType = req.body.type || 'No especificado';
        const simpleName = `${packageSpeed} - ${connectionType}`;
        
        console.log('Creating package with data:', { folio, simpleName, packageSpeed, connectionType, price, description, clientId, admin });

        const newPackage = new Package({
            folio,
            name: simpleName,
            type: packageSpeed, // Aquí guardamos la velocidad (100 Megas, etc.)
            connectionType: connectionType, // Aquí guardamos el tipo de conexión
            price,
            description,
            platforms: req.body.platforms || [],
            Client: clientId,
            Admin: admin || null
        });

        console.log('Saving package...');
        const savedPackage = await newPackage.save();
        console.log('Package saved successfully:', savedPackage._id);
        
        console.log('Populating client data...');
        await savedPackage.populate('Client', 'Name LastName Email Location');
        console.log('Package populated:', savedPackage);
        
        return res.status(201).json({ 
            message: 'Paquete creado correctamente',
            package: savedPackage
        });
    } catch (error) {
        console.error('ERROR creating package:', error);
        console.error('Error details:', error.message);
        return res.status(500).json({ 
            message: 'Error al crear el paquete', 
            error: error.message,
            details: error.stack
        });
    }
};

// Obtener todos los paquetes
export const getAllPackages = async(req, res) => {
    console.log('=== GET ALL PACKAGES REQUEST ===');
    console.log('Request from user:', req.adminId);
    
    try {
        console.log('Searching for packages in database...');
        const packages = await Package.find()
            .populate('Client', 'Name LastName Email Location')
            .populate('Admin', 'UserName')
            .exec();

        console.log('Found packages count:', packages.length);
        console.log('Packages data:', packages.map(p => ({
            id: p._id,
            name: p.name,
            client: p.Client ? `${p.Client.Name?.FirstName} ${p.Client.LastName?.FatherLastName}` : 'No client',
            price: p.price
        })));
        
        return res.status(200).json(packages);
    } catch (error) {
        console.error('ERROR getting packages:', error);
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
        const { name, price, description } = req.body;

        const updatedPackage = await Package.findByIdAndUpdate(
            id, { $set: { name, price, description } }, { new: true } // <- aquí lo corregí (antes estaba mal puesto como $new)
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