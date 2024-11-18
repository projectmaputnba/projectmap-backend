import * as nodemailer from 'nodemailer'

export abstract class EmailNotification {
    bodyText: string
    subject: string

    async send(destination: string) {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.NODEMAILER_GOOGLE_APP_USER,
                pass: process.env.NODEMAILER_GOOGLE_APP_PASSWORD,
            },
        })

        await new Promise((resolve, reject) => {
            transporter.sendMail(
                {
                    to: destination,
                    subject: this.subject,
                    html: this.bodyText,
                },
                (err, info) => {
                    if (err) {
                        console.error(err)
                        reject(err)
                    } else {
                        resolve(info)
                    }
                }
            )
        })
    }
}
