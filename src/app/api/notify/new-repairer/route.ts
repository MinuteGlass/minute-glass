import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "").trim();
  if (!token) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
  if (authError || !user) return NextResponse.json({ error: "Session invalide" }, { status: 401 });

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("name, email, company, siret, city, company_address, regions, kbis_url")
    .eq("id", user.id)
    .single();

  if (!profile) return NextResponse.json({ error: "Profil introuvable" }, { status: 404 });

  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@minuteglass.fr";
  const year = new Date().getFullYear();
  const kbisLink = profile.kbis_url
    ? `<a href="${profile.kbis_url}" style="color:#1D9E75;font-weight:600;">Télécharger le Kbis</a>`
    : "<span style='color:#9aa39e;'>Non fourni</span>";

  const html = `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#F4F6F5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F6F5;padding:40px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(17,33,27,.08);">
        <tr>
          <td style="background:linear-gradient(150deg,#0F5C44,#1D9E75);padding:32px 40px;">
            <p style="margin:0;font-size:22px;font-weight:800;color:#fff;">MinuteGlass — Admin</p>
            <p style="margin:6px 0 0;font-size:13px;color:rgba(255,255,255,.75);">Nouvelle inscription réparateur à valider</p>
          </td>
        </tr>
        <tr>
          <td style="padding:36px 40px;">
            <p style="margin:0 0 20px;font-size:18px;font-weight:800;color:#11211B;">Nouveau réparateur inscrit 📋</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F6F5;border-radius:14px;margin-bottom:24px;">
              <tr><td style="padding:24px 28px;">
                <table width="100%" cellpadding="4">
                  <tr><td style="font-size:13px;color:#9aa39e;width:140px;">Gérant</td><td style="font-size:13.5px;font-weight:700;color:#11211B;">${profile.name}</td></tr>
                  <tr><td style="font-size:13px;color:#9aa39e;">Société</td><td style="font-size:13.5px;font-weight:700;color:#11211B;">${profile.company ?? "—"}</td></tr>
                  <tr><td style="font-size:13px;color:#9aa39e;">SIRET</td><td style="font-size:13.5px;font-weight:700;color:#11211B;">${profile.siret ?? "—"}</td></tr>
                  <tr><td style="font-size:13px;color:#9aa39e;">Email</td><td style="font-size:13.5px;font-weight:700;color:#11211B;">${profile.email}</td></tr>
                  <tr><td style="font-size:13px;color:#9aa39e;">Adresse</td><td style="font-size:13.5px;font-weight:700;color:#11211B;">${profile.company_address ?? profile.city ?? "—"}</td></tr>
                  <tr><td style="font-size:13px;color:#9aa39e;">Zones</td><td style="font-size:13.5px;font-weight:700;color:#11211B;">${(profile.regions ?? []).join(", ") || "—"}</td></tr>
                  <tr><td style="font-size:13px;color:#9aa39e;">Kbis</td><td style="font-size:13.5px;">${kbisLink}</td></tr>
                </table>
              </td></tr>
            </table>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr><td align="center">
                <a href="https://minuteglass.fr/admin"
                   style="display:inline-block;background:linear-gradient(150deg,#0F5C44,#1D9E75);color:#fff;text-decoration:none;font-size:15px;font-weight:700;padding:14px 32px;border-radius:12px;">
                  Valider dans l'admin →
                </a>
              </td></tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 40px 28px;border-top:1px solid #EAEFED;">
            <p style="margin:0;font-size:12px;color:#9aa39e;">© ${year} MinuteGlass</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const welcomeHtml = `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F4F6F5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F6F5;padding:40px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(17,33,27,.08);">
        <tr>
          <td style="background:linear-gradient(150deg,#0F5C44,#1D9E75);padding:32px 40px;">
            <p style="margin:0;font-size:22px;font-weight:800;color:#fff;">MinuteGlass</p>
            <p style="margin:6px 0 0;font-size:13px;color:rgba(255,255,255,.75);">Votre inscription réparateur</p>
          </td>
        </tr>
        <tr>
          <td style="padding:36px 40px;">
            <p style="margin:0 0 16px;font-size:22px;font-weight:800;color:#11211B;">Bonjour ${profile.name} 👋</p>
            <p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.6;">
              Nous avons bien reçu votre dossier d'inscription pour <strong>${profile.company ?? profile.name}</strong>.
              Notre équipe va vérifier votre Kbis et valider votre compte sous <strong>24 à 48h ouvrées</strong>.
            </p>
            <div style="background:#E8F6F0;border-radius:14px;padding:20px 24px;margin-bottom:24px;">
              <p style="margin:0;font-size:14px;font-weight:700;color:#0F5C44;">
                ✅ Dossier reçu · Zones : ${(profile.regions ?? []).join(", ") || "—"}
              </p>
            </div>
            <p style="margin:0;font-size:14px;color:#6B7280;">
              Vous recevrez un email dès que votre compte sera activé. Des questions ?
              <a href="mailto:contact@minuteglass.fr" style="color:#1D9E75;">contact@minuteglass.fr</a>
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 40px 28px;border-top:1px solid #EAEFED;">
            <p style="margin:0;font-size:12px;color:#9aa39e;">© ${year} MinuteGlass — <a href="https://minuteglass.fr" style="color:#1D9E75;">minuteglass.fr</a></p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  await Promise.all([
    fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "MinuteGlass <no-reply@minuteglass.fr>",
        to: [adminEmail],
        subject: `📋 Nouveau réparateur à valider — ${profile.company ?? profile.name}`,
        html,
      }),
    }),
    fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "MinuteGlass <no-reply@minuteglass.fr>",
        to: [profile.email],
        subject: "📋 Dossier reçu — nous examinons votre inscription MinuteGlass",
        html: welcomeHtml,
      }),
    }),
  ]);

  return NextResponse.json({ ok: true });
}
