import admin from '../models/adminSchema.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import resetCode from '../models/resetCodeSchema.js';
import { transporter, mailOptions } from '../libs/nodemailer.js'

//Registrar nuevo Administrador
export const registerUser = async (req, res) => {
    const {
        Name: {
            FirstName,
            SecondName
        },
        LastName: {
            FatherLastName,
            MotherLastName
        },
        Email,
        Password,
        Role,
        Region
    } = req.body;

    try {
        // Comprobar si el usuario ya existe
        const userExist = await admin.findOne({ Email });
        if (userExist) {
            return res.status(400).json({ message: 'Email already exists!' });
        }
        // Hashear la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(Password, salt);

        //Crear Usuario
        const createUser = new admin({
            Name: {
                FirstName,
                SecondName
            },
            LastName: {
                FatherLastName,
                MotherLastName
            },
            Email,
            Password: hashedPassword,
            Role,
            Region: Region || 'Estado de México' // Valor por defecto si no se proporciona
        });

        //Creamos el nombre de usuario
        createUser.setUser(FirstName, FatherLastName, MotherLastName);

        //Guarda al Usuario
        await createUser.save();
        return res.status(201).json({ message: 'User registered successfully' }); //Mensaje par comprobar

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error registering user' });
    }
}

//Iniciar sesión
export const loginUser = async (req, res) => {
    const {
        Email,
        Password
    } = req.body;

    try {
        //Buscamos si existe el correo
        const User = await admin.findOne({ Email });
        if (!User) {
            return res.status(404).json({ message: 'User not found' }); //Mensaje de error
        }

        //Comparamos la contraseña
        const isMatch = await bcrypt.compare(Password, User.Password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password' }); //Mensaje de error
        }

        const token = jwt.sign({ id: User._id }, process.env.JWT_SECRET);
        return res.status(200).json({ 
            token, 
            adminId: User._id, 
            userName: User.UserName,
            region: User.Region,
            role: User.Role
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error login' });
    }
}

//Proteger acceso a otras rutas
export const protectRoute = async (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return res.status(401).json({ message: 'No token authorization' });
    }

    const token = authHeader.replace('Bearer ', '');
    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decode;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ message: 'Token is not valid' });
    }

}

//Extraer datos de usuario logeado
export const getProfile = async (req, res, next) => {
    req.adminId = req.user.id;
    next();
}

/**
 * Recuperar contraseña
 * @param {Email} req 
 * @param {json, status, send} res 
 * @returns *Messages
 */
export const sendMailRecovery = async (req, res) => {
    const { Email } = req.body;
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expireAt = new Date(Date.now() + 15 * 60 * 1000);

    try {
        /**
         * Almacenar código
         */
        const user = await admin.findOne({ Email });

        if (!user) {
            return res.status(404).json({ message: 'Email doesnt exist' })
        }

        await resetCode.findOneAndUpdate(
            { User: user._id },
            { Email, Code: code, ExpireAt: expireAt },
            { upsert: true, new: true }
        )

        /**
         * Enviar coligo por correo
         */
        const createMail = mailOptions(Email, code);

        await transporter.sendMail(createMail);

        return res.status(201).json({ message: 'Code sent successfully' })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server Error!' });
    }
}

export const verifyRecoveryCode = async (req, res) => {
    const { Email, Code } = req.body;

    try {
        const exist = await resetCode.findOne({ Email });

        if (!exist || exist.Code !== Code) {
            return res.status(400).json({ message: 'Invalid Code' });
        }

        if (new Date() > exist.ExpireAt) {
            return res.status(400).json({ message: 'Expired code' });
        }

        return res.status(204).send();
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server error!' });
    }
}

export const resetPassword = async (req, res) => {
    const { Email, Code, newPassword } = req.body;

    try {
        const exist = await resetCode.findOne({ Email });

        if (!exist || exist.Code !== Code) {
            return res.status(400).json({ message: 'Code invalid' });
        }

        if (new Date() > exist.ExpireAt) {
            return res.json(400).json({ message: 'Expired Code' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await admin.findOneAndUpdate({ Email }, { Password: hashedPassword });

        await resetCode.deleteOne({ Email });

        return res.status(201).json({ message: 'Password changed'});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server error!' });
    }
}