import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function confirmationClientHtml(prenom: string, title: string, ville: string, intervention: string) {
  const interventionLabel =
    intervention === "remplacement" ? "Remplacement pare-brise" :
    intervention === "reparation"   ? "Réparation impact"       :
    "Vitre latérale";

  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F4F6F5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F6F5;padding:40px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(17,33,27,.08);">
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(150deg,#0F5C44,#1D9E75);padding:32px 40px;">
            <p style="margin:0;font-size:22px;font-weight:800;color:#fff;letter-spacing:-0.5px;">MinuteGlass</p>
            <p style="margin:6px 0 0;font-size:13px;color:rgba(255,255,255,.75);font-weight:500;">Réparation vitrage automobile</p>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:36px 40px;">
            <p style="margin:0 0 8px;font-size:26px;font-weight:800;color:#11211B;">Bonjour ${prenom} 👋</p>
            <p style="margin:0 0 28px;font-size:15px;color:#6B7280;line-height:1.6;">Votre demande a bien été reçue. Des réparateurs certifiés de votre zone vont la consulter et vous contacter rapidement.</p>

            <!-- Recap card -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F6F5;border-radius:14px;margin-bottom:28px;">
              <tr><td style="padding:24px 28px;">
                <p style="margin:0 0 14px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:#9aa39e;">Récapitulatif de votre demande</p>
                <p style="margin:0 0 8px;font-size:16px;font-weight:800;color:#11211B;">${title}</p>
                <p style="margin:0 0 4px;font-size:13.5px;color:#6B7280;">📍 ${ville}</p>
                <p style="margin:0;font-size:13.5px;color:#6B7280;">🔧 ${interventionLabel}</p>
              </td></tr>
            </table>

            <!-- Steps -->
            <p style="margin:0 0 16px;font-size:14px;font-weight:700;color:#11211B;">Que se passe-t-il maintenant ?</p>
            <table width="100%" cellpadding="0" cellspacing="0">
              ${[
                ["1", "Les réparateurs consultent votre demande", "Dans les prochaines heures"],
                ["2", "Ils vous contactent directement", "Par téléphone ou email"],
                ["3", "Vous choisissez la meilleure offre", "En toute liberté, sans engagement"],
              ].map(([n, label, sub]) => `
              <tr>
                <td width="36" valign="top" style="padding-bottom:14px;">
                  <span style="display:inline-flex;width:28px;height:28px;border-radius:50%;background:#E8F6F0;color:#0F5C44;font-size:12px;font-weight:800;align-items:center;justify-content:center;text-align:center;line-height:28px;">${n}</span>
                </td>
                <td style="padding-bottom:14px;padding-left:12px;">
                  <p style="margin:0;font-size:13.5px;font-weight:700;color:#11211B;">${label}</p>
                  <p style="margin:2px 0 0;font-size:12.5px;color:#9aa39e;">${sub}</p>
                </td>
              </tr>`).join("")}
            </table>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="padding:20px 40px 28px;border-top:1px solid #EAEFED;">
            <p style="margin:0;font-size:12px;color:#9aa39e;line-height:1.6;">
              Vous recevez cet email car vous avez déposé une demande sur <a href="https://minute-glass.vercel.app" style="color:#1D9E75;">MinuteGlass</a>.<br>
              © ${new Date().getFullYear()} MinuteGlass — Tous droits réservés.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function POST(req: NextRequest) {
  const { type, to, prenom, title, ville, intervention } = await req.json();

  if (type === "confirmation_client") {
    const { error } = await resend.emails.send({
      from: "MinuteGlass <onboarding@resend.dev>",
      to,
      subject: "✅ Votre demande a bien été reçue — MinuteGlass",
      html: confirmationClientHtml(prenom, title, ville, intervention),
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
