import technician from '../models/technicianSchema.js';

// Crear un nuevo técnico
export const newTechnician = async (req, res) => {
    const {
        nombre,
        apellidoP,
        apellidoA,
        // agrega aquí otros campos si tienes
    } = req.body;

    try {
        const newTech = new technician({
            nombre,
            apellidoP,
            apellidoA,
            // otros campos
        });

        await newTech.save();
        return res.status(201).json({ message: 'Technician created' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error registering technician' });
    }
}


export const viewAllTechnicians = async (req, res) => {
    try {
        const allTechnicians = await technician.find();
        return res.status(200).json(allTechnicians);
    } catch (error) {
        console.log('Error finding technicians:', error);
        return res.status(500).json({ message: 'Error finding technicians' });
    }
}

// Ver técnico por ID
export const viewTechnicianById = async (req, res) => {
    const id = req.params.id;

    try {
        const tech = await technician.findById(id);
        if (!tech) {
            return res.status(404).json({ message: 'Technician does not exist' });
        }
        return res.status(200).json(tech);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server error!' });
    }
}

// Editar técnico
export const editTechnician = async (req, res) => {
    const id = req.params.id;

    try {
        const tech = await technician.findById(id);
        if (!tech) {
            return res.status(404).json({ message: 'Technician does not exist' });
        }

        // Actualiza solo los campos enviados en el body
        Object.keys(req.body).forEach(key => {
            tech[key] = req.body[key];
        });

        await tech.save();
        return res.status(200).json({ message: 'Technician updated' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server error!' });
    }
}

// Eliminar técnico
export const deleteTechnician = async (req, res) => {
    const id = req.params.id;

    try {
        const tech = await technician.findById(id);
        if (!tech) {
            return res.status(404).json({ message: 'Technician does not exist' });
        }

        await technician.findByIdAndDelete(id);
        return res.status(200).json({ message: 'Technician deleted' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server error!' });
    }
}