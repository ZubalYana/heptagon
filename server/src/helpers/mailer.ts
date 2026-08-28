import { Resend } from "resend";

function fromAddress(): string {
  return process.env.MAIL_FROM || "Heptagon <onboarding@resend.dev>";
}

export async function sendMail(to: string, subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn(`[mail] RESEND_API_KEY is not set. Would send to ${to}: ${subject}`);
    return;
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: fromAddress(),
    to,
    subject,
    html,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function sendVerificationEmail(to: string, verifyUrl: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn(`[mail] Verification link for ${to}: ${verifyUrl}`);
    return;
  }

  await sendMail(
    to,
    "Verify your Heptagon email",
    `
      <div style="font-family:sans-serif;background:#151515;color:#eee;padding:24px">
        <h2 style="color:#00FF26">Verify your email</h2>
        <p>Click the link below to confirm this address for your Heptagon account.</p>
        <p><a href="${verifyUrl}" style="color:#00FF26">Verify email</a></p>
        <p style="color:#888;font-size:12px">This link expires in 24 hours. If you did not create an account, you can ignore this email.</p>
      </div>
    `
  );
}
