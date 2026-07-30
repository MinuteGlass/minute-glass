import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifyToken } from "@/app/api/admin/login/route";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const token = req.headers.get("x-admin-token") ?? "";
  if (!verifyToken(token, process.env.ADMIN_SESSION_SECRET ?? "")) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { path } = await req.json();
  if (!path) return NextResponse.json({ error: "path manquant" }, { status: 400 });

  const { data, error } = await supabaseAdmin.storage
    .from("kbis-documents")
    .createSignedUrl(path, 300); // 5 min

  if (error || !data?.signedUrl) {
    return NextResponse.json({ error: error?.message ?? "Erreur" }, { status: 500 });
  }

  return NextResponse.json({ url: data.signedUrl });
}
