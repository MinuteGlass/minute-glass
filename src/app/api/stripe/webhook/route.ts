import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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
    }
  }

  return NextResponse.json({ received: true });
}
