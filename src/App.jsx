import { useState, useMemo, useEffect } from "react";
import {
  Zap, Check, ArrowRight, MessageCircle, Sparkles,
  PenTool, Film, Hash, Star, ShieldCheck, Lock, Copy, ArrowLeft,
} from "lucide-react";

/* =========================================================
   GANTI DI SINI: kode akses yang kamu kirim ke pembeli
   ========================================================= */
const ACCESS_CODE = "COPYGEN99";

/* ---------------- Demo engine (buat landing page) ---------------- */
const TONE_OPENERS_DEMO = {
  "Santai": "Eh, kalian udah tau belum...",
  "Persuasif": "Ini alasan kenapa kamu butuh ini...",
  "Lucu / Gaul": "Woy denger dulu ini penting!!",
};

function ctaLineDemo(cta) {
  const map = {
    "Order sekarang": "🛒 Order sekarang, stok terbatas!",
    "DM untuk info": "📩 DM kita buat info lebih lanjut ya!",
  };
  return map[cta] || "🛒 Order sekarang!";
}

function buildDemoCaption({ brand, niche, usp, tone }) {
  const opener = TONE_OPENERS_DEMO[tone] || TONE_OPENERS_DEMO["Santai"];
  const uspList = usp ? usp.split(",").map((u) => u.trim()).filter(Boolean) : [];
  return [
    opener,
    `${brand || "Produk ini"}${niche ? `, ${niche.toLowerCase()}` : ""} hadir buat kamu.`,
    uspList.length ? uspList.map((u) => `✔️ ${u}`).join("\n") : "",
    "",
    ctaLineDemo("Order sekarang"),
  ].filter(Boolean).join("\n");
}

/* ---------------- Full generator engine (buat tool asli, di balik gate) ---------------- */
const TONES = ["Santai", "Persuasif", "Elegan", "Lucu / Gaul", "Profesional"];
const PLATFORMS = ["Instagram", "TikTok", "Umum"];
const CTAS = ["Order sekarang", "DM untuk info", "Follow buat update", "Klik link di bio"];

const TONE_OPENERS = {
  "Santai": ["Eh, kalian udah tau belum...", "Random tapi penting nih...", "Jadi gini ceritanya..."],
  "Persuasif": ["Ini alasan kenapa kamu butuh...", "Jangan sampai kelewatan...", "Fakta yang wajib kamu tau..."],
  "Elegan": ["Kehadiran yang berbeda dimulai dari sini.", "Detail kecil, hasil yang besar.", "Sesuatu yang layak kamu miliki."],
  "Lucu / Gaul": ["Woy denger dulu ini penting!!", "Ga nyangka ternyata ada yang kayak gini...", "Plot twist nih guys..."],
  "Profesional": ["Memperkenalkan solusi untuk kebutuhan Anda.", "Kualitas yang dapat diandalkan.", "Pilihan tepat untuk Anda."],
};

const TONE_CLOSERS = {
  "Santai": "yuk cus dicoba, ga bakal nyesel!",
  "Persuasif": "jangan tunggu sampai kehabisan, ambil sekarang.",
  "Elegan": "karena kamu pantas mendapatkan yang terbaik.",
  "Lucu / Gaul": "buruan gaskeun sebelum keabisan wkwk",
  "Profesional": "kami siap membantu Anda kapan saja.",
};

function ctaLine(cta) {
  const map = {
    "Order sekarang": "🛒 Order sekarang, stok terbatas!",
    "DM untuk info": "📩 DM kita buat info lebih lanjut ya!",
    "Follow buat update": "🔔 Follow biar gak ketinggalan update terbaru!",
    "Klik link di bio": "🔗 Klik link di bio buat langsung checkout!",
  };
  return map[cta] || "🛒 Order sekarang!";
}

function buildCaptions({ brand, niche, usp, tone, cta, audience }) {
  const openers = TONE_OPENERS[tone] || TONE_OPENERS["Santai"];
  const closer = TONE_CLOSERS[tone] || TONE_CLOSERS["Santai"];
  const uspList = usp ? usp.split(",").map((u) => u.trim()).filter(Boolean) : [];
  const audienceLine = audience ? ` buat kamu yang ${audience.toLowerCase()}` : "";

  const angle1 = [
    openers[0],
    `${brand || "Produk ini"}${niche ? `, ${niche.toLowerCase()}` : ""} hadir${audienceLine}.`,
    uspList.length ? uspList.map((u) => `✔️ ${u}`).join("\n") : "",
    closer,
    "",
    ctaLine(cta),
  ].filter(Boolean).join("\n");

  const angle2 = [
    `Masalah: susah nemu ${niche || "produk"} yang pas?`,
    openers[1] || openers[0],
    `${brand || "Kami"} jawab kebutuhan itu dengan ${uspList[0] ? uspList[0].toLowerCase() : "kualitas terbaik"}.`,
    uspList.slice(1).length ? uspList.slice(1).map((u) => `+ ${u}`).join("\n") : "",
    closer,
    "",
    ctaLine(cta),
  ].filter(Boolean).join("\n");

  const angle3 = [
    openers[2] || openers[0],
    `Buruan sebelum kehabisan — ${brand || "produk ini"} lagi diminati banget${audienceLine}.`,
    uspList.length ? `Kenapa banyak yang pilih ini?\n${uspList.map((u) => `• ${u}`).join("\n")}` : "",
    closer,
    "",
    ctaLine(cta),
  ].filter(Boolean).join("\n");

  return [
    { label: "Angle 1 — Perkenalan", text: angle1 },
    { label: "Angle 2 — Problem/Solution", text: angle2 },
    { label: "Angle 3 — FOMO/Urgency", text: angle3 },
  ];
}

function buildScript({ brand, niche, usp, tone, cta, audience, platform }) {
  const opener = (TONE_OPENERS[tone] || TONE_OPENERS["Santai"])[0];
  const uspList = usp ? usp.split(",").map((u) => u.trim()).filter(Boolean) : [];
  const dur = platform === "TikTok" ? "15-30 detik" : platform === "Instagram" ? "20-40 detik" : "20-30 detik";

  return {
    hook: `[0-3 detik] ${opener} ${niche ? `Ini tentang ${niche.toLowerCase()}.` : ""}`,
    isi: [
      `[Isi, ${dur}]`,
      `Perkenalkan ${brand || "produk ini"}${audience ? ` buat kamu yang ${audience.toLowerCase()}` : ""}.`,
      uspList.length ? uspList.map((u, i) => `${i + 1}. ${u}`).join("\n") : "Tunjukkan produk dari beberapa sudut / demo pemakaian.",
    ].join("\n"),
    cta: `[Penutup] ${ctaLine(cta)}`,
  };
}

function buildHashtags({ niche, brand, platform }) {
  const base = platform === "TikTok"
    ? ["fyp", "fypage", "produklokal", "rekomendasiproduk"]
    : ["explorepage", "produklokal", "rekomendasi", "ootd"];
  const dyn = [];
  if (brand) dyn.push(brand.toLowerCase().replace(/\s+/g, ""));
  if (niche) niche.split(" ").forEach((w) => w && dyn.push(w.toLowerCase().replace(/[^a-z0-9]/g, "")));
  return [...new Set([...dyn, ...base])].slice(0, 10).map((t) => `#${t}`).join(" ");
}

/* ---------------- Small UI helpers ---------------- */
function SectionLabel({ children }) {
  return <span className="text-[10px] font-mono uppercase tracking-widest text-[#d7ff3d]">{children}</span>;
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

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono uppercase tracking-wide border border-[#3a3a35] text-[#d7ff3d] hover:bg-[#d7ff3d] hover:text-[#141412] transition-colors shrink-0"
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? "Tersalin" : "Salin"}
    </button>
  );
}

/* ---------------- Halaman: Landing (publik) ---------------- */
function LandingPage({ lynkLink, waLink, goToAkses }) {
  const [demo, setDemo] = useState({ brand: "", niche: "", usp: "", tone: "Santai" });
  const set = (k) => (e) => setDemo((d) => ({ ...d, [k]: e.target.value }));
  const output = useMemo(() => buildDemoCaption(demo), [demo]);

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
            href={lynkLink}
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
            href={lynkLink}
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
            <input value={demo.brand} onChange={set("brand")} placeholder="Nama produk / brand"
              className="w-full bg-[#141412] border border-[#3a3a35] px-3 py-2 text-sm focus:outline-none focus:border-[#d7ff3d] placeholder:text-[#5a5a55]" />
            <input value={demo.niche} onChange={set("niche")} placeholder="Niche, cth: skincare wajah"
              className="w-full bg-[#141412] border border-[#3a3a35] px-3 py-2 text-sm focus:outline-none focus:border-[#d7ff3d] placeholder:text-[#5a5a55]" />
            <input value={demo.usp} onChange={set("usp")} placeholder="Poin jual, pisah koma"
              className="w-full bg-[#141412] border border-[#3a3a35] px-3 py-2 text-sm focus:outline-none focus:border-[#d7ff3d] placeholder:text-[#5a5a55]" />
            <select value={demo.tone} onChange={set("tone")}
              className="w-full bg-[#141412] border border-[#3a3a35] px-3 py-2 text-sm focus:outline-none focus:border-[#d7ff3d]">
              {Object.keys(TONE_OPENERS_DEMO).map((t) => <option key={t} value={t}>{t}</option>)}
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
      <div className="max-w-3xl mx-auto px-5 pb-10">
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
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-7">
            <a href={lynkLink} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 bg-[#d7ff3d] text-[#141412] font-black uppercase tracking-tight text-sm px-6 py-3 hover:bg-[#c2e836] transition-colors">
              <Zap size={15} /> Beli & Bayar Sekarang
            </a>
            <a href={waLink} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 border border-[#3a3a35] text-[#f2f2ee] font-black uppercase tracking-tight text-sm px-6 py-3 hover:border-[#d7ff3d] hover:text-[#d7ff3d] transition-colors">
              <MessageCircle size={15} /> Tanya Dulu
            </a>
          </div>
          <div className="flex items-center justify-center gap-1.5 mt-4 text-[11px] font-mono text-[#5a5a55]">
            <ShieldCheck size={12} /> pembayaran otomatis via lynk.id, kode akses dikirim setelah bayar
          </div>
        </div>
      </div>

      {/* SUDAH BAYAR */}
      <div className="max-w-3xl mx-auto px-5 pb-14 text-center">
        <button
          onClick={goToAkses}
          className="text-xs font-mono uppercase tracking-wide text-[#8f8f89] hover:text-[#d7ff3d] transition-colors underline underline-offset-4"
        >
          Sudah bayar? Masuk ke tool di sini →
        </button>
      </div>

      {/* SOCIAL PROOF */}
      <div className="max-w-3xl mx-auto px-5 pb-16 text-center">
        <div className="flex items-center justify-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => <Star key={i} size={14} className="text-[#d7ff3d] fill-[#d7ff3d]" />)}
        </div>
        <p className="text-sm text-[#8f8f89] italic max-w-md mx-auto">
          "Hemat waktu banget, biasanya 30 menit mikir caption sekarang tinggal isi form."
        </p>
      </div>

      <div className="border-t border-[#2c2c29] py-8 text-center">
        <p className="text-xs font-mono text-[#5a5a55]">CopyGen — tool caption & script generator</p>
      </div>
    </div>
  );
}

/* ---------------- Halaman: Gate kode akses ---------------- */
function AccessGate({ onUnlock, goBack }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);

  const submit = () => {
    if (code.trim().toUpperCase() === ACCESS_CODE.toUpperCase()) {
      setError(false);
      onUnlock();
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#141412] text-[#f2f2ee] font-sans flex items-center justify-center px-5">
      <div className="w-full max-w-sm border border-[#2c2c29] bg-[#1a1a17] p-7 text-center">
        <div className="h-10 w-10 border border-[#d7ff3d] flex items-center justify-center rotate-45 mx-auto mb-4">
          <Lock size={16} className="text-[#d7ff3d] -rotate-45" />
        </div>
        <p className="font-black uppercase tracking-tight text-lg mb-1">Masukin Kode Akses</p>
        <p className="text-xs text-[#8f8f89] mb-5">Kode dikirim otomatis setelah pembayaran di lynk.id</p>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Kode akses"
          className="w-full bg-[#141412] border border-[#3a3a35] px-3 py-2.5 text-sm text-center tracking-widest uppercase focus:outline-none focus:border-[#d7ff3d] placeholder:text-[#5a5a55] placeholder:normal-case placeholder:tracking-normal"
        />
        {error && <p className="text-[#ff5c5c] text-xs mt-2">Kode salah, coba cek lagi ya.</p>}
        <button
          onClick={submit}
          className="w-full bg-[#d7ff3d] text-[#141412] font-black uppercase tracking-tight text-sm px-5 py-3 mt-4 hover:bg-[#c2e836] transition-colors"
        >
          Buka Tool
        </button>
        <button
          onClick={goBack}
          className="flex items-center gap-1 justify-center text-[11px] font-mono text-[#5a5a55] hover:text-[#8f8f89] transition-colors mt-4 mx-auto"
        >
          <ArrowLeft size={12} /> kembali ke halaman utama
        </button>
      </div>
    </div>
  );
}

/* ---------------- Halaman: Tool asli (setelah unlock) ---------------- */
function GeneratorTool({ goBack }) {
  const [form, setForm] = useState({
    brand: "", niche: "", usp: "", tone: "Santai", platform: "Instagram", cta: "Order sekarang", audience: "",
  });
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const captions = useMemo(() => buildCaptions(form), [form]);
  const script = useMemo(() => buildScript(form), [form]);
  const hashtags = useMemo(() => buildHashtags(form), [form]);

  return (
    <div className="min-h-screen w-full bg-[#141412] text-[#f2f2ee] font-sans">
      <div className="max-w-6xl mx-auto px-5 py-10">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 border border-[#d7ff3d] flex items-center justify-center rotate-45">
              <PenTool size={15} className="text-[#d7ff3d] -rotate-45" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">CopyGen</h1>
          </div>
          <button onClick={goBack} className="flex items-center gap-1 text-[11px] font-mono text-[#8f8f89] hover:text-[#d7ff3d] transition-colors">
            <ArrowLeft size={12} /> keluar
          </button>
        </div>
        <p className="text-[#8f8f89] text-sm font-mono mb-8 pl-11">isi brief produk → caption + script + hashtag otomatis</p>

        <div className="grid md:grid-cols-[380px_1fr] gap-6">
          <div className="border border-[#2c2c29] bg-[#1a1a17] p-5 space-y-4 h-fit">
            <div>
              <label className="text-[10px] font-mono uppercase tracking-widest text-[#8f8f89]">Brand / nama produk</label>
              <input value={form.brand} onChange={set("brand")} placeholder="cth: Warung Sambal Bu Rina"
                className="w-full mt-1 bg-[#141412] border border-[#3a3a35] px-3 py-2 text-sm focus:outline-none focus:border-[#d7ff3d] placeholder:text-[#5a5a55]" />
            </div>
            <div>
              <label className="text-[10px] font-mono uppercase tracking-widest text-[#8f8f89]">Niche / kategori</label>
              <input value={form.niche} onChange={set("niche")} placeholder="cth: sambal kemasan pedas"
                className="w-full mt-1 bg-[#141412] border border-[#3a3a35] px-3 py-2 text-sm focus:outline-none focus:border-[#d7ff3d] placeholder:text-[#5a5a55]" />
            </div>
            <div>
              <label className="text-[10px] font-mono uppercase tracking-widest text-[#8f8f89]">Poin jual (pisah koma)</label>
              <textarea value={form.usp} onChange={set("usp")} placeholder="cth: tanpa pengawet, pedas nampol" rows={3}
                className="w-full mt-1 bg-[#141412] border border-[#3a3a35] px-3 py-2 text-sm focus:outline-none focus:border-[#d7ff3d] placeholder:text-[#5a5a55] resize-none" />
            </div>
            <div>
              <label className="text-[10px] font-mono uppercase tracking-widest text-[#8f8f89]">Target audience (opsional)</label>
              <input value={form.audience} onChange={set("audience")} placeholder="cth: suka pedas & praktis"
                className="w-full mt-1 bg-[#141412] border border-[#3a3a35] px-3 py-2 text-sm focus:outline-none focus:border-[#d7ff3d] placeholder:text-[#5a5a55]" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-[#8f8f89]">Tone</label>
                <select value={form.tone} onChange={set("tone")}
                  className="w-full mt-1 bg-[#141412] border border-[#3a3a35] px-3 py-2 text-sm focus:outline-none focus:border-[#d7ff3d]">
                  {TONES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-[#8f8f89]">Platform</label>
                <select value={form.platform} onChange={set("platform")}
                  className="w-full mt-1 bg-[#141412] border border-[#3a3a35] px-3 py-2 text-sm focus:outline-none focus:border-[#d7ff3d]">
                  {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-[10px] font-mono uppercase tracking-widest text-[#8f8f89]">CTA</label>
              <select value={form.cta} onChange={set("cta")}
                className="w-full mt-1 bg-[#141412] border border-[#3a3a35] px-3 py-2 text-sm focus:outline-none focus:border-[#d7ff3d]">
                {CTAS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-5">
            <div className="border border-[#2c2c29] bg-[#1a1a17] p-5">
              <div className="flex items-center gap-1.5 mb-4">
                <PenTool size={14} className="text-[#d7ff3d]" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#d7ff3d]">3 Varian Caption</span>
              </div>
              <div className="space-y-4">
                {captions.map((c) => (
                  <div key={c.label} className="border-l-2 border-[#d7ff3d] pl-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-mono text-[#8f8f89] uppercase tracking-wide">{c.label}</span>
                      <CopyButton text={c.text} />
                    </div>
                    <pre className="text-sm leading-relaxed whitespace-pre-wrap font-sans">{c.text}</pre>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-[#2c2c29] bg-[#1a1a17] p-5">
              <div className="flex items-center gap-1.5 mb-4">
                <Film size={14} className="text-[#d7ff3d]" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#d7ff3d]">Script Video</span>
              </div>
              <div className="space-y-3">
                {[{ label: "Hook", text: script.hook }, { label: "Isi", text: script.isi }, { label: "CTA", text: script.cta }].map((s) => (
                  <div key={s.label} className="border-l-2 border-[#d7ff3d] pl-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-mono text-[#8f8f89] uppercase tracking-wide">{s.label}</span>
                      <CopyButton text={s.text} />
                    </div>
                    <pre className="text-sm leading-relaxed whitespace-pre-wrap font-sans">{s.text}</pre>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-[#2c2c29] bg-[#1a1a17] p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#8f8f89]">Hashtag</span>
                <CopyButton text={hashtags} />
              </div>
              <p className="text-sm leading-relaxed text-[#d7ff3d]">{hashtags}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Root: nentuin halaman mana yang tampil ---------------- */
export default function App() {
  const [view, setView] = useState(() =>
    typeof window !== "undefined" && window.location.hash === "#akses" ? "gate" : "landing"
  );

  useEffect(() => {
    if (view === "gate") window.location.hash = "akses";
    else if (view === "landing") window.location.hash = "";
  }, [view]);

  // kalau udah pernah buka tool di browser ini, langsung skip gate
  useEffect(() => {
    try {
      if (localStorage.getItem("copygen_unlocked") === "1" && window.location.hash === "#akses") {
        setView("tool");
      }
    } catch (e) {}
  }, []);

  const waLink = "https://wa.me/6281234567890?text=" + encodeURIComponent("Halo, aku mau tanya-tanya soal CopyGen dulu ya!");
  const lynkLink = "https://lynk.id/rifkial23";

  if (view === "tool") {
    return <GeneratorTool goBack={() => setView("landing")} />;
  }
  if (view === "gate") {
    return (
      <AccessGate
        goBack={() => setView("landing")}
        onUnlock={() => {
          try { localStorage.setItem("copygen_unlocked", "1"); } catch (e) {}
          setView("tool");
        }}
      />
    );
  }
  return <LandingPage lynkLink={lynkLink} waLink={waLink} goToAkses={() => setView("gate")} />;
}
