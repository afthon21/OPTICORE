import Package from '../models/packagesSchema.js';

export const createPackage = async (req, res) => {
    try {
        const { name, price, description } = req.body;
        const newPackage = new Package({ name, price, description });
        await newPackage.save();
        res.status(201).json({ message: 'Paquete creado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el paquete' });
    }
};

export const getAllPackages = async (req, res) => {
    try {
        const packages = await Package.find();
        res.status(200).json(packages);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener paquetes' });
    }
};

export const getPackageByName = async (req, res) => {
    try {
        const { name } = req.params;
        const packageFound = await Package.findOne({ name });
        if (!packageFound) return res.status(404).json({ message: 'Paquete no encontrado' });
        res.status(200).json(packageFound);
    } catch (error) {
        res.status(500).json({ message: 'Error al buscar el paquete' });
    }
};