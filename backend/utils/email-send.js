const nodemailer = require("nodemailer");

const sendEmail = async (subject, message, to, from, replyTo) => {
    // Create email transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: 587,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    // Options for sending email
    const options = {
        from,
        to,
        replyTo,
        subject,
        html: message
    };

    // Send the email
    transporter.sendMail(options, (err, info) => {
        if (err) {
            console.log("Email error = ", err);
        } else {
            console.log("Email success = ", info);
        }
    });
};

module.exports = sendEmail;