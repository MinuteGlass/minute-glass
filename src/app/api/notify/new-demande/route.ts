import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const { title, city, intervention, damage } = await req.json();

  // Récupère tous les réparateurs validés
  const { data: repairers } = await supabaseAdmin
    .from("profiles")
    .select("email, name, company")
    .eq("role", "partenaire")
    .eq("statut", "validé");

  if (!repairers || repairers.length === 0) {
    return NextResponse.json({ ok: true, sent: 0 });
  }

  const interventionLabel =
    intervention === "remplacement" ? "Remplacement pare-brise" :
    intervention === "reparation"   ? "Réparation impact"       :
    "Vitre latérale";

  const year = new Date().getFullYear();

  let sent = 0;
  for (const r of repairers) {
    const html = `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F4F6F5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F6F5;padding:40px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(17,33,27,.08);">
        <tr>
          <td style="background:linear-gradient(150deg,#0F5C44,#1D9E75);padding:32px 40px;">
            <p style="margin:0;font-size:22px;font-weight:800;color:#fff;letter-spacing:-0.5px;">MinuteGlass</p>
            <p style="margin:6px 0 0;font-size:13px;color:rgba(255,255,255,.75);font-weight:500;">Nouvelle demande dans votre zone</p>
          </td>
        </tr>
        <tr>
          <td style="padding:36px 40px;">
            <p style="margin:0 0 8px;font-size:22px;font-weight:800;color:#11211B;">Nouvelle demande 🔔</p>
            <p style="margin:0 0 28px;font-size:15px;color:#6B7280;line-height:1.6;">
              Un particulier vient de déposer une demande de réparation vitrage. Connectez-vous pour voir ses coordonnées.
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F6F5;border-radius:14px;margin-bottom:28px;">
              <tr><td style="padding:24px 28px;">
                <p style="margin:0 0 14px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:#9aa39e;">Détails de la demande</p>
                <p style="margin:0 0 8px;font-size:16px;font-weight:800;color:#11211B;">${title}</p>
                <p style="margin:0 0 6px;font-size:13.5px;color:#6B7280;">📍 ${city}</p>
                <p style="margin:0 0 6px;font-size:13.5px;color:#6B7280;">🔧 ${interventionLabel}</p>
                ${damage ? `<p style="margin:6px 0 0;font-size:13px;color:#9aa39e;font-style:italic;">"${damage}"</p>` : ""}
              </td></tr>
            </table>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr><td align="center">
                <a href="https://minuteglass.fr/partenaire"
                   style="display:inline-block;background:linear-gradient(150deg,#0F5C44,#1D9E75);color:#fff;text-decoration:none;font-size:15px;font-weight:700;padding:14px 32px;border-radius:12px;box-shadow:0 4px 14px rgba(15,92,68,.3);">
                  Voir la demande →
                </a>
              </td></tr>
            </table>
            <p style="margin:20px 0 0;font-size:12.5px;color:#9aa39e;text-align:center;">
              1 jeton sera débité uniquement si vous décidez de débloquer les coordonnées du client.
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 40px 28px;border-top:1px solid #EAEFED;">
            <p style="margin:0;font-size:12px;color:#9aa39e;line-height:1.6;">
              Vous recevez cet email car vous êtes réparateur partenaire MinuteGlass.<br>
              © ${year} MinuteGlass — <a href="https://minuteglass.fr" style="color:#1D9E75;">minuteglass.fr</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "MinuteGlass <noreply@minuteglass.fr>",
        to: [r.email],
        subject: `🔔 Nouvelle demande vitrage — ${city}`,
        html,
      }),
    });
    if (res.ok) sent++;
  }

  return NextResponse.json({ ok: true, sent });
}
