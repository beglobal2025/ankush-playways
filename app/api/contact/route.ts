import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

type ContactRequest = {
  name?: string;
  phone?: string;
  email?: string;
  requirement?: string;
  message?: string;
};

export async function POST(request: Request) {
  try {
    const { name, phone, email, requirement, message } = (await request.json()) as ContactRequest;

    if (![name, phone, requirement, message].every((value) => value?.trim())) {
      return NextResponse.json({ error: "Please complete all required fields." }, { status: 400 });
    }

    const gmailUser = process.env.GMAIL_USER;
    const gmailAppPassword = process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, "");

    if (!gmailUser || !gmailAppPassword) {
      console.error("Contact email credentials are not configured.");
      return NextResponse.json({ error: "Email service is temporarily unavailable." }, { status: 503 });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: gmailUser,
        pass: gmailAppPassword,
      },
    });

    const enquiry = [
      "New website enquiry",
      "",
      `Name: ${name!.trim()}`,
      `Phone: ${phone!.trim()}`,
      email?.trim() ? `Email: ${email.trim()}` : "Email: Not provided",
      `Requirement: ${requirement!.trim()}`,
      "",
      "Message:",
      message!.trim(),
    ].join("\n");

    await transporter.sendMail({
      from: `Ankush Playways Website <${gmailUser}>`,
      to: gmailUser,
      replyTo: email?.trim() || undefined,
      subject: `Website enquiry from ${name!.trim()} - ${requirement!.trim()}`,
      text: enquiry,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to send contact enquiry:", error);
    return NextResponse.json({ error: "Unable to send your enquiry. Please try again." }, { status: 500 });
  }
}
