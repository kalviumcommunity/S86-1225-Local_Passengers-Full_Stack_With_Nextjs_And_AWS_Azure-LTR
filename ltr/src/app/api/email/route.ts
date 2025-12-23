import { NextResponse } from "next/server";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import sendgrid from "@sendgrid/mail";

const PROVIDER = process.env.EMAIL_PROVIDER || "SENDGRID";

if (PROVIDER === "SENDGRID" && process.env.SENDGRID_API_KEY) {
  sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
}

const ses = process.env.AWS_REGION
  ? new SESClient({ region: process.env.AWS_REGION })
  : undefined;

export async function POST(req: Request) {
  try {
    const { to, subject, message } = await req.json();

    if (!to || !subject || !message) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (PROVIDER === "SES") {
      if (!ses) {
        return NextResponse.json(
          { success: false, error: "SES not configured (missing AWS_REGION)" },
          { status: 500 }
        );
      }

      const params = {
        Destination: { ToAddresses: [to] },
        Message: {
          Body: { Html: { Charset: "UTF-8", Data: message } },
          Subject: { Charset: "UTF-8", Data: subject },
        },
        Source: process.env.SES_EMAIL_SENDER!,
      };

      const response = await ses.send(new SendEmailCommand(params));
      // ...existing code...
      return NextResponse.json({
        success: true,
        messageId: response.MessageId,
      });
    }

    // Default: SendGrid
    if (!process.env.SENDGRID_SENDER) {
      return NextResponse.json(
        { success: false, error: "SendGrid sender missing" },
        { status: 500 }
      );
    }

    const emailData = {
      to,
      from: process.env.SENDGRID_SENDER!,
      subject,
      html: message,
    };

    await sendgrid.send(emailData);
    return NextResponse.json({ success: true });
  } catch (err) {
    // ...existing code...
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
