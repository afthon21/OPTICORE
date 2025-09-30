// controllers/packageController.js
import Package from '../models/packagesSchema.js';

// Crear paquete
export const createPackage = async(req, res) => {
    try {
        const { name, price, description } = req.body;
        const admin = req.adminId; // si estás manejando admins en el token

        const newPackage = new Package({
            name,
            price,
            description,
            Admin: admin || null
        });

        await newPackage.save();
        return res.status(201).json({ message: 'Paquete creado correctamente' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al crear el paquete' });
    }
};

// Obtener todos los paquetes
export const getAllPackages = async(req, res) => {
    try {
        const packages = await Package.find()
            .populate('Admin', 'UserName') // solo si existe relación con Admin
            .exec();

        return res.status(200).json(packages);
    } catch (error) {
        console.error(error);
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