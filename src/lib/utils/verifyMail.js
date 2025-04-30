import * as handlebar from "handlebars";
import { emailTemplate } from "./emailTemplate";
export const generateRandomOTP = () => {
  // Generate a random 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  return otp;
};
export async function emailTemplateBody({ name, message, link }) {
  try {
    const emailBody = await compileTemplate(name, link, message);
    return emailBody;
  } catch (error) {
    console.error("Error sending mail:", error);
    return null;
  }
}

export const compileTemplate = async (name, url, message) => {
  // const image = "https://www.wordvibrant.com.tw/images/logo4.png";
  // const getBase64 = await toBase64(image);
  const template = handlebar.compile(emailTemplate);
  const htmlBody = template({ name, url, content: message });
  return htmlBody;
};
