import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function sendInvoiceEmail(opts: {
  to: string;
  name: string;
  packLabel: string;
  jetons: number;
  montant: string;
  invoiceNumber: string;
  invoicePdfUrl: string;
}) {
  const { to, name, packLabel, jetons, montant, invoiceNumber, invoicePdfUrl } = opts;
  const year = new Date().getFullYear();

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
            <p style="margin:6px 0 0;font-size:13px;color:rgba(255,255,255,.75);font-weight:500;">Facture de votre achat de jetons</p>
          </td>
        </tr>
        <tr>
          <td style="padding:36px 40px;">
            <p style="margin:0 0 8px;font-size:22px;font-weight:800;color:#11211B;">Bonjour ${name},</p>
            <p style="margin:0 0 28px;font-size:15px;color:#6B7280;line-height:1.6;">Votre paiement a bien été reçu. Retrouvez ci-dessous le récapitulatif de votre achat ainsi que votre facture.</p>

            <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F6F5;border-radius:14px;margin-bottom:28px;">
              <tr><td style="padding:24px 28px;">
                <p style="margin:0 0 14px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:#9aa39e;">Récapitulatif</p>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="font-size:13.5px;color:#6B7280;padding-bottom:8px;">Référence</td>
                    <td style="font-size:13.5px;font-weight:700;color:#11211B;text-align:right;padding-bottom:8px;">${invoiceNumber}</td>
                  </tr>
                  <tr>
                    <td style="font-size:13.5px;color:#6B7280;padding-bottom:8px;">Pack</td>
                    <td style="font-size:13.5px;font-weight:700;color:#11211B;text-align:right;padding-bottom:8px;">${packLabel}</td>
                  </tr>
                  <tr>
                    <td style="font-size:13.5px;color:#6B7280;padding-bottom:8px;">Jetons crédités</td>
                    <td style="font-size:13.5px;font-weight:800;color:#0F5C44;text-align:right;padding-bottom:8px;">+${jetons} jetons</td>
                  </tr>
                  <tr>
                    <td style="font-size:15px;font-weight:800;color:#11211B;padding-top:8px;border-top:1px solid #EAEFED;">Total payé</td>
                    <td style="font-size:15px;font-weight:800;color:#11211B;text-align:right;padding-top:8px;border-top:1px solid #EAEFED;">${montant}</td>
                  </tr>
                </table>
              </td></tr>
            </table>

            <table width="100%" cellpadding="0" cellspacing="0">
              <tr><td align="center">
                <a href="${invoicePdfUrl}" target="_blank"
                   style="display:inline-block;background:linear-gradient(150deg,#0F5C44,#1D9E75);color:#fff;text-decoration:none;font-size:15px;font-weight:700;padding:14px 32px;border-radius:12px;box-shadow:0 4px 14px rgba(15,92,68,.3);">
                  Télécharger ma facture PDF
                </a>
              </td></tr>
            </table>

            <p style="margin:24px 0 0;font-size:13px;color:#9aa39e;text-align:center;">Vous pouvez aussi la retrouver dans votre espace réparateur → Jetons &amp; facturation.</p>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 40px 28px;border-top:1px solid #EAEFED;">
            <p style="margin:0;font-size:12px;color:#9aa39e;line-height:1.6;">
              Paiement sécurisé par Stripe · TVA non applicable, art. 293 B du CGI<br>
              © ${year} MinuteGlass — <a href="https://minuteglass.fr" style="color:#1D9E75;">minuteglass.fr</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "MinuteGlass <no-reply@minuteglass.fr>",
        to: [to],
        subject: `🧾 Votre facture MinuteGlass — ${invoiceNumber}`,
        html,
      }),
    });
    if (!res.ok) {
      console.error("Erreur envoi email facture:", await res.text());
    }
  } catch (err) {
    console.error("Erreur envoi email facture:", err);
  }
}

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET manquant");
    return NextResponse.json({ error: "Configuration serveur incorrecte" }, { status: 500 });
  }

  const body = await req.text();
  const sig  = req.headers.get("stripe-signature") ?? "";

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Signature invalide" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { userId, jetons, pack, packLabel } = session.metadata ?? {};

    if (userId && jetons) {
      // Crédite les jetons
      await supabaseAdmin.rpc("increment_tokens", {
        user_id: userId,
        amount: parseInt(jetons),
      });

      // Récupère la facture Stripe pour le PDF et le numéro
      let invoiceId = "";
      let invoicePdfUrl = "";
      let invoiceNumber = "";

      if (session.invoice) {
        try {
          invoiceId = session.invoice as string;
          const invoice = await stripe.invoices.retrieve(invoiceId);
          invoicePdfUrl = invoice.invoice_pdf ?? "";
          invoiceNumber = invoice.number ?? "";
        } catch (err) {
          console.error("Erreur récupération facture Stripe:", err);
        }
      }

      // Génère un numéro de référence interne si Stripe n'en a pas
      if (!invoiceNumber) {
        const year = new Date().getFullYear();
        const suffix = Date.now().toString().slice(-4);
        invoiceNumber = `FAC-${year}-${suffix}`;
      }

      // Insère la transaction en base
      const { error: txErr } = await supabaseAdmin.from("token_transactions").insert({
        user_id: userId,
        pack_name: packLabel ?? pack ?? "Inconnu",
        tokens: parseInt(jetons),
        amount_cents: session.amount_total ?? 0,
        stripe_payment_id: session.payment_intent as string ?? null,
        stripe_session_id: session.id,
        stripe_invoice_id: invoiceId || null,
        invoice_pdf_url: invoicePdfUrl || null,
        invoice_number: invoiceNumber,
        status: "paid",
      });

      if (txErr) {
        console.error("Erreur insertion token_transactions:", txErr.message);
      }

      // Récupère l'email et le nom du réparateur pour envoyer la facture
      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("email, name")
        .eq("id", userId)
        .single();

      if (profile?.email && invoicePdfUrl) {
        const montant = ((session.amount_total ?? 0) / 100).toFixed(2).replace(".", ",") + " €";
        await sendInvoiceEmail({
          to: profile.email,
          name: profile.name ?? "Réparateur",
          packLabel: packLabel ?? pack ?? "Jetons",
          jetons: parseInt(jetons),
          montant,
          invoiceNumber,
          invoicePdfUrl,
        });
      }
    }
  }

  return NextResponse.json({ received: true });
}
