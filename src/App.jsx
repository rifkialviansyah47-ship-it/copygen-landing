import { useState, useMemo } from "react";
import {
  Zap, Check, ArrowRight, MessageCircle, Sparkles,
  PenTool, Film, Hash, Star, ShieldCheck,
} from "lucide-react";

/* ---------------- Generator logic (demo engine) ---------------- */
const TONE_OPENERS = {
  "Santai": "Eh, kalian udah tau belum...",
  "Persuasif": "Ini alasan kenapa kamu butuh ini...",
  "Lucu / Gaul": "Woy denger dulu ini penting!!",
};

function ctaLine(cta) {
  const map = {
    "Order sekarang": "🛒 Order sekarang, stok terbatas!",
    "DM untuk info": "📩 DM kita buat info lebih lanjut ya!",
  };
  return map[cta] || "🛒 Order sekarang!";
}

function buildDemoCaption({ brand, niche, usp, tone }) {
  const opener = TONE_OPENERS[tone] || TONE_OPENERS["Santai"];
  const uspList = usp ? usp.split(",").map((u) => u.trim()).filter(Boolean) : [];
  return [
    opener,
    `${brand || "Produk ini"}${niche ? `, ${niche.toLowerCase()}` : ""} hadir buat kamu.`,
    uspList.length ? uspList.map((u) => `✔️ ${u}`).join("\n") : "",
    "",
    ctaLine("Order sekarang"),
  ].filter(Boolean).join("\n");
}

/* ---------------- Small UI helpers ---------------- */
function SectionLabel({ children }) {
  return (
    <span className="text-[10px] font-mono uppercase tracking-widest text-[#d7ff3d]">
      {children}
    </span>
  );
}

function FeatureCard({ icon: Icon, title, desc }) {
  return (
    <div className="border border-[#2c2c29] bg-[#1a1a17] p-5">
      <Icon size={18} className="text-[#d7ff3d] mb-3" />
      <p className="font-black uppercase tracking-tight text-sm mb-1.5">{title}</p>
      <p className="text-xs text-[#8f8f89] leading-relaxed">{desc}</p>
    </div>
  );
}

/* ---------------- Main landing page ---------------- */
export default function CopyGenLanding() {
  const [demo, setDemo] = useState({ brand: "", niche: "", usp: "", tone: "Santai" });
  const set = (k) => (e) => setDemo((d) => ({ ...d, [k]: e.target.value }));
  const output = useMemo(() => buildDemoCaption(demo), [demo]);

  const waLink = "https://wa.me/6289670781401?text=" + encodeURIComponent("Halo, aku mau beli CopyGen — tool generator caption & script!");

  return (
    <div className="min-h-screen w-full bg-[#141412] text-[#f2f2ee] font-sans">
      {/* NAV */}
      <div className="border-b border-[#2c2c29]">
        <div className="max-w-5xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 border border-[#d7ff3d] flex items-center justify-center rotate-45">
              <Zap size={13} className="text-[#d7ff3d] -rotate-45" />
            </div>
            <span className="font-black uppercase tracking-tight text-sm">CopyGen</span>
          </div>
          <a
            href={waLink}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-mono uppercase tracking-wide px-3 py-1.5 border border-[#d7ff3d] text-[#d7ff3d] hover:bg-[#d7ff3d] hover:text-[#141412] transition-colors"
          >
            Beli sekarang
          </a>
        </div>
      </div>

      {/* HERO */}
      <div className="max-w-5xl mx-auto px-5 pt-14 pb-10 text-center">
        <div className="inline-flex items-center gap-1.5 border border-[#3a3a35] px-3 py-1 mb-5">
          <Sparkles size={12} className="text-[#d7ff3d]" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#8f8f89]">Tool digital, akses langsung</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight leading-[1.05] max-w-3xl mx-auto">
          Bikin Caption & Script Iklan Cuma Dalam 10 Detik
        </h1>
        <p className="text-[#8f8f89] mt-4 max-w-xl mx-auto text-sm sm:text-base">
          Gak perlu jago nulis. Isi brief produk, keluar caption + script video siap posting.
          Cocok buat seller online atau kamu yang mau buka jasa copywriting sendiri.
        </p>
        <div className="flex items-center justify-center gap-3 mt-7">
          <a
            href={waLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-[#d7ff3d] text-[#141412] font-black uppercase tracking-tight text-sm px-5 py-3 hover:bg-[#c2e836] transition-colors"
          >
            Beli akses lifetime <ArrowRight size={15} />
          </a>
        </div>
      </div>

      {/* LIVE DEMO */}
      <div className="max-w-5xl mx-auto px-5 pb-14">
        <div className="text-center mb-6">
          <SectionLabel>Coba dulu, gratis</SectionLabel>
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight mt-1">Rasain sendiri hasilnya</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4 border border-[#2c2c29] bg-[#1a1a17] p-5">
          <div className="space-y-3">
            <input
              value={demo.brand}
              onChange={set("brand")}
              placeholder="Nama produk / brand"
              className="w-full bg-[#141412] border border-[#3a3a35] px-3 py-2 text-sm focus:outline-none focus:border-[#d7ff3d] placeholder:text-[#5a5a55]"
            />
            <input
              value={demo.niche}
              onChange={set("niche")}
              placeholder="Niche, cth: skincare wajah"
              className="w-full bg-[#141412] border border-[#3a3a35] px-3 py-2 text-sm focus:outline-none focus:border-[#d7ff3d] placeholder:text-[#5a5a55]"
            />
            <input
              value={demo.usp}
              onChange={set("usp")}
              placeholder="Poin jual, pisah koma"
              className="w-full bg-[#141412] border border-[#3a3a35] px-3 py-2 text-sm focus:outline-none focus:border-[#d7ff3d] placeholder:text-[#5a5a55]"
            />
            <select
              value={demo.tone}
              onChange={set("tone")}
              className="w-full bg-[#141412] border border-[#3a3a35] px-3 py-2 text-sm focus:outline-none focus:border-[#d7ff3d]"
            >
              {Object.keys(TONE_OPENERS).map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="border border-dashed border-[#3a3a35] p-4 relative">
            <span className="absolute -top-2.5 left-3 bg-[#1a1a17] px-1.5 text-[10px] font-mono uppercase text-[#8f8f89]">Preview</span>
            <pre className="text-sm whitespace-pre-wrap font-sans leading-relaxed">{output}</pre>
          </div>
        </div>
        <p className="text-center text-[11px] font-mono text-[#5a5a55] mt-3">
          Ini baru 1 dari 3 varian caption. Versi lengkap: 3 caption + script video + hashtag otomatis.
        </p>
      </div>

      {/* FEATURES */}
      <div className="max-w-5xl mx-auto px-5 pb-14">
        <div className="text-center mb-6">
          <SectionLabel>Apa yang kamu dapat</SectionLabel>
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight mt-1">Fitur lengkap versi penuh</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <FeatureCard icon={PenTool} title="3 Varian Caption" desc="Angle beda-beda: perkenalan, problem-solution, FOMO — tinggal pilih yang paling cocok." />
          <FeatureCard icon={Film} title="Script Video Otomatis" desc="Struktur hook-isi-CTA siap dipakai buat Reels/TikTok, tinggal syuting." />
          <FeatureCard icon={Hash} title="Hashtag Relevan" desc="Otomatis nyesuain sama niche produk kamu, gak perlu riset manual." />
        </div>
      </div>

      {/* PRICING */}
      <div className="max-w-3xl mx-auto px-5 pb-16">
        <div className="border border-[#d7ff3d] bg-[#1a1a17] p-7 text-center">
          <p className="text-[10px] font-mono uppercase tracking-widest text-[#8f8f89] mb-2">Akses lifetime</p>
          <p className="text-4xl font-black">Rp99.000</p>
          <p className="text-xs text-[#8f8f89] mt-1">bayar sekali, pakai selamanya — gak ada biaya bulanan</p>
          <div className="text-left max-w-xs mx-auto mt-6 space-y-2">
            {[
              "Generator caption + script + hashtag",
              "Bisa dipakai unlimited untuk niche apa aja",
              "Cocok buat kelola toko sendiri atau jasa copywriting",
              "Update fitur gratis selanjutnya",
            ].map((f) => (
              <div key={f} className="flex items-start gap-2 text-sm">
                <Check size={14} className="text-[#d7ff3d] mt-0.5 shrink-0" />
                <span>{f}</span>
              </div>
            ))}
          </div>
          <a
            href={waLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-[#d7ff3d] text-[#141412] font-black uppercase tracking-tight text-sm px-6 py-3 mt-7 hover:bg-[#c2e836] transition-colors"
          >
            <MessageCircle size={15} /> Order via WhatsApp
          </a>
          <div className="flex items-center justify-center gap-1.5 mt-4 text-[11px] font-mono text-[#5a5a55]">
            <ShieldCheck size={12} /> pembayaran aman, akses dikirim langsung setelah bayar
          </div>
        </div>
      </div>

      {/* SOCIAL PROOF placeholder */}
      <div className="max-w-3xl mx-auto px-5 pb-16 text-center">
        <div className="flex items-center justify-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => <Star key={i} size={14} className="text-[#d7ff3d] fill-[#d7ff3d]" />)}
        </div>
        <p className="text-sm text-[#8f8f89] italic max-w-md mx-auto">
          "Hemat waktu banget, biasanya 30 menit mikir caption sekarang tinggal isi form."
        </p>
      </div>

      {/* FOOTER CTA */}
      <div className="border-t border-[#2c2c29] py-8 text-center">
        <p className="text-xs font-mono text-[#5a5a55]">CopyGen — tool caption & script generator</p>
      </div>
    </div>
  );
}
