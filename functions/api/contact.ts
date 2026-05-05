/**
 * Cloudflare Pages Function — Contact form submission handler
 *
 * Receives JSON form data and forwards it to the configured email address
 * via Resend (https://resend.com). Set RESEND_API_KEY in Pages environment
 * variables to enable email delivery.
 *
 * If RESEND_API_KEY is not set, the submission is logged but treated as
 * success so the form remains usable while email is being configured.
 */

interface ContactPayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  propertyAddress?: string;
  role?: string;
  revenue?: string;
  message?: string;
  nda?: boolean;
  smsConsent?: boolean;
}

interface Env {
  RESEND_API_KEY?: string;
  CONTACT_TO_EMAIL?: string;
  CONTACT_FROM_EMAIL?: string;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export const onRequestOptions: PagesFunction = async () =>
  new Response(null, { status: 204, headers: corsHeaders });

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let data: ContactPayload;
  try {
    data = await request.json();
  } catch {
    return json({ ok: false, error: "Invalid JSON" }, 400);
  }

  // Server-side validation
  const required: (keyof ContactPayload)[] = ["firstName", "lastName", "email", "phone", "message"];
  const missing = required.filter((k) => !data[k] || String(data[k]).trim() === "");
  if (missing.length) {
    return json({ ok: false, error: `Missing required fields: ${missing.join(", ")}` }, 400);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.email))) {
    return json({ ok: false, error: "Invalid email address" }, 400);
  }

  const toEmail = env.CONTACT_TO_EMAIL || "info@clubassetmanagement.com";
  const fromEmail = env.CONTACT_FROM_EMAIL || "noreply@clubassetmanagement.com";

  // Build email content
  const subject = `New Property Inquiry from ${data.firstName} ${data.lastName}`;
  const text = [
    `New inquiry from clubassetmanagement.com`,
    ``,
    `Name: ${data.firstName} ${data.lastName}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone}`,
    `Property Address: ${data.propertyAddress || "—"}`,
    `Role: ${data.role || "—"}`,
    `Revenue: ${data.revenue || "—"}`,
    ``,
    `Message:`,
    `${data.message}`,
    ``,
    `NDA Requested: ${data.nda ? "Yes" : "No"}`,
    `SMS Consent: ${data.smsConsent ? "Yes — opted in" : "No — did not opt in"}`,
    ``,
    `Submitted at: ${new Date().toISOString()}`,
  ].join("\n");

  const html = `
    <h2>New Property Inquiry</h2>
    <p><strong>Name:</strong> ${escapeHtml(data.firstName || "")} ${escapeHtml(data.lastName || "")}</p>
    <p><strong>Email:</strong> <a href="mailto:${escapeHtml(data.email || "")}">${escapeHtml(data.email || "")}</a></p>
    <p><strong>Phone:</strong> <a href="tel:${escapeHtml(data.phone || "")}">${escapeHtml(data.phone || "")}</a></p>
    <p><strong>Property Address:</strong> ${escapeHtml(data.propertyAddress || "—")}</p>
    <p><strong>Role:</strong> ${escapeHtml(data.role || "—")}</p>
    <p><strong>Revenue:</strong> ${escapeHtml(data.revenue || "—")}</p>
    <hr />
    <p><strong>Message:</strong></p>
    <p style="white-space:pre-wrap">${escapeHtml(data.message || "")}</p>
    <hr />
    <p><strong>NDA Requested:</strong> ${data.nda ? "Yes" : "No"}</p>
    <p><strong>SMS Consent:</strong> ${data.smsConsent ? "✅ Yes — opted in to receive SMS" : "❌ No — did not opt in"}</p>
    <p style="color:#666;font-size:12px">Submitted ${new Date().toUTCString()}</p>
  `;

  // Send via Resend if configured
  if (env.RESEND_API_KEY) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: `Club Asset Management <${fromEmail}>`,
          to: [toEmail],
          reply_to: data.email,
          subject,
          text,
          html,
        }),
      });
      if (!res.ok) {
        const errBody = await res.text();
        console.error("Resend error:", res.status, errBody);
        return json({ ok: false, error: "Email delivery failed. Please try again or call us directly." }, 502);
      }
    } catch (err) {
      console.error("Resend exception:", err);
      return json({ ok: false, error: "Email delivery failed. Please try again or call us directly." }, 502);
    }
  } else {
    // No email service configured yet — log to console but accept the submission
    console.log("CONTACT FORM (no email service configured):", { subject, text });
  }

  return json({ ok: true, message: "Thank you! Your inquiry has been received. We'll be in touch within one business day." });
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
