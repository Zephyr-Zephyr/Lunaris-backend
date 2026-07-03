import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM || 'noreply@lunaris.de',
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      });
      console.log(`Email sent to ${options.to}`);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  async sendWelcomeEmail(email: string, name: string): Promise<boolean> {
    const html = `
      <h2>Willkommen bei Lunaris!</h2>
      <p>Hallo ${name},</p>
      <p>Vielen Dank für deine Registrierung. Dein Account wurde erfolgreich erstellt.</p>
      <p>Du kannst dich jetzt anmelden und auf dein Dashboard zugreifen.</p>
      <br/>
      <p>Viele Grüße,<br/>Das Lunaris Team</p>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Willkommen bei Lunaris!',
      html,
    });
  }

  async sendPasswordResetEmail(email: string, resetLink: string): Promise<boolean> {
    const html = `
      <h2>Passwort zurücksetzen</h2>
      <p>Du hast eine Anfrage zum Zurücksetzen deines Passworts gestellt.</p>
      <p><a href="${resetLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Passwort zurücksetzen</a></p>
      <p>Dieser Link ist 1 Stunde lang gültig.</p>
      <p>Falls du diese Anfrage nicht gestellt hast, ignoriere diese E-Mail.</p>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Passwort zurücksetzen - Lunaris',
      html,
    });
  }
}

export default new EmailService();
