import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'fay.mayert@ethereal.email',
        pass: '9kaHEZ7MYgSdQ7rJEF'
    }
});

export default transporter;