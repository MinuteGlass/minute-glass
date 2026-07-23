"use client";

import { useState, useRef, useEffect } from "react";
import type { Demande } from "@/types";

function nowTime() {
  return new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

const CLIENT_REPLIES = [
  "Bonjour, merci pour votre message ! Quand seriez-vous disponible ?",
  "C'est noté. Est-ce que vous pouvez intervenir à mon domicile ?",
  "D'accord, je suis disponible en semaine à partir de 14h.",
  "Parfait, je vous attends. Merci beaucoup !",
];

type ChatMsg =
  | { id: number; kind: "text"; from: "partner" | "client"; text: string; time: string }
  | { id: number; kind: "devis"; prix: string; note: string; time: string; status: "pending" | "accepted" | "refused" };

export function ChatModal({
  demande,
  onClose,
  onAttributed,
  isBlocked,
}: {
  demande: Demande;
  onClose: () => void;
  onAttributed?: (id: string) => void;
  isBlocked?: boolean;
}) {
  const [messages, setMessages] = useState<ChatMsg[]>([
    { id: 1, kind: "text", from: "client", text: `Bonjour, je cherche un réparateur pour mon ${demande.title}. Êtes-vous disponible ?`, time: "10:24" },
  ]);
  const [input, setInput]         = useState("");
  const [replyIdx, setReplyIdx]   = useState(0);
  const [typing, setTyping]       = useState(false);
  const [showDevis, setShowDevis] = useState(false);
  const [devisPrix, setDevisPrix] = useState("");
  const [devisNote, setDevisNote] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing, showDevis]);
  useEffect(() => { if (!showDevis) inputRef.current?.focus(); }, [showDevis]);

  function triggerClientReply(delay = 1400) {
    if (replyIdx >= CLIENT_REPLIES.length) return;
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, kind: "text", from: "client", text: CLIENT_REPLIES[replyIdx], time: nowTime() },
      ]);
      setReplyIdx((i) => i + 1);
    }, delay);
  }

  function send() {
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { id: Date.now(), kind: "text", from: "partner", text, time: nowTime() }]);
    setInput("");
    triggerClientReply();
  }

  function sendDevis() {
    const prix = devisPrix.trim();
    if (!prix) return;
    const devisId = Date.now();
    setMessages((prev) => [...prev, { id: devisId, kind: "devis", prix, note: devisNote.trim(), time: nowTime(), status: "pending" }]);
    setDevisPrix(""); setDevisNote(""); setShowDevis(false);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const accepted = Math.random() > 0.3;
      setMessages((prev) =>
        prev.map((m) => m.id === devisId && m.kind === "devis" ? { ...m, status: accepted ? "accepted" : "refused" } : m)
      );
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          kind: "text",
          from: "client",
          text: accepted
            ? "Super, j'accepte votre devis ! On confirme le rendez-vous ?"
            : "Merci pour votre devis, mais c'est un peu au-dessus de mon budget. Pouvez-vous faire un geste ?",
          time: nowTime(),
        },
      ]);
      if (accepted) onAttributed?.(demande.id);
    }, 2200);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" style={{ background: "rgba(17,33,27,.55)" }} onClick={onClose}>
      <div
        className="w-full sm:max-w-[480px] bg-white sm:rounded-[20px] rounded-t-[20px] flex flex-col animate-mgPop"
        style={{ height: "min(92vh, 640px)", boxShadow: "0 24px 60px rgba(17,33,27,.22)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 flex-shrink-0" style={{ borderBottom: "1px solid #EAEFED" }}>
          <div className="w-10 h-10 rounded-[11px] flex items-center justify-center font-extrabold text-[14px] text-white flex-shrink-0" style={{ background: "linear-gradient(150deg,#1D9E75,#0F5C44)" }}>
            VP
          </div>
          <div className="flex-1 min-w-0">
            <span className="font-extrabold text-[14.5px]">Vitro Pro Lyon</span>
            <div className="flex items-center gap-1.5 text-[11.5px] font-semibold" style={{ color: "#1D9E75" }}>
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "#1D9E75" }} />
              En ligne
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <a href="tel:0684215509" className="w-9 h-9 rounded-[9px] flex items-center justify-center" style={{ background: "#E8F6F0" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 014 6a2 2 0 012-2" stroke="#1D9E75" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </a>
            <button onClick={onClose} className="w-9 h-9 rounded-full flex items-center justify-center border-0 cursor-pointer text-lg" style={{ background: "#F4F6F5", color: "#6B7280" }}>✕</button>
          </div>
        </div>

        {/* Context */}
        <div className="px-5 py-2 flex-shrink-0 flex items-center gap-3 flex-wrap" style={{ background: "#F4F6F5", borderBottom: "1px solid #EAEFED" }}>
          <div className="flex items-center gap-2 text-[12px] font-semibold" style={{ color: "#6B7280" }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M12 21s7-5.5 7-11a7 7 0 10-14 0c0 5.5 7 11 7 11Z" stroke="#9aa39e" strokeWidth="1.8"/><circle cx="12" cy="10" r="2.2" stroke="#9aa39e" strokeWidth="1.8"/></svg>
            {demande.city} · {demande.distance}
          </div>
          {demande.insurance === "avec"
            ? <span className="text-[11.5px] font-bold rounded-full px-2 py-0.5" style={{ background: "#E8F6F0", color: "#0F5C44" }}>Avec assurance</span>
            : <span className="text-[11.5px] font-bold rounded-full px-2 py-0.5" style={{ background: "#FCEDE7", color: "#B0431F" }}>Sans assurance</span>
          }
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
          {messages.map((msg) => {
            if (msg.kind === "devis") {
              return (
                <div key={msg.id} className="flex justify-end">
                  <div className="max-w-[85%] flex flex-col gap-1 items-end">
                    <div className="w-full rounded-[14px] overflow-hidden" style={{
                      border: msg.status === "accepted" ? "1.5px solid #1D9E75" : msg.status === "refused" ? "1.5px solid #D85A30" : "1.5px solid #EAEFED",
                      borderBottomRightRadius: 4,
                    }}>
                      <div className="px-4 py-2.5 flex items-center gap-2" style={{
                        background: msg.status === "accepted" ? "#E8F6F0" : msg.status === "refused" ? "#FCEDE7" : "#F4F6F5",
                      }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6Z" stroke={msg.status === "accepted" ? "#0F5C44" : msg.status === "refused" ? "#B0431F" : "#6B7280"} strokeWidth="1.8" strokeLinejoin="round"/>
                          <path d="M14 2v6h6M9 13h6M9 17h4" stroke={msg.status === "accepted" ? "#0F5C44" : msg.status === "refused" ? "#B0431F" : "#6B7280"} strokeWidth="1.8" strokeLinecap="round"/>
                        </svg>
                        <span className="font-extrabold text-[12.5px]" style={{
                          color: msg.status === "accepted" ? "#0F5C44" : msg.status === "refused" ? "#B0431F" : "#3d4b44",
                        }}>
                          {msg.status === "accepted" ? "✓ Devis accepté" : msg.status === "refused" ? "✗ Devis refusé" : "Devis envoyé"}
                        </span>
                        <span className="ml-auto text-[11px] font-semibold" style={{ color: "#9aa39e" }}>{msg.time}</span>
                      </div>
                      <div className="px-4 py-3 bg-white">
                        <div className="text-[28px] font-extrabold tracking-tight leading-none" style={{ color: "#11211B" }}>
                          {msg.prix} €
                          <span className="text-[13px] font-semibold ml-1.5" style={{ color: "#9aa39e" }}>TTC</span>
                        </div>
                        {msg.note && (
                          <p className="mt-1.5 text-[12.5px] font-medium leading-relaxed" style={{ color: "#6B7280" }}>{msg.note}</p>
                        )}
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold" style={{ color: "#9aa39e" }}>
                      {msg.status === "pending" ? "En attente de réponse du client…" : ""}
                    </span>
                  </div>
                </div>
              );
            }

            return (
              <div key={msg.id} className={`flex gap-2.5 ${msg.from === "partner" ? "flex-row-reverse" : ""}`}>
                {msg.from === "client" && (
                  <div className="w-7 h-7 rounded-full flex items-center justify-center font-extrabold text-[11px] text-white flex-shrink-0 mt-0.5" style={{ background: "linear-gradient(150deg,#6B7280,#3d4b44)" }}>
                    {demande.title[0]}
                  </div>
                )}
                <div className={`max-w-[72%] flex flex-col gap-0.5 ${msg.from === "partner" ? "items-end" : "items-start"}`}>
                  <div
                    className="rounded-[14px] px-3.5 py-2.5 text-[13.5px] font-medium leading-relaxed"
                    style={msg.from === "partner"
                      ? { background: "#1D9E75", color: "#fff", borderBottomRightRadius: 4 }
                      : { background: "#F4F6F5", color: "#11211B", borderBottomLeftRadius: 4 }
                    }
                  >
                    {msg.text}
                  </div>
                  <span className="text-[11px] font-semibold" style={{ color: "#9aa39e" }}>{msg.time}</span>
                </div>
              </div>
            );
          })}

          {typing && (
            <div className="flex gap-2.5">
              <div className="w-7 h-7 rounded-full flex items-center justify-center font-extrabold text-[11px] text-white flex-shrink-0" style={{ background: "linear-gradient(150deg,#6B7280,#3d4b44)" }}>
                {demande.title[0]}
              </div>
              <div className="rounded-[14px] px-4 py-3 flex items-center gap-1" style={{ background: "#F4F6F5", borderBottomLeftRadius: 4 }}>
                {[0, 1, 2].map((i) => (
                  <span key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: "#9aa39e", animation: `mgPulse 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Devis form */}
        {showDevis && (
          <div className="flex-shrink-0 px-4 pt-3 pb-2 animate-mgFade" style={{ borderTop: "2px solid #1D9E75", background: "#F6FBF9" }}>
            <div className="flex items-center justify-between mb-2.5">
              <span className="font-extrabold text-[13.5px]" style={{ color: "#0F5C44" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" className="inline mr-1.5 mb-0.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6Z" stroke="#0F5C44" strokeWidth="1.8" strokeLinejoin="round"/></svg>
                Envoyer un devis
              </span>
              <button onClick={() => setShowDevis(false)} className="text-[18px] border-0 bg-transparent cursor-pointer" style={{ color: "#9aa39e" }}>✕</button>
            </div>
            <div className="flex gap-2 mb-2">
              <div className="flex-1">
                <label className="block text-[11.5px] font-bold mb-1" style={{ color: "#6B7280" }}>Montant TTC *</label>
                <div className="flex items-center gap-1 rounded-[10px] px-3 py-2.5 bg-white" style={{ border: "1.5px solid #1D9E75" }}>
                  <input
                    type="number"
                    min="0"
                    value={devisPrix}
                    onChange={(e) => setDevisPrix(e.target.value)}
                    placeholder="250"
                    className="flex-1 bg-transparent border-0 outline-none text-[15px] font-extrabold w-full"
                    style={{ color: "#11211B" }}
                  />
                  <span className="font-extrabold text-[15px]" style={{ color: "#0F5C44" }}>€</span>
                </div>
              </div>
            </div>
            <div className="mb-3">
              <label className="block text-[11.5px] font-bold mb-1" style={{ color: "#6B7280" }}>Note ou détail (optionnel)</label>
              <textarea
                value={devisNote}
                onChange={(e) => setDevisNote(e.target.value)}
                placeholder="Ex : inclut pose + vitre OEM, déplacement offert…"
                rows={2}
                className="w-full rounded-[10px] px-3 py-2 text-[13px] font-medium outline-none resize-none bg-white"
                style={{ border: "1px solid #EAEFED" }}
              />
            </div>
            <button
              onClick={sendDevis}
              disabled={!devisPrix.trim()}
              className="w-full py-2.5 rounded-[10px] font-bold text-[13.5px] text-white border-0 cursor-pointer disabled:opacity-40 transition-opacity hover:opacity-90"
              style={{ background: "#1D9E75", boxShadow: "0 4px 12px rgba(29,158,117,.25)" }}
            >
              Envoyer le devis au client
            </button>
          </div>
        )}

        {/* Input bar */}
        {isBlocked ? (
          <div className="px-4 py-4 flex-shrink-0 text-center" style={{ borderTop: "1px solid #EAEFED", background: "#FAFBFB" }}>
            <div className="inline-flex items-center gap-2 rounded-[11px] px-4 py-3" style={{ background: "#FDE8E8", border: "1px solid #f8c8c8" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><rect x="5" y="11" width="14" height="9" rx="2" stroke="#D85A30" strokeWidth="2"/><path d="M8 11V8a4 4 0 018 0v3" stroke="#D85A30" strokeWidth="2" strokeLinecap="round"/></svg>
              <span className="text-[13px] font-bold" style={{ color: "#B0431F" }}>
                Cette demande a été attribuée à un autre réparateur — échanges bloqués.
              </span>
            </div>
          </div>
        ) : !showDevis && (
          <div className="px-4 pt-2.5 pb-3 flex-shrink-0" style={{ borderTop: "1px solid #EAEFED" }}>
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={() => setShowDevis(true)}
                className="inline-flex items-center gap-1.5 rounded-[9px] px-3 py-2 font-bold text-[12.5px] border-0 cursor-pointer whitespace-nowrap hover:opacity-90 transition-opacity flex-shrink-0"
                style={{ background: "#E8F6F0", color: "#0F5C44" }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6Z" stroke="#0F5C44" strokeWidth="1.8" strokeLinejoin="round"/>
                  <path d="M14 2v6h6M9 13h6M9 17h4" stroke="#0F5C44" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
                Envoyer un devis
              </button>
            </div>
            <div className="flex items-center gap-2 rounded-[13px] px-3.5 py-2" style={{ background: "#F4F6F5", border: "1px solid #EAEFED" }}>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Votre message…"
                className="flex-1 bg-transparent border-0 outline-none text-[14px] font-medium"
              />
              <button
                onClick={send}
                disabled={!input.trim()}
                className="w-8 h-8 rounded-[9px] flex items-center justify-center border-0 cursor-pointer disabled:opacity-40 transition-opacity"
                style={{ background: "#1D9E75" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7Z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            <p className="text-center text-[11px] font-semibold mt-1.5" style={{ color: "#9aa39e" }}>
              Répondez rapidement — ce client peut être contacté par d'autres réparateurs.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
