import nodemailer from 'nodemailer';

import { CERTIFICATE_EMAIL_TEMPLATE } from '../const';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '465', 10),
  secure: parseInt(process.env.SMTP_PORT || '465', 10) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendCertificateEmail = async (to: string, pdfBuffer: Buffer): Promise<void> => {
  const mailOptions = {
    from: `"GoSailingFun" <${process.env.SMTP_USER}>`,
    to,
    subject: 'Ваш подарочный сертификат на прогулку на яхте',
    html: CERTIFICATE_EMAIL_TEMPLATE,
    attachments: [
      {
        filename: 'certificate.pdf',
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
    ],
  };

  await transporter.sendMail(mailOptions);
};
