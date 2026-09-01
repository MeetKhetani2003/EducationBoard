import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, subject, message } = body;

    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    if (!emailUser || !emailPass) {
      console.error("Email credentials are not configured in environment variables.");
      return NextResponse.json(
        { success: false, message: "Email service is not configured on the server." },
        { status: 500 }
      );
    }

    // Determine the service to use (or use standard SMTP if known)
    // We assume Gmail or standard SMTP can be guessed by nodemailer, but it's best to specify a host if needed.
    // For app passwords, usually it's Gmail. Let's try standard Gmail. If the user uses a different provider, they might need to specify SMTP_HOST.
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    const mailOptions = {
      from: emailUser,
      to: emailUser,
      replyTo: email || undefined,
      subject: `New Inquiry from ${name || "Website"}: ${subject || "No Subject"}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #8d1c2f; border-bottom: 2px solid #8d1c2f; padding-bottom: 10px;">New Form Submission</h2>
          <p><strong>Name:</strong> ${name || "N/A"}</p>
          <p><strong>Email:</strong> ${email || "N/A"}</p>
          <p><strong>Phone:</strong> ${phone || "N/A"}</p>
          <p><strong>Subject:</strong> ${subject || "N/A"}</p>
          <div style="margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-left: 4px solid #8d1c2f;">
            <h4 style="margin-top: 0;">Message:</h4>
            <p style="white-space: pre-wrap; margin-bottom: 0;">${message || "No message provided."}</p>
          </div>
          <p style="font-size: 12px; color: #777; margin-top: 30px;">This email was sent securely from your website's contact form.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error("Failed to send email:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send the message. Please try again later." },
      { status: 500 }
    );
  }
}
