import nodemailer from 'nodemailer';
import dotenv from "dotenv"
dotenv.config();
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // use false for STARTTLS; true for SSL on port 465
    auth: {
        type: "login",
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

export const sendEmail = async ({ to, subject, text, html }) => {
    if (!to || !subject) {
        throw new Error('Email payload is missing required fields.');
    }
    console.log({
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS

    })

    // const from = process.env.SMTP_FROM || process.env.SMTP_USER;

    const data = await transporter.sendMail({
        from: process.env.SMTP_USER,
        to,
        subject,
        text,
        html,
    });
    console.log(data)
};
