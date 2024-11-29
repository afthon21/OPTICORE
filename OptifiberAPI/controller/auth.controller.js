import admin from '../models/adminSchema.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

//Registrar nuevo Administrador
export const registerUser = async (req,res) => {
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
        Password
    } = req.body;

    try {
        // Comprobar si el usuario ya existe
        const userExist = await admin.findOne({ Email });
        if (userExist) {
            return res.status(400).json({ message: 'Email already exists!' });
        } else {
            // Hashear la contraseña
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(Password, salt);

            //Crear Usuario
            const createUser = new admin ({
                Name: {
                    FirstName,
                    SecondName
                },
                LastName: {
                    FatherLastName,
                    MotherLastName
                },
                Email,
                Password: hashedPassword
            });

            //Creamos el nombre de usuario
            createUser.setUser(FirstName,FatherLastName,MotherLastName);

            //Guarda al Usuario
            await createUser.save();
            return res.status(201).json({ message: 'User registered successfully' }); //Mensaje par comprobar
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error registering user' });    
    }
}

//Iniciar sesión
export const loginUser = async (req,res) => {
    const {
        Email,
        Password
    } = req.body;
    
    try {
        //Buscamos si existe el correo
        const User = await admin.findOne({Email});
        if(!User){
           return res.status(404).json({ message: 'User not found' }); //Mensaje de error
        } else {
            //Comparamos la contraseña
            const isMatch = await bcrypt.compare(Password, User.Password);
            if(!isMatch) { 
                return res.status(400).json( {message: 'Invalid credentials'} ); //Mensaje de error
            } else {
                const token = jwt.sign({ id:User._id }, process.env.JWT_SECRET, {expiresIn: '5h'});
                return res.status(200).json({ token, adminId: User._id, userName: User.UserName });
            }
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error logging' });
    }
}

//Proteger acceso a otras rutas
export const protectRoute = async (req,res,next) => {
    const authHeader = req.header('Authorization');

    if(!authHeader) {
        return res.status(401).json({ message: 'No token authorization' });
    } else {
        const token = authHeader.replace('Bearer ', '');
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            req.User = decode;
            next();
        } catch (error) {
            console.log(error);
            return res.status(401).json({ message: 'Token is not valid' });
        }
    }
}

//Extraer datos de usuario logeado
export const getProfile = async(req,res,next) => {
    req.adminId=req.User.id;
    next();
}