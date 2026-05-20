import { Resend } from "resend";

// Resend's onboarding@resend.dev sender only delivers to the account email until
// a verified domain is configured. Override via env once clinicrelay.co is set up.
const DEFAULT_NOTIFY_FROM = "ClinicRelay Leads <onboarding@resend.dev>";

let resend: Resend | null = null;

function getResend(): Resend | null {
  if (resend) return resend;
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  resend = new Resend(key);
  return resend;
}

type LeadFields = {
  name: string;
  clinic_name: string;
  email: string;
  role?: string;
  phone?: string;
  clinic_type?: string;
  location_count?: string;
  website_url?: string;
  pain_points?: string[];
  interest?: string[];
  message?: string;
};

const HTML_ESCAPE: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (ch) => HTML_ESCAPE[ch] ?? ch);
}

function formatRow(label: string, value: string | string[] | undefined): string {
  if (!value || (Array.isArray(value) && value.length === 0)) return "";
  const display = Array.isArray(value)
    ? value.map(escapeHtml).join(", ")
    : escapeHtml(value);
  return `<tr><td style="padding:6px 12px 6px 0;color:#4b7a72;font-size:13px;white-space:nowrap;vertical-align:top">${label}</td><td style="padding:6px 0;color:#0f1a18;font-size:13px">${display}</td></tr>`;
}

export async function notifyNewLead(lead: LeadFields): Promise<void> {
  const client = getResend();
  if (!client) return; // silently skip if RESEND_API_KEY not set

  const to = process.env.LEAD_NOTIFY_TO;
  if (!to) {
    console.warn("notifyNewLead skipped: LEAD_NOTIFY_TO not set");
    return;
  }
  const from = process.env.LEAD_NOTIFY_FROM ?? DEFAULT_NOTIFY_FROM;

  const rows = [
    formatRow("Name", lead.name),
    formatRow("Clinic", lead.clinic_name),
    formatRow("Email", lead.email),
    formatRow("Role", lead.role),
    formatRow("Phone", lead.phone),
    formatRow("Clinic type", lead.clinic_type),
    formatRow("Locations", lead.location_count),
    formatRow("Website", lead.website_url),
    formatRow("Pain points", lead.pain_points),
    formatRow("Interested in", lead.interest),
    formatRow("Message", lead.message),
  ].filter(Boolean).join("\n");

  const html = `
<div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;background:#f8fafa">
  <div style="background:#0d9488;border-radius:12px 12px 0 0;padding:20px 24px">
    <p style="margin:0;color:white;font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase">ClinicRelay</p>
    <h1 style="margin:6px 0 0;color:white;font-size:20px;font-weight:600">New lead submitted</h1>
  </div>
  <div style="background:white;border-radius:0 0 12px 12px;padding:24px;border:1px solid #d1e8e4;border-top:none">
    <table style="border-collapse:collapse;width:100%">
      ${rows}
    </table>
    <div style="margin-top:20px;padding-top:16px;border-top:1px solid #d1e8e4">
      <a href="https://supabase.com" style="font-size:12px;color:#0d9488">View in Supabase</a>
    </div>
  </div>
</div>`;

  await client.emails.send({
    from,
    to,
    subject: `New lead: ${lead.name} — ${lead.clinic_name}`,
    html,
  });
}
