import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifyToken } from "@/app/api/admin/login/route";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  const token = req.headers.get("x-admin-token") ?? "";
  if (!verifyToken(token, process.env.ADMIN_SESSION_SECRET ?? "")) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("id, name, email, phone, company, siret, city, tokens, statut, kbis_url, regions, company_address, created_at")
    .eq("role", "partenaire")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ partenaires: data ?? [] });
}
