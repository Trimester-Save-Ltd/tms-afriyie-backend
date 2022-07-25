import nodemailer from 'nodemailer';
import nodemailMailgun from 'nodemailer-mailgun-transport';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import password_reset_email_template from '../templates/email/forgotpassword';
import user_registration_email_template from '../templates/email/registration';


/**
* @description - Email service to send email Notification to user, will contain all the email related methods
*/
class MailService {
    mailgunAuth = {
        auth: {
            api_key: process.env.MAILGUN_API_KEY as string,
            domain: process.env.MAILGUN_DOMAIN as string
        }
    }

    transporter = nodemailer.createTransport(nodemailMailgun(this.mailgunAuth));

    constructor() { }

    public async sendpasswordresetemail(resetlink: string, name: string, to: string): Promise<SMTPTransport.SentMessageInfo> {
        try {
            const mailOptions = {
                from: `TMS-CMS <${process.env.EMAIL}>`,
                to: to,
                subject: 'Password Reset',
                html: await password_reset_email_template(resetlink, name)
            }
            return await this.transporter.sendMail(mailOptions);
        }
        catch (err) {
            throw new Error((err as Error).message);
        }
    }

    public async senduserregistrationemail(to: string, link: string, username: string): Promise<SMTPTransport.SentMessageInfo> {
        try {
            const mailOptions = {
                from: `TMS-CMS <${process.env.EMAIL}>`,
                to: to,
                subject: 'Congratulations! You have successfully registered with TMS-CMS',
                html: await user_registration_email_template(link, username)
            }
            return await this.transporter.sendMail(mailOptions);
        }
        catch (error) {
            throw new Error((error as Error).message);
        }
    }
}


export default MailService;
