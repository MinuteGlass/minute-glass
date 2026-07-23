import { supabase } from "./supabase";

export type AuthRole = "particulier" | "partenaire";

export interface AuthState {
  id: string;
  role: AuthRole;
  email?: string;
  name?: string;
  tokens?: number;
}

const CACHE_KEY   = "mg_auth";
const CACHE_EVENT = "mg_auth_change";

/* ─── Cache local (évite un round-trip Supabase à chaque render) ─── */
function writeCache(state: AuthState | null) {
  if (typeof window === "undefined") return;
  if (state) localStorage.setItem(CACHE_KEY, JSON.stringify(state));
  else        localStorage.removeItem(CACHE_KEY);
  window.dispatchEvent(new Event(CACHE_EVENT));
}

export function getAuth(): AuthState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as AuthState) : null;
  } catch { return null; }
}

/* ─── Inscription ─── */
export async function signUp(
  email: string,
  password: string,
  role: AuthRole,
  name: string
): Promise<{ error: string | null }> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { role, name } },
  });
  if (error) {
    if (error.message?.includes("already")) return { error: "Un compte existe déjà avec cet email." };
    if (error.message?.includes("Password")) return { error: "Mot de passe trop faible (8 caractères min.)." };
    if (!error.message || error.message === "{}") return { error: "Erreur de connexion au serveur. Vérifiez votre email." };
    return { error: error.message };
  }

  const user = data.user;
  if (user) writeCache({ id: user.id, role, email, name });
  return { error: null };
}

/* ─── Connexion ─── */
export async function signIn(
  email: string,
  password: string
): Promise<{ error: string | null; state: AuthState | null }> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "Email ou mot de passe incorrect.", state: null };

  const user = data.user;
  // Récupère le profil pour avoir le rôle et les jetons
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, name, tokens")
    .eq("id", user.id)
    .single();

  const state: AuthState = {
    id:     user.id,
    role:   (profile?.role ?? "particulier") as AuthRole,
    email:  user.email,
    name:   profile?.name ?? "",
    tokens: profile?.tokens ?? 0,
  };
  writeCache(state);
  return { error: null, state };
}

/* ─── Déconnexion ─── */
export async function signOut() {
  await supabase.auth.signOut();
  writeCache(null);
}

/* ─── Compat legacy (utilisé dans le reste du code) ─── */
export function setAuth(role: AuthRole, email?: string, name?: string) {
  // Appelé après signUp/signIn — le cache est déjà à jour, on ne fait rien
  // Garde la compatibilité avec les appels existants
  const existing = getAuth();
  if (existing) return;
  // Fallback si appelé sans Supabase (mode démo)
  const fake: AuthState = { id: "demo", role, email, name };
  writeCache(fake);
}

export function clearAuth() {
  signOut();
}

export function onAuthChange(cb: () => void): () => void {
  window.addEventListener(CACHE_EVENT, cb);
  window.addEventListener("storage", cb);

  // Sync avec la session Supabase au montage
  supabase.auth.getSession().then(async ({ data }) => {
    const session = data.session;
    if (!session) { writeCache(null); return; }

    const cached = getAuth();
    if (cached?.id === session.user.id) return; // déjà à jour

    const { data: profile } = await supabase
      .from("profiles")
      .select("role, name, tokens")
      .eq("id", session.user.id)
      .single();

    writeCache({
      id:     session.user.id,
      role:   (profile?.role ?? "particulier") as AuthRole,
      email:  session.user.email,
      name:   profile?.name ?? "",
      tokens: profile?.tokens ?? 0,
    });
  });

  return () => {
    window.removeEventListener(CACHE_EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}
