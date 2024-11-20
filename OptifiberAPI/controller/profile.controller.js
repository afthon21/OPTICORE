import admin from '../models/adminSchema.js';
import bcrypt from 'bcrypt';

export const viewProfile = async (req,res) => {
    const Admin = req.adminId;

    try {
        const profile = await admin.findById(Admin);
        return res.status(200).json(profile);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server error!' });
    }
}

export const editProfile = async (req,res) => {
    const Admin = req.adminId;
    const { Password } = req.body;

    try {
        const UpdateQuery = { };

        const fields = {// Mapeo de los campos
            Password: async (value) => {
                // Hashear la contraseña
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(Password, salt);
                UpdateQuery.Password = hashedPassword;
            },
            FirstName: (value) => { UpdateQuery['Name.FirstName'] = value; },
            SecondName: (value) => { UpdateQuery['Name.SecondName'] = value; },
            FatherLastName: (value) => { UpdateQuery['LastName.FatherLastName'] = value; },
            MotherLastName: (value) => { UpdateQuery['LastName.MotherLastName'] = value; },
            Email: (value) => { UpdateQuery['Email'] = value;}
        }

        for (const [key, updateFunction] of Object.entries(fields)) {
            if (req.body[key]){
                await updateFunction(req.body[key]);
            }
        }
        
        await admin.findByIdAndUpdate(Admin,{ $set: UpdateQuery},{ new: true});
        return res.status(200).json({ message: 'Profile update' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server error!' });
    }
}
