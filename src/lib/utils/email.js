import nodemailer from 'nodemailer';

const { SMTP_EMAIL, SMTP_PASSWORD } = process.env;

// Create reusable transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: SMTP_EMAIL,
    pass: SMTP_PASSWORD,
  },
});

/**
 * Send email with consistent template
 * @param {Object} params
 * @param {string} params.to - Recipient email
 * @param {string} params.subject - Email subject
 * @param {string} params.template - HTML template string
 * @returns {Promise<boolean>} - True if sent successfully
 */
export const sendEmail = async ({ to, subject, template }) => {
  try {
    await transporter.verify();
    
    await transporter.sendMail({
      from: `JobScamShield <${SMTP_EMAIL}>`,
      to,
      subject,
      html: template,
    });
    
    return true;
  } catch (error) {
    console.error('Email send error:', error);
    return false;
  }
};
