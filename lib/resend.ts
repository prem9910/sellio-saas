import { Resend } from "resend";

let _resend: Resend | null = null;

function getResend(): Resend {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY ?? "placeholder");
  }
  return _resend;
}

export async function sendWelcomeEmail(email: string, name: string) {
  return getResend().emails.send({
    from: "Sellio <noreply@sellio.io>",
    to: email,
    subject: "Welcome to Sellio — Let's automate your store",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #080C14; color: #F8FAFC; padding: 40px; border-radius: 12px;">
        <h1 style="color: #6366F1; margin-bottom: 8px;">Welcome to Sellio, ${name}!</h1>
        <p style="color: #94A3B8; margin-bottom: 24px;">Built for sellers, powered by AI.</p>
        <p>Your account is ready. Start by connecting your store and creating your first automation.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display:inline-block;margin-top:24px;background:linear-gradient(135deg,#6366F1,#4F46E5);color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:500;">Go to Dashboard →</a>
        <p style="margin-top: 32px; color: #64748B; font-size: 12px;">© ${new Date().getFullYear()} Sellio. All rights reserved.</p>
      </div>
    `,
  });
}

export async function sendAutomationTriggeredEmail(
  email: string,
  automationName: string,
  message: string
) {
  return getResend().emails.send({
    from: "Sellio <noreply@sellio.io>",
    to: email,
    subject: `Sellio: Automation "${automationName}" triggered`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #080C14; color: #F8FAFC; padding: 40px; border-radius: 12px;">
        <h2 style="color: #6366F1;">Automation Triggered</h2>
        <p style="color: #94A3B8;">${automationName}</p>
        <p>${message}</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/automations" style="display:inline-block;margin-top:24px;background:linear-gradient(135deg,#6366F1,#4F46E5);color:white;padding:12px 24px;border-radius:8px;text-decoration:none;">View Automations →</a>
        <p style="margin-top: 32px; color: #64748B; font-size: 12px;">© ${new Date().getFullYear()} Sellio. All rights reserved.</p>
      </div>
    `,
  });
}

export async function sendPaymentConfirmationEmail(
  email: string,
  plan: string,
  amount: string
) {
  return getResend().emails.send({
    from: "Sellio <noreply@sellio.io>",
    to: email,
    subject: `Sellio: Payment confirmed — ${plan} plan`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #080C14; color: #F8FAFC; padding: 40px; border-radius: 12px;">
        <h2 style="color: #10B981;">Payment Confirmed</h2>
        <p>Your <strong>${plan}</strong> plan is now active.</p>
        <p style="color: #94A3B8;">Amount: ${amount}</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display:inline-block;margin-top:24px;background:linear-gradient(135deg,#6366F1,#4F46E5);color:white;padding:12px 24px;border-radius:8px;text-decoration:none;">Go to Dashboard →</a>
        <p style="margin-top: 32px; color: #64748B; font-size: 12px;">© ${new Date().getFullYear()} Sellio. All rights reserved.</p>
      </div>
    `,
  });
}
