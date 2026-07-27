import { NextRequest, NextResponse } from "next/server";

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
        <tr>
          <td style="background:linear-gradient(150deg,#0F5C44,#1D9E75);padding:32px 40px;">
            <p style="margin:0;font-size:22px;font-weight:800;color:#fff;letter-spacing:-0.5px;">MinuteGlass</p>
            <p style="margin:6px 0 0;font-size:13px;color:rgba(255,255,255,.75);font-weight:500;">Réparation vitrage automobile</p>
          </td>
        </tr>
        <tr>
          <td style="padding:36px 40px;">
            <p style="margin:0 0 8px;font-size:26px;font-weight:800;color:#11211B;">Bonjour ${prenom} 👋</p>
            <p style="margin:0 0 28px;font-size:15px;color:#6B7280;line-height:1.6;">Votre demande a bien été reçue. Des réparateurs certifiés de votre zone vont la consulter et vous contacter rapidement.</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F6F5;border-radius:14px;margin-bottom:28px;">
              <tr><td style="padding:24px 28px;">
                <p style="margin:0 0 14px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:#9aa39e;">Récapitulatif</p>
                <p style="margin:0 0 8px;font-size:16px;font-weight:800;color:#11211B;">${title}</p>
                <p style="margin:0 0 4px;font-size:13.5px;color:#6B7280;">📍 ${ville}</p>
                <p style="margin:0;font-size:13.5px;color:#6B7280;">🔧 ${interventionLabel}</p>
              </td></tr>
            </table>
            <p style="margin:0 0 16px;font-size:14px;font-weight:700;color:#11211B;">Que se passe-t-il maintenant ?</p>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td width="36" valign="top" style="padding-bottom:14px;"><span style="display:inline-block;width:28px;height:28px;border-radius:50%;background:#E8F6F0;color:#0F5C44;font-size:12px;font-weight:800;text-align:center;line-height:28px;">1</span></td>
                <td style="padding-bottom:14px;padding-left:12px;"><p style="margin:0;font-size:13.5px;font-weight:700;color:#11211B;">Les réparateurs consultent votre demande</p><p style="margin:2px 0 0;font-size:12.5px;color:#9aa39e;">Dans les prochaines heures</p></td>
              </tr>
              <tr>
                <td width="36" valign="top" style="padding-bottom:14px;"><span style="display:inline-block;width:28px;height:28px;border-radius:50%;background:#E8F6F0;color:#0F5C44;font-size:12px;font-weight:800;text-align:center;line-height:28px;">2</span></td>
                <td style="padding-bottom:14px;padding-left:12px;"><p style="margin:0;font-size:13.5px;font-weight:700;color:#11211B;">Ils vous contactent directement</p><p style="margin:2px 0 0;font-size:12.5px;color:#9aa39e;">Par téléphone ou email</p></td>
              </tr>
              <tr>
                <td width="36" valign="top"><span style="display:inline-block;width:28px;height:28px;border-radius:50%;background:#E8F6F0;color:#0F5C44;font-size:12px;font-weight:800;text-align:center;line-height:28px;">3</span></td>
                <td style="padding-left:12px;"><p style="margin:0;font-size:13.5px;font-weight:700;color:#11211B;">Vous choisissez la meilleure offre</p><p style="margin:2px 0 0;font-size:12.5px;color:#9aa39e;">En toute liberté, sans engagement</p></td>
              </tr>
            </table>
          </td>
        </tr>
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
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "MinuteGlass <onboarding@resend.dev>",
        to: [to],
        subject: "✅ Votre demande a bien été reçue — MinuteGlass",
        html: confirmationClientHtml(prenom, title, ville, intervention),
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: err }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true });
}
