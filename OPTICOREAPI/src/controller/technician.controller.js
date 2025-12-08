import technician from '../models/technicianSchema.js';
import tickets from '../models/ticketsSchema.js';

// Crear un nuevo técnico
export const newTechnician = async(req, res) => {
    const {
        nombre,
        apellidoP,
        apellidoA,
        activo, // <-- Nuevo campo
        telefono,
        mercado,
        zona,
        email
    } = req.body;

    try {
        const newTech = new technician({
            nombre,
            apellidoP,
            apellidoA,
            activo, // <-- Nuevo campo
            telefono: telefono || '',
            mercado: mercado || '',
            zona: zona || '',
            email: email || ''
        });

        await newTech.save();
        return res.status(201).json({ message: 'Technician created' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error registering technician' });
    }
}


export const viewAllTechnicians = async(req, res) => {
    try {
        const allTechnicians = await technician.find();
        return res.status(200).json(allTechnicians);
    } catch (error) {
        return res.status(500).json({ message: 'Error finding technicians' });
    }
}

// Ver técnico por ID
export const viewTechnicianById = async(req, res) => {
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

// Editar técnico con actualización en cascada de tickets
export const editTechnician = async(req, res) => {
    const id = req.params.id;

    try {
        const tech = await technician.findById(id);
        if (!tech) {
            return res.status(404).json({ message: 'Technician does not exist' });
        }

        // Guardar el nombre completo ANTERIOR del técnico (antes de actualizar)
        const oldFullName = `${tech.nombre} ${tech.apellidoP} ${tech.apellidoA}`.trim();
        
        // Actualiza solo los campos enviados en el body
        Object.keys(req.body).forEach(key => {
            tech[key] = req.body[key];
        });

        await tech.save();
        
        // Calcular el nombre completo NUEVO del técnico (después de actualizar)
        const newFullName = `${tech.nombre} ${tech.apellidoP} ${tech.apellidoA}`.trim();
        
        // Si cambió el nombre, actualizar todos los tickets asociados en cascada
        if (oldFullName !== newFullName) {
            // Actualizar todos los tickets usando updateMany con regex case-insensitive
            const result = await tickets.updateMany(
                { 
                    tecnico: new RegExp(`^${oldFullName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i')
                },
                { 
                    $set: { tecnico: newFullName } 
                }
            );
            
            const updatedCount = result.modifiedCount || 0;
            
            return res.status(200).json({ 
                message: 'Technician updated', 
                ticketsUpdated: updatedCount,
                oldName: oldFullName,
                newName: newFullName
            });
        }
        
        return res.status(200).json({ message: 'Technician updated', ticketsUpdated: 0 });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server error!' });
    }
}

// Eliminar técnico
export const deleteTechnician = async(req, res) => {
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

export const viewActiveTechnicians = async(req, res) => {
    try {
        const activeTechnicians = await technician.find({ activo: true });
        return res.status(200).json(activeTechnicians);
    } catch (error) {
        console.log('Error finding technicians:', error);
        return res.status(500).json({ message: 'Error finding technicians' });
    }
}

export const viewInactiveTechnicians = async(req, res) => {
    try {
        const inactiveTechnicians = await technician.find({ activo: false });
        return res.status(200).json(inactiveTechnicians);
    } catch (error) {
        console.log('Error finding technicians:', error);
        return res.status(500).json({ message: 'Error finding technicians' });
    }
}

export const archiveTechnician = async(req, res) => {
    const id = req.params.id;
    try {
        const idTechnicians = await technician.findById(id);
        if (!idTechnicians) {
            return res.status(404).json({ message: 'Technician does not exist yet' });
        }
        idTechnicians.Archived = true;
        await idTechnicians.save();
        return res.status(200).json({ message: 'Technician archived successfully' });
    } catch (error) { 
        console.log(error);
        return res.status(500).json({ message: 'Server error!' });
        
    }
}