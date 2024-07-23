require('dotenv').config();

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', 
    port: 465, 
    secure: true, 
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: false 
    }
});

const sendResetPasswordEmail = async (email, name, resetLink) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Restablecimiento de contraseña',
        html: `Hola <strong>${name}</strong>,<br><br>` +
              'Recibiste este correo electrónico porque tú (u otra persona) ha solicitado restablecer la contraseña de tu cuenta.<br><br>' +
              'Por favor, haz clic en el siguiente enlace, o pega este en tu navegador para completar el proceso:<br><br>' +
              `<a href="${resetLink}">Restablecer contraseña</a><br><br>` +
              'Si no solicitaste esto, por favor ignora este correo electrónico y tu contraseña permanecerá sin cambios.<br>'
    };

    await transporter.sendMail(mailOptions);
};

module.exports = {
    sendResetPasswordEmail
};