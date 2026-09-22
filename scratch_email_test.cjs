const nodemailer = require("nodemailer");

async function testEmail() {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "B.Shilpi1978@gmail.com",
        pass: "iiyorfojdduveuwk",
      },
    });

    const info = await transporter.sendMail({
      from: '"Test Email" <B.Shilpi1978@gmail.com>',
      to: "B.Shilpi1978@gmail.com",
      subject: "Hello from Node",
      text: "Hello world?",
    });

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

testEmail();
