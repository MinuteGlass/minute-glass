export function AdBannerPartner() {
  return (
    <div
      className="flex items-center gap-3.5 rounded-[14px] px-5 py-4 text-white overflow-hidden relative"
      style={{ background: "linear-gradient(100deg,#0F5C44,#1D9E75)" }}
    >
      <span className="absolute top-2 right-3 text-[10px] font-bold tracking-widest uppercase opacity-60">
        Publicité
      </span>
      <span
        className="flex-shrink-0 w-[46px] h-[46px] rounded-[12px] inline-flex items-center justify-center"
        style={{ background: "rgba(255,255,255,.16)" }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M3 7l9-4 9 4v10l-9 4-9-4V7Z" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M3 7l9 4 9-4M12 11v10" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      </span>
      <div className="flex-1">
        <div className="font-extrabold text-[15px]">GlassPro Distribution — Pare-brise OEM</div>
        <div className="text-[13px] opacity-85 mt-0.5">Livraison 24h sur tout Rhône-Alpes · Tarifs partenaires Minute Glass</div>
      </div>
      <button
        className="bg-white rounded-[9px] px-[15px] py-[9px] font-bold text-[13px] cursor-pointer border-0 whitespace-nowrap"
        style={{ color: "#0F5C44" }}
      >
        Découvrir
      </button>
    </div>
  );
}

export function AdSidebarTop() {
  return (
    <div
      className="rounded-[14px] bg-white flex flex-col items-center justify-center gap-1.5 h-[150px]"
      style={{ border: "1px dashed #d2dad5", color: "#9aa39e" }}
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path d="M4 5h16v14H4z" stroke="#c2ccc6" strokeWidth="1.6" />
        <path d="M4 15l4-4 3 3 4-5 5 6" stroke="#c2ccc6" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
      <span className="text-[11px] font-bold">Publicité · 300×250</span>
    </div>
  );
}

export function AdSidebarPromo() {
  return (
    <div
      className="rounded-[14px] h-[236px] p-5 text-white flex flex-col justify-between relative overflow-hidden"
      style={{ background: "linear-gradient(155deg,#D85A30,#b0431f)" }}
    >
      <span className="absolute top-2.5 right-3 text-[9.5px] font-bold tracking-widest uppercase opacity-60">
        Publicité
      </span>
      <div>
        <div className="font-extrabold text-[18px] leading-tight">Vous êtes réparateur&nbsp;?</div>
        <div className="text-[13px] opacity-90 mt-2 leading-relaxed">
          Recevez les demandes de votre zone en temps réel. 2 jetons offerts à l'inscription.
        </div>
      </div>
      <button
        className="bg-white rounded-[10px] py-[11px] font-bold text-[13.5px] cursor-pointer border-0 w-full"
        style={{ color: "#b0431f" }}
      >
        Rejoindre le réseau
      </button>
    </div>
  );
}

export function AdSidebarBottom() {
  return (
    <div
      className="rounded-[14px] bg-white h-[72px] flex items-center justify-center text-[11px] font-bold"
      style={{ border: "1px dashed #d2dad5", color: "#9aa39e" }}
    >
      Publicité · 320×60
    </div>
  );
}
