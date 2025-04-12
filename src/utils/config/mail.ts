import nodemailer from 'nodemailer';
import dotenv from 'dotenv'

dotenv.config()


export const transporter = nodemailer.createTransport({
    service: 'Gmail',
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
})