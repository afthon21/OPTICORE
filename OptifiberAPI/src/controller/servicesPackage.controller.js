import service from '../models/servicesSchema.js';

//Crear servicio
export const newService = async (req, res) => {
    const { Name, Price, Description } = req.body;
    const Admin = req.adminId;

    try {
        const newService = new service({
            Name,
            Price,
            Description,
            Admin
        });

        await newService.save();
        return res.status(201).json({ message: 'New package service created' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server Error!' });
    }
}

//Ver todos los servicios
export const viewAllServices = async (req, res) => {
    try {
        const allServices = await service.find()
            .populate('Admin', 'UserName')
            .exec();

        return res.status(200).json(allServices);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server Error' });
    }
}

//Ver un solo servicio
export const viewOneService = async (req, res) => {
    const id = req.params.id;

    try {
        const idService = await service.findById(id);

        if (!idService) {
            return res.status(404).json({ message: 'Service doesnt exist' });
        }

        const viewPackage = await service.findById(idService)
            .populate('Admin', 'UserName')
            .exec();

        return res.status(200).json(viewPackage);
    } catch (error) {
        return res.status(500).json({ message: 'Server Error!' });
    }
}

//Editar servicio
export const editService = async (req, res) => {
    const id = req.params.id;

    try {
        const idService = await service.findById(id);
        const UpdateQuery = {}

        if (!idService) {
            return res.status(404).json({ message: 'Service doesnt exist' });
        }

        const fields = {
            CreateDate: (value) => { UpdateQuery['CreateDate'] = value },
            Name: (value) => { UpdateQuery['Name'] = value },
            Price: (value) => { UpdateQuery['Price'] = value },
            Description: (value) => { UpdateQuery['Description'] = value },
        }

        for (const [key, updateFunction] of Object.entries(fields)) {
            if (req.body[key]) {
                await updateFunction(req.body[key]);
            }
        }

        await service.findByIdAndUpdate(idService, { $set: UpdateQuery }, { $new: true });
        return res.status(201).json({ message: 'Service updated' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server error!' });
    }
}

//Eliminar servicio
export const deleteService = async (req, res) => {
    const id = req.params.id;

    try {
        const idService = await service.findById(id);

        if (!idService) {
            return res.status(404).json({ message: 'Services doesnt exist' });
        }

        await service.findByIdAndDelete(idService);
        return res.status(200).json({ message: 'Service deletes' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server Error!'});
    }
}