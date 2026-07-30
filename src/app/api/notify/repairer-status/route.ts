import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { to, name, company, statut } = await req.json();
  if (!to || !statut) return NextResponse.json({ error: "Paramètres manquants" }, { status: 400 });

  const isValidated = statut === "validé";
  const isSuspended = statut === "suspendu";
  const isRefused   = statut === "refusé";

  const subject = isValidated
    ? "✅ Votre compte réparateur MinuteGlass est validé"
    : isRefused
    ? "❌ Votre inscription MinuteGlass n'a pas été retenue"
    : "⚠️ Votre compte MinuteGlass a été suspendu";

  const bodyColor = isValidated ? "#0F5C44" : isRefused ? "#B0431F" : "#B06B10";
  const bodyBg    = isValidated ? "#E8F6F0" : isRefused ? "#FCEDE7" : "#FEF3E8";

  const html = `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F4F6F5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F6F5;padding:40px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(17,33,27,.08);">
        <tr>
          <td style="background:linear-gradient(150deg,#0F5C44,#1D9E75);padding:32px 40px;">
            <p style="margin:0;font-size:22px;font-weight:800;color:#fff;">MinuteGlass</p>
            <p style="margin:6px 0 0;font-size:13px;color:rgba(255,255,255,.75);">Mise à jour de votre compte réparateur</p>
          </td>
        </tr>
        <tr>
          <td style="padding:36px 40px;">
            <p style="margin:0 0 16px;font-size:22px;font-weight:800;color:#11211B;">Bonjour ${name},</p>
            <div style="background:${bodyBg};border-radius:14px;padding:20px 24px;margin-bottom:24px;">
              <p style="margin:0;font-size:15px;font-weight:700;color:${bodyColor};">
                ${isValidated
                  ? "🎉 Votre compte a été validé ! Vous pouvez maintenant accéder aux demandes clients dans votre zone."
                  : isRefused
                  ? "Votre dossier d'inscription n'a pas pu être retenu. Si vous pensez qu'il s'agit d'une erreur, contactez-nous."
                  : "Votre compte a été temporairement suspendu. Contactez-nous pour plus d'informations."}
              </p>
            </div>
            ${isValidated ? `
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr><td align="center">
                <a href="https://minuteglass.fr/partenaire"
                   style="display:inline-block;background:linear-gradient(150deg,#0F5C44,#1D9E75);color:#fff;text-decoration:none;font-size:15px;font-weight:700;padding:14px 32px;border-radius:12px;box-shadow:0 4px 14px rgba(15,92,68,.3);">
                  Accéder à mon espace →
                </a>
              </td></tr>
            </table>` : `
            <p style="font-size:14px;color:#6B7280;">
              Pour toute question : <a href="mailto:contact@minuteglass.fr" style="color:#1D9E75;">contact@minuteglass.fr</a>
            </p>`}
          </td>
        </tr>
        <tr>
          <td style="padding:20px 40px 28px;border-top:1px solid #EAEFED;">
            <p style="margin:0;font-size:12px;color:#9aa39e;">© ${new Date().getFullYear()} MinuteGlass — <a href="https://minuteglass.fr" style="color:#1D9E75;">minuteglass.fr</a></p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "MinuteGlass <no-reply@minuteglass.fr>",
      to: [to],
      subject,
      html,
    }),
  }).catch(() => {});

  return NextResponse.json({ ok: true });
}
