import admin from '../models/adminSchema.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import transporter from '../libs/nodemailer.js';

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
        Role
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
            Role
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
        return res.status(200).json({ token, adminId: User._id, userName: User.UserName });


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
        req.User = decode;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ message: 'Token is not valid' });
    }

}

//Extraer datos de usuario logeado
export const getProfile = async (req, res, next) => {
    req.adminId = req.User.id;
    next();
}

//Recuperar contraseña
const resetPassword = async (to, resetToken) => {
    const mailOptions = {
        from: 'fay.mayert@ethereal.email',
        to,
        subject: 'reset password',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Recuperación de contraseña</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        max-width: 600px;
                        margin: 20px auto;
                        background: #ffffff;
                        padding: 20px;
                        border-radius: 10px;
                        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                        text-align: center;
                    }
                    h2 {
                        color: #333;
                    }
                    p {
                        color: #666;
                    }
                    .btn {
                        display: inline-block;
                        background: #007bff;
                        color: #ffffff;
                        padding: 12px 20px;
                        text-decoration: none;
                        border-radius: 5px;
                        font-size: 16px;
                        margin-top: 20px;
                    }
                    .footer {
                        margin-top: 20px;
                        font-size: 12px;
                        color: #888;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h2>Recuperación de Contraseña</h2>
                    <p>Hemos recibido una solicitud para restablecer tu contraseña. Si no hiciste esta solicitud, puedes ignorar este mensaje.</p>
                    <p>Para restablecer tu contraseña, haz clic en el siguiente botón:</p>
                    <p>Código para restablecer contraseña</p>
                    <p>{}</p>
                    <p class="footer">Si tienes problemas con el botón, copia y pega el siguiente enlace en tu navegador:<br> <a href="#">https://example.com/reset-password</a></p>
                    <p class="footer">Si no solicitaste este cambio, puedes ignorar este correo.</p>
                </div>
            </body>
            </html>
        `
    }
}