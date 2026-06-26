const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,

    },
});

const sendEmail = async ({ to, subject, html, attachments = [] }) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
            to,
            subject,
            html,
            attachments,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent:', info.response);
        return { success: true, messageId: info.messageId };

    } catch (err) {
        console.error('❌ Email error:', err.message);
        return { success: false, error: err.message };


    }

}
module.exports = sendEmail;