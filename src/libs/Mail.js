import nodemailer from "nodemailer";

class Mail {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });
  }

  sendMail(message) {
    return this.transporter.sendMail({
      ...message
    });
  }
}

export default new Mail();
