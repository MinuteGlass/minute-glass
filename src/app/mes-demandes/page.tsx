"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import Link from "next/link";
import { toast } from "@/components/Toast";
import { getLocalDemandes, onDemandesChange } from "@/lib/demandes-store";
import { supabase } from "@/lib/supabase";
import { getAuth } from "@/lib/auth";

/* ─── Types ─── */
type OfferStatus = "pending" | "accepted" | "refused";
type ReqStatus   = "active" | "attributed" | "aboutie" | "annulee";

interface Offer {
  label: string;
  status: OfferStatus;
}
interface Thread {
  id: string;
  initials: string;
  garage: string;
  lastMsg: string;
  profileId?: string;
  offer?: Offer;
}
interface MyRequest {
  id: string;
  title: string;
  intervention: string;
  city: string;
  status: ReqStatus;
  acceptedGarage?: string;
  threads: Thread[];
  reviewPending?: boolean;
  reviewDone?: boolean;
  reviewRating?: number;
  reviewText?: string;
}

/* ─── Seed data ─── */
const SEED: MyRequest[] = [
  {
    id: "1",
    title: "Peugeot 308 · 2019",
    intervention: "Remplacement pare-brise",
    city: "Lyon 69007",
    status: "active",
    threads: [
      {
        id: "t1",
        initials: "VP",
        garage: "Vitro Pro Lyon",
        profileId: "vitro-pro-lyon",
        lastMsg: "Bonjour, je suis disponible dès demain matin pour intervenir.",
        offer: { label: "Intervention à 280 €", status: "pending" },
      },
      {
        id: "t2",
        initials: "AG",
        garage: "AutoGlass Rhône",
        profileId: "vitro-pro-lyon",
        lastMsg: "Bonjour ! Je peux vous proposer un devis rapidement.",
      },
    ],
  },
  {
    id: "2",
    title: "Renault Clio V · 2021",
    intervention: "Réparation d'impact",
    city: "Villeurbanne",
    status: "aboutie",
    acceptedGarage: "Vitro Pro Lyon",
    threads: [
      {
        id: "t3",
        initials: "VP",
        garage: "Vitro Pro Lyon",
        profileId: "vitro-pro-lyon",
        lastMsg: "Intervention effectuée. Merci pour votre confiance !",
        offer: { label: "Intervention à 75 €", status: "accepted" },
      },
    ],
    reviewPending: true,
  },
  {
    id: "3",
    title: "Citroën C3 · 2020",
    intervention: "Vitre latérale",
    city: "Vénissieux",
    status: "annulee",
    threads: [],
  },
];

/* ─── Status badge ─── */
const STATUS_STYLES: Record<ReqStatus, { label: string; bg: string; color: string }> = {
  active:      { label: "Active",      bg: "#E8F6F0", color: "#0F5C44"  },
  attributed:  { label: "Attribuée",   bg: "#EAF1FE", color: "#2563EB"  },
  aboutie:     { label: "Aboutie ✓",   bg: "#E8F6F0", color: "#0F5C44"  },
  annulee:     { label: "Annulée",     bg: "#FDE8E8", color: "#D8302F"  },
};

/* ─── Chat modal ─── */
function ChatModal({ thread, onClose }: { thread: Thread; onClose: () => void }) {
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([
    { from: "garage", text: thread.lastMsg },
  ]);

  function send() {
    if (!msg.trim()) return;
    setMessages((prev) => [...prev, { from: "me", text: msg.trim() }]);
    setMsg("");
    // Simule une réponse auto
    setTimeout(() => {
      setMessages((prev) => [...prev, { from: "garage", text: "Merci pour votre message, je reviens vers vous rapidement." }]);
    }, 1200);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" style={{ background: "rgba(17,33,27,.55)" }} onClick={onClose}>
      <div className="bg-white w-full sm:w-[480px] sm:rounded-[20px] rounded-t-[20px] flex flex-col overflow-hidden animate-mgPop" style={{ maxHeight: "80vh", boxShadow: "0 24px 60px rgba(17,33,27,.22)" }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: "1px solid #EAEFED" }}>
          <div className="w-10 h-10 rounded-[10px] flex items-center justify-center font-extrabold text-[14px] text-white flex-shrink-0" style={{ background: "linear-gradient(150deg,#1D9E75,#0F5C44)" }}>
            {thread.initials}
          </div>
          <div className="flex-1">
            <div className="font-bold text-[15px]">{thread.garage}</div>
            <div className="text-[12px] font-semibold" style={{ color: "#1D9E75" }}>● En ligne</div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center border-0 cursor-pointer text-[18px] leading-none" style={{ background: "#F4F6F5", color: "#6B7280" }}>✕</button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
              <div
                className="max-w-[80%] rounded-[14px] px-4 py-2.5 text-[13.5px] leading-relaxed"
                style={m.from === "me"
                  ? { background: "#1D9E75", color: "#fff", borderRadius: "14px 14px 4px 14px" }
                  : { background: "#F4F6F5", color: "#11211B", borderRadius: "14px 14px 14px 4px" }
                }
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 flex gap-2" style={{ borderTop: "1px solid #EAEFED" }}>
          <input
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Votre message…"
            className="flex-1 rounded-[11px] px-3.5 py-2.5 text-[14px] outline-none"
            style={{ border: "1px solid #EAEFED" }}
          />
          <button
            onClick={send}
            disabled={!msg.trim()}
            className="px-4 py-2.5 rounded-[11px] font-bold text-[13.5px] text-white border-0 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            style={{ background: "#1D9E75" }}
          >
            Envoyer
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Star rating ─── */
function StarRating({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(n)}
          className="text-[28px] border-0 bg-transparent cursor-pointer leading-none p-0 transition-transform hover:scale-110"
          style={{ color: n <= (hovered || value) ? "#F5A623" : "#e2e8e4" }}
        >
          ★
        </button>
      ))}
    </div>
  );
}

/* ─── Thread row ─── */
function ThreadRow({
  thread,
  reqStatus,
  onOfferDecide,
  onChat,
}: {
  thread: Thread;
  reqStatus: ReqStatus;
  onOfferDecide: (tid: string, action: "accept" | "refuse") => void;
  onChat: (t: Thread) => void;
}) {
  const isAccepted = thread.offer?.status === "accepted";
  const isRefused  = thread.offer?.status === "refused";
  const isPending  = thread.offer?.status === "pending";

  return (
    <div
      className="rounded-[13px] p-3.5"
      style={
        isAccepted
          ? { background: "#F6FBF9", border: "1.5px solid #cdeadd" }
          : { background: "#FAFBFB", border: "1px solid #EEF2F0" }
      }
    >
      <div className="flex items-center gap-3">
        <span
          className="flex-shrink-0 w-[38px] h-[38px] rounded-[10px] inline-flex items-center justify-center font-extrabold text-[13px] text-white"
          style={{ background: "linear-gradient(150deg,#1D9E75,#0F5C44)" }}
        >
          {thread.initials}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[14px]">{thread.garage}</span>
            {thread.profileId && (
              <Link
                href={`/partenaire/${thread.profileId}`}
                className="no-underline text-[11px] font-bold rounded-full px-2 py-0.5 flex-shrink-0"
                style={{ background: "#E8F6F0", color: "#0F5C44" }}
              >
                Voir le profil →
              </Link>
            )}
          </div>
          <div className="text-[12.5px] truncate" style={{ color: "#6B7280" }}>{thread.lastMsg}</div>
        </div>
        <button
          onClick={() => onChat(thread)}
          className="flex-shrink-0 inline-flex items-center gap-1.5 rounded-[9px] px-3 py-2 font-bold text-[12.5px] cursor-pointer border-0 transition-colors hover:bg-[#E8F6F0]"
          style={{ background: "#fff", border: "1px solid #EAEFED", color: "#11211B" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M21 12a8 8 0 01-11.5 7.2L4 20l1-4.5A8 8 0 1121 12Z" stroke="#0F5C44" strokeWidth="1.8" strokeLinejoin="round" />
          </svg>
          Discuter
        </button>
      </div>

      {/* Offer */}
      {thread.offer && (
        <div
          className="mt-3 flex items-center justify-between gap-3 flex-wrap rounded-[10px] px-3.5 py-2.5"
          style={{ background: "#FAFBFB", border: "1px solid #EEF2F0" }}
        >
          <div>
            <div className="text-[10.5px] font-bold uppercase tracking-wider" style={{ color: "#9aa39e" }}>Offre reçue</div>
            <div className="font-extrabold text-[15px] mt-0.5">{thread.offer.label}</div>
          </div>
          <div className="flex items-center gap-2">
            {isPending && reqStatus === "active" && (
              <>
                <button
                  onClick={() => onOfferDecide(thread.id, "refuse")}
                  className="rounded-[9px] px-3 py-2 font-bold text-[12.5px] cursor-pointer"
                  style={{ background: "#fff", border: "1px solid #EAEFED", color: "#6B7280" }}
                >
                  Refuser
                </button>
                <button
                  onClick={() => onOfferDecide(thread.id, "accept")}
                  className="rounded-[9px] px-3.5 py-2 font-bold text-[12.5px] text-white border-0 cursor-pointer"
                  style={{ background: "#1D9E75", boxShadow: "0 3px 10px rgba(29,158,117,.3)" }}
                >
                  Accepter
                </button>
              </>
            )}
            {isPending && reqStatus !== "active" && (
              <span className="rounded-[8px] px-2.5 py-1.5 text-[12px] font-bold" style={{ background: "#FFF7E8", color: "#B7791F" }}>En attente</span>
            )}
            {isAccepted && (
              <span className="rounded-[8px] px-2.5 py-1.5 text-[12px] font-bold" style={{ background: "#E8F6F0", color: "#0F5C44" }}>Offre acceptée ✓</span>
            )}
            {isRefused && (
              <span className="rounded-[8px] px-2.5 py-1.5 text-[12px] font-bold" style={{ background: "#FDE8E8", color: "#D8302F" }}>Offre refusée</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Request card ─── */
function RequestCard({ req, onUpdate }: { req: MyRequest; onUpdate: (updated: MyRequest) => void }) {
  const [chatThread, setChatThread] = useState<Thread | null>(null);
  const [reviewRating, setReviewRating] = useState(req.reviewRating ?? 0);
  const [reviewText, setReviewText] = useState(req.reviewText ?? "");

  const statusStyle = STATUS_STYLES[req.status];
  const canCancel   = req.status === "active";
  const canClose    = req.status === "attributed";

  const [confirmCancel, setConfirmCancel] = useState(false);
  const [confirmRefuseId, setConfirmRefuseId] = useState<string | null>(null);

  function handleOfferDecide(tid: string, action: "accept" | "refuse") {
    if (action === "refuse") { setConfirmRefuseId(tid); return; }
    const t = req.threads.find((t) => t.id === tid)!;
    onUpdate({
      ...req,
      status: "attributed",
      acceptedGarage: t.garage,
      threads: req.threads.map((th) => ({
        ...th,
        offer: th.id === tid
          ? { ...th.offer!, status: "accepted" as const }
          : th.offer
            ? { ...th.offer, status: "refused" as const }
            : undefined,
      })),
    });
    toast(`Offre de ${t.garage} acceptée ! Votre demande leur est maintenant attribuée.`, "success");
  }

  function confirmRefuse(tid: string) {
    onUpdate({
      ...req,
      threads: req.threads.map((th) => ({
        ...th,
        offer: th.id === tid ? { ...th.offer!, status: "refused" as const } : th.offer,
      })),
    });
    toast("Offre refusée.", "info");
    setConfirmRefuseId(null);
  }

  function handleCancel() { setConfirmCancel(true); }

  function confirmCancelRequest() {
    onUpdate({ ...req, status: "annulee" });
    toast("Demande annulée.", "info");
    setConfirmCancel(false);
  }

  function handleClose() {
    onUpdate({ ...req, status: "aboutie", reviewPending: true });
    toast("Intervention marquée comme aboutie !", "success");
  }

  function handleSubmitReview() {
    onUpdate({ ...req, reviewPending: false, reviewDone: true, reviewRating, reviewText });
    toast("Avis publié — merci !", "success");
  }

  const pendingOffers = req.threads.filter((t) => t.offer?.status === "pending").length;

  return (
    <>
      {chatThread && <ChatModal thread={chatThread} onClose={() => setChatThread(null)} />}

      {/* Confirm cancel modal */}
      {confirmCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(17,33,27,.5)" }} onClick={() => setConfirmCancel(false)}>
          <div className="bg-white rounded-[18px] p-7 w-full max-w-[380px] text-center animate-mgPop" style={{ boxShadow: "0 20px 50px rgba(17,33,27,.2)" }} onClick={(e) => e.stopPropagation()}>
            <div className="text-3xl mb-3">⚠️</div>
            <h2 className="m-0 text-[18px] font-extrabold mb-2">Annuler cette demande ?</h2>
            <p className="m-0 text-[13.5px] leading-relaxed mb-6" style={{ color: "#6B7280" }}>
              Cette action est irréversible. Les réparateurs en contact ne pourront plus vous répondre.
            </p>
            <div className="flex flex-col gap-2">
              <button onClick={confirmCancelRequest} className="w-full py-3 rounded-[11px] font-bold text-[14px] text-white border-0 cursor-pointer" style={{ background: "#D85A30" }}>
                Oui, annuler
              </button>
              <button onClick={() => setConfirmCancel(false)} className="w-full py-3 rounded-[11px] font-bold text-[14px] border-0 cursor-pointer" style={{ background: "#fff", border: "1px solid #EAEFED", color: "#6B7280" }}>
                Garder ma demande
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm refuse modal */}
      {confirmRefuseId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(17,33,27,.5)" }} onClick={() => setConfirmRefuseId(null)}>
          <div className="bg-white rounded-[18px] p-7 w-full max-w-[380px] text-center animate-mgPop" style={{ boxShadow: "0 20px 50px rgba(17,33,27,.2)" }} onClick={(e) => e.stopPropagation()}>
            <div className="text-3xl mb-3">🙅</div>
            <h2 className="m-0 text-[18px] font-extrabold mb-2">Refuser cette offre ?</h2>
            <p className="m-0 text-[13.5px] leading-relaxed mb-6" style={{ color: "#6B7280" }}>
              Le réparateur sera informé que son offre a été refusée. Vous pourrez toujours continuer à discuter.
            </p>
            <div className="flex flex-col gap-2">
              <button onClick={() => confirmRefuse(confirmRefuseId)} className="w-full py-3 rounded-[11px] font-bold text-[14px] text-white border-0 cursor-pointer" style={{ background: "#D85A30" }}>
                Oui, refuser l'offre
              </button>
              <button onClick={() => setConfirmRefuseId(null)} className="w-full py-3 rounded-[11px] font-bold text-[14px] border-0 cursor-pointer" style={{ background: "#fff", border: "1px solid #EAEFED", color: "#6B7280" }}>
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl p-5" style={{ border: "1px solid #EAEFED", boxShadow: "0 1px 3px rgba(17,33,27,.04)" }}>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 flex-wrap mb-1">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3 className="m-0 text-[17px] font-extrabold">{req.title}</h3>
              <span className="rounded-[8px] px-2.5 py-1 text-[12px] font-bold" style={{ background: statusStyle.bg, color: statusStyle.color }}>
                {statusStyle.label}
              </span>
              {pendingOffers > 0 && (
                <span className="inline-flex items-center gap-1 rounded-[8px] px-2.5 py-1 text-[12px] font-bold animate-mgPulse" style={{ background: "#FDE8E8", color: "#D85A30" }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#D85A30" strokeWidth="2.5" fill="#D85A30"/></svg>
                  {pendingOffers} offre{pendingOffers > 1 ? "s" : ""} en attente
                </span>
              )}
            </div>
            <div className="text-[12.5px] font-semibold mt-1" style={{ color: "#6B7280" }}>
              {req.intervention} · {req.city}
            </div>
          </div>
          <div className="flex gap-2">
            {canCancel && (
              <button
                onClick={handleCancel}
                className="rounded-[9px] px-3 py-2 font-bold text-[12.5px] cursor-pointer"
                style={{ background: "#fff", border: "1px solid #EAEFED", color: "#D8302F" }}
              >
                Annuler
              </button>
            )}
            {canClose && (
              <button
                onClick={handleClose}
                className="rounded-[9px] px-3 py-2 font-bold text-[12.5px] text-white border-0 cursor-pointer"
                style={{ background: "#1D9E75" }}
              >
                Marquer abouti
              </button>
            )}
          </div>
        </div>

        {/* Status banners */}
        {req.status === "attributed" && (
          <div className="mt-3.5 rounded-[11px] px-3.5 py-3 text-[13px] font-semibold" style={{ background: "#EAF1FE", color: "#2563EB" }}>
            Offre acceptée — demande attribuée à <b>{req.acceptedGarage}</b>. Elle n'est plus visible par les autres réparateurs.
          </div>
        )}
        {req.status === "aboutie" && (
          <div className="mt-3.5 rounded-[11px] px-3.5 py-3 text-[13px] font-semibold" style={{ background: "#E8F6F0", color: "#0F5C44" }}>
            Intervention terminée avec <b>{req.acceptedGarage}</b>. Merci d'avoir utilisé Minute Glass&nbsp;!
          </div>
        )}
        {req.status === "annulee" && (
          <div className="mt-3.5 rounded-[11px] px-3.5 py-3 text-[13px] font-semibold" style={{ background: "#FDE8E8", color: "#D8302F" }}>
            Demande annulée.
          </div>
        )}

        {/* Review block */}
        {req.status === "aboutie" && req.reviewPending && !req.reviewDone && (
          <div className="mt-3 rounded-[13px] p-4" style={{ background: "#fff", border: "1px solid #EAEFED" }}>
            <div className="font-extrabold text-[14.5px] mb-0.5">Donnez votre avis sur {req.acceptedGarage}</div>
            <div className="text-[12.5px] font-semibold mb-3" style={{ color: "#6B7280" }}>
              Votre retour aide les autres particuliers à choisir leur réparateur.
            </div>
            <StarRating value={reviewRating} onChange={setReviewRating} />
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Partagez votre expérience : qualité de la pose, ponctualité, accueil…"
              rows={3}
              className="w-full mt-3 rounded-[10px] px-3.5 py-3 text-[13.5px] leading-relaxed outline-none resize-y"
              style={{ border: "1px solid #EAEFED" }}
            />
            <div className="flex justify-end mt-3">
              <button
                onClick={handleSubmitReview}
                disabled={reviewRating === 0}
                className="rounded-[10px] px-5 py-2.5 font-bold text-[13.5px] text-white border-0 cursor-pointer disabled:cursor-not-allowed"
                style={{ background: reviewRating > 0 ? "#1D9E75" : "#cdd6d1", boxShadow: reviewRating > 0 ? "0 4px 12px rgba(29,158,117,.3)" : "none" }}
              >
                Publier mon avis
              </button>
            </div>
          </div>
        )}

        {req.reviewDone && (
          <div className="mt-3 rounded-[13px] px-4 py-3.5" style={{ background: "#fff", border: "1px solid #EAEFED" }}>
            <div className="flex items-center gap-2.5">
              <span className="text-[18px] tracking-widest" style={{ color: "#F5A623" }}>
                {"★".repeat(req.reviewRating ?? 0)}{"☆".repeat(5 - (req.reviewRating ?? 0))}
              </span>
              <span className="text-[12.5px] font-bold" style={{ color: "#0F5C44" }}>Avis publié — merci !</span>
            </div>
            {req.reviewText && (
              <div className="mt-2 text-[13.5px] leading-relaxed" style={{ color: "#3d4b44" }}>
                « {req.reviewText} »
              </div>
            )}
          </div>
        )}

        {/* Threads */}
        <div className="mt-4">
          <div className="text-[12px] font-bold uppercase tracking-wider mb-2.5" style={{ color: "#9aa39e" }}>
            Réparateurs en contact ({req.threads.length})
          </div>

          {req.threads.length === 0 ? (
            <div className="text-[13.5px] text-center rounded-[11px] p-3.5" style={{ color: "#6B7280", background: "#FAFBFB", border: "1px dashed #e2e8e4" }}>
              Aucun réparateur n'a encore débloqué votre demande.
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {req.threads.map((t) => (
                <ThreadRow
                  key={t.id}
                  thread={t}
                  reqStatus={req.status}
                  onOfferDecide={handleOfferDecide}
                  onChat={(thread) => setChatThread(thread)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

const INTERVENTION_LABELS: Record<string, string> = {
  remplacement: "Remplacement pare-brise",
  reparation: "Réparation d'impact",
  vitre: "Vitre latérale / custode",
};

const MY_REQUESTS_KEY = "mg_my_requests";

/* ─── Page ─── */
export default function MesDemandesPage() {
  const [requests, setRequests] = useState<MyRequest[]>([]);
  const [filter, setFilter] = useState<"toutes" | "actives" | "terminees">("toutes");

  useEffect(() => {
    async function load() {
      const auth = getAuth();

      // Si connecté → charger depuis Supabase
      if (auth?.id && auth.id !== "demo") {
        const { data: rows } = await supabase
          .from("demandes")
          .select(`
            id, title, city, intervention, status, accepted_repairer_id, created_at,
            threads ( id, repairer_id, last_message, offer_label, offer_status,
              profiles:repairer_id ( name, company ) )
          `)
          .eq("client_id", auth.id)
          .order("created_at", { ascending: false });

        if (rows) {
          const mapped: MyRequest[] = rows.map((r) => ({
            id: r.id,
            title: r.title,
            intervention: INTERVENTION_LABELS[r.intervention] ?? r.intervention,
            city: r.city,
            status: r.status as ReqStatus,
            acceptedGarage: r.accepted_repairer_id ?? undefined,
            threads: (r.threads ?? []).map((t: {
              id: string;
              repairer_id: string;
              last_message: string | null;
              offer_label: string | null;
              offer_status: string | null;
              profiles: { name: string | null; company: string | null }[];
            }) => {
              const profile = Array.isArray(t.profiles) ? t.profiles[0] : t.profiles;
              const label = (profile as { name?: string | null; company?: string | null } | null)?.company
                ?? (profile as { name?: string | null } | null)?.name
                ?? "Réparateur";
              return {
                id: t.id,
                garage: label,
                initials: label.substring(0, 2).toUpperCase(),
                lastMsg: t.last_message ?? "Nouveau contact",
                offer: t.offer_label ? { label: t.offer_label, status: (t.offer_status ?? "pending") as "pending" | "accepted" | "refused" } : undefined,
              };
            }),
          }));
          setRequests(mapped);
          return;
        }
      }

      // Fallback localStorage + SEED
      const stored = localStorage.getItem(MY_REQUESTS_KEY);
      let myReqs: MyRequest[] = stored ? (JSON.parse(stored) as MyRequest[]) : SEED;
      const localDemandes = getLocalDemandes().filter((d) => d.isLocal);
      const trackedIds = new Set(myReqs.map((r) => r.id));
      for (const d of localDemandes) {
        if (!trackedIds.has(d.id)) {
          myReqs = [{
            id: d.id,
            title: d.title,
            intervention: INTERVENTION_LABELS[d.intervention] ?? d.intervention,
            city: d.city,
            status: "active",
            threads: [],
          }, ...myReqs];
        }
      }
      setRequests(myReqs);
    }

    load();
    return onDemandesChange(load);
  }, []);

  const hasNoRequests = requests.length === 0;

  const filtered = requests.filter((r) => {
    if (filter === "actives")   return r.status === "active" || r.status === "attributed";
    if (filter === "terminees") return r.status === "aboutie" || r.status === "annulee";
    return true;
  });

  function updateRequest(updated: MyRequest) {
    setRequests((prev) => {
      const next = prev.map((r) => (r.id === updated.id ? updated : r));
      localStorage.setItem(MY_REQUESTS_KEY, JSON.stringify(next));
      return next;
    });
  }

  const countActive = requests.filter((r) => r.status === "active" || r.status === "attributed").length;

  return (
    <div className="min-h-screen" style={{ background: "#F4F6F5" }}>
      <Navbar />

      <main className="max-w-[760px] mx-auto px-6 pt-8 pb-16">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
          <div>
            <h1 className="m-0 text-[24px] font-extrabold tracking-tight">Mes demandes</h1>
            <p className="m-0 mt-1.5 text-[14px] font-medium" style={{ color: "#6B7280" }}>
              Suivez vos demandes, échangez avec les réparateurs et acceptez une offre.
            </p>
          </div>
          <Link href="/deposer" className="no-underline">
            <button
              className="inline-flex items-center gap-2 text-white rounded-[10px] px-4 py-2.5 font-bold text-[13.5px] border-0 cursor-pointer"
              style={{ background: "#1D9E75", boxShadow: "0 4px 12px rgba(29,158,117,.3)" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
              </svg>
              Nouvelle demande
            </button>
          </Link>
        </div>

        {hasNoRequests ? (
          /* ── Empty state ── */
          <div className="bg-white rounded-2xl p-12 text-center" style={{ border: "1px solid #EAEFED" }}>
            <span className="inline-flex w-16 h-16 rounded-2xl items-center justify-center mb-4" style={{ background: "#E8F6F0" }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                <path d="M4 6h16M4 12h16M4 18h10" stroke="#1D9E75" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </span>
            <h2 className="m-0 text-[20px] font-extrabold mb-2">Aucune demande pour l'instant</h2>
            <p className="m-0 text-[14px] leading-relaxed mb-6" style={{ color: "#6B7280" }}>
              Déposez votre première demande gratuitement. Les réparateurs de votre zone vous répondront rapidement.
            </p>
            <Link href="/deposer" className="no-underline">
              <button className="inline-flex items-center gap-2 text-white rounded-[11px] px-6 py-3 font-bold text-[14.5px] border-0 cursor-pointer" style={{ background: "#1D9E75", boxShadow: "0 4px 14px rgba(29,158,117,.35)" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2.4" strokeLinecap="round"/></svg>
                Déposer ma première demande
              </button>
            </Link>
          </div>
        ) : (
          /* ── Filters + Cards ── */
          <>
            <div className="flex gap-2 mb-5 flex-wrap">
              {([
                { id: "toutes",    label: `Toutes (${requests.length})` },
                { id: "actives",   label: `En cours (${countActive})` },
                { id: "terminees", label: "Terminées" },
              ] as const).map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className="rounded-[9px] px-3.5 py-2 text-[13px] font-bold border-0 cursor-pointer transition-all"
                  style={filter === f.id
                    ? { background: "#1D9E75", color: "#fff" }
                    : { background: "#fff", color: "#3d4b44", border: "1px solid #EAEFED" }
                  }
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-4">
              {filtered.length === 0 ? (
                <div className="bg-white rounded-2xl p-10 text-center" style={{ border: "1px solid #EAEFED" }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="mx-auto mb-3 opacity-30">
                    <path d="M9 12h6M12 9v6" stroke="#11211B" strokeWidth="1.8" strokeLinecap="round" />
                    <circle cx="12" cy="12" r="9" stroke="#11211B" strokeWidth="1.8" />
                  </svg>
                  <p className="m-0 text-[14px] font-semibold" style={{ color: "#6B7280" }}>Aucune demande dans cette catégorie.</p>
                  <Link href="/deposer" className="no-underline">
                    <button className="mt-4 text-white rounded-[10px] px-5 py-2.5 font-bold text-[13.5px] border-0 cursor-pointer" style={{ background: "#1D9E75" }}>
                      Déposer une demande
                    </button>
                  </Link>
                </div>
              ) : (
                filtered.map((req) => (
                  <RequestCard key={req.id} req={req} onUpdate={updateRequest} />
                ))
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
