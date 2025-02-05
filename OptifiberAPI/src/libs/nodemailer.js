import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Obtener mas direcciones de pruebas en 
 * @ https://ethereal.email/ 
 * @ https://temp-mail.org/es/
 * 
 * configuración de pruebas
 */

//const transporter = nodemailer.createTransport({
//host: 'smtp.ethereal.email',
//port: 587,
//auth: {
//user: 'demond75@ethereal.email',
//pass: 'tm4YGsHJztEWcE6HVb'
//}
//});

/**
 * Configuración para enviar correos usando un servicio existente como gmail, outlook, etc.
 */

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.RECOVERY_EMAIL,
        pass: process.env.APPLICATION_PASSWORD
    }
});

/**
 * Configuración de destinatario y cuerpo de correo
 */
export const mailOptions = (Email, code) => {
    const templatePath = path.join(__dirname, "..", "templates", "emailRecovery.html");
    let htmlTemplate = fs.readFileSync(templatePath, "utf8");
    htmlTemplate = htmlTemplate.replace("{{ code }}", code);

    return {
        from: process.env.RECOVERY_EMAIL,
        to: Email,
        subject: 'Reset your password',
        html: htmlTemplate
    }
}