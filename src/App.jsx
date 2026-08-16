import { useState, useMemo, useEffect, useRef } from "react";
import {
  Zap, Check, ArrowRight, MessageCircle, Sparkles,
  PenTool, Film, Hash, Star, ShieldCheck, Lock, Copy, ArrowLeft, Loader2,
} from "lucide-react";

async function translateToEn(text) {
  if (!text || !text.trim()) return text;
  try {
    const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=id|en`);
    const data = await res.json();
    return data?.responseData?.translatedText || text;
  } catch (e) {
    return text;
  }
}

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
const TONE_KEYS = ["santai", "persuasif", "elegan", "gaul", "profesional"];
const TONE_LABELS = {
  id: { santai: "Santai", persuasif: "Persuasif", elegan: "Elegan", gaul: "Lucu / Gaul", profesional: "Profesional" },
  en: { santai: "Casual", persuasif: "Persuasive", elegan: "Elegant", gaul: "Fun / Playful", profesional: "Professional" },
};
const PLATFORMS = ["Instagram", "TikTok", "Umum"];
const CTA_KEYS = ["order", "dm", "follow", "link", "comment", "save"];
const CTA_LABELS = {
  id: { order: "Order sekarang", dm: "DM untuk info", follow: "Follow buat update", link: "Klik link di bio", comment: "Komen di bawah", save: "Save biar gak lupa" },
  en: { order: "Order now", dm: "DM for info", follow: "Follow for updates", link: "Click link in bio", comment: "Comment below", save: "Save for later" },
};

const OPENERS = {
  id: {
    santai: ["Eh, kalian udah tau belum...", "Random tapi penting nih...", "Jadi gini ceritanya...", "Gaes, ada info penting nih...", "Btw, ini wajib kalian tau...", "Denger-denger nih..."],
    persuasif: ["Ini alasan kenapa kamu butuh...", "Jangan sampai kelewatan...", "Fakta yang wajib kamu tau...", "Perhatikan ini baik-baik...", "Sebelum kamu lanjut scroll...", "Ini penting buat kamu tau..."],
    elegan: ["Kehadiran yang berbeda dimulai dari sini.", "Detail kecil, hasil yang besar.", "Sesuatu yang layak kamu miliki.", "Kualitas berbicara lebih dari kata-kata.", "Bukan sekadar produk biasa.", "Ada alasan kenapa ini berbeda."],
    gaul: ["Woy denger dulu ini penting!!", "Ga nyangka ternyata ada yang kayak gini...", "Plot twist nih guys...", "Sumpah ini worth it banget...", "Gila sih ini beneran ada...", "Anjay ini keren parah..."],
    profesional: ["Memperkenalkan solusi untuk kebutuhan Anda.", "Kualitas yang dapat diandalkan.", "Pilihan tepat untuk Anda.", "Solusi terpercaya untuk kebutuhan sehari-hari.", "Hadir untuk menjawab kebutuhan Anda.", "Standar kualitas yang teruji."],
  },
  en: {
    santai: ["Hey, did you know...", "Random but important...", "So here's the thing...", "Guys, important info...", "By the way, you should know this...", "Heard about this yet..."],
    persuasif: ["Here's why you need this...", "Don't miss this out...", "Facts you need to know...", "Pay attention to this...", "Before you keep scrolling...", "This matters for you..."],
    elegan: ["A different presence starts here.", "Small details, big results.", "Something worth having.", "Quality speaks louder than words.", "Not just another product.", "There's a reason this stands out."],
    gaul: ["Yo listen up, this matters!!", "Didn't expect something like this...", "Plot twist, guys...", "Ngl this is so worth it...", "This actually exists, wild...", "Okay this is actually fire..."],
    profesional: ["Introducing a solution for your needs.", "Reliable quality you can trust.", "The right choice for you.", "A trusted solution for everyday needs.", "Here to answer your needs.", "A proven standard of quality."],
  },
};

const CLOSERS = {
  id: {
    santai: ["yuk cus dicoba, ga bakal nyesel!", "gampang kok order-nya, tinggal klik aja!", "udah banyak yang cobain, giliran kamu sekarang!", "coba deh sekali, pasti ketagihan!", "gak ribet kok, tinggal order aja!", "worth it banget buat dicoba!"],
    persuasif: ["jangan tunggu sampai kehabisan, ambil sekarang.", "keputusan yang gak bakal kamu sesali.", "kesempatan kayak gini gak dateng dua kali.", "lebih cepat kamu ambil, lebih cepat kamu ngerasain manfaatnya.", "ini investasi kecil buat hasil yang besar.", "orang lain udah buktiin, giliran kamu sekarang."],
    elegan: ["karena kamu pantas mendapatkan yang terbaik.", "detail sekecil ini yang bikin bedanya.", "pilihan yang selalu tepat, kapan pun dipakai.", "kualitas yang akan selalu kamu hargai.", "sebuah pilihan yang mencerminkan selera kamu.", "kesempurnaan ada di detail-detail kecil."],
    gaul: ["buruan gaskeun sebelum keabisan wkwk", "dijamin bikin ketagihan, jangan salahin kita ya", "udah, gausah mikir lama-lama, cobain aja dulu", "beneran gak nyesel deh, percaya deh", "cobain aja, dijamin auto suka", "gaskeun sebelum kehabisan stok!"],
    profesional: ["kami siap membantu Anda kapan saja.", "kualitas yang telah teruji dan dipercaya.", "solusi yang tepat untuk kebutuhan Anda.", "kepuasan Anda adalah prioritas kami.", "dipercaya oleh banyak pelanggan setia.", "layanan terbaik untuk kebutuhan Anda."],
  },
  en: {
    santai: ["go on, give it a try, you won't regret it!", "ordering's easy, just one click away!", "so many people already tried it, your turn now!", "try it once, you'll get hooked!", "it's simple, just order now!", "totally worth trying!"],
    persuasif: ["don't wait until it's gone, grab it now.", "a decision you won't regret.", "a chance like this doesn't come twice.", "the sooner you grab it, the sooner you'll feel the benefits.", "a small investment for big results.", "others already proved it, now it's your turn."],
    elegan: ["because you deserve the best.", "it's the small details that make the difference.", "the right choice, every time.", "quality you'll always appreciate.", "a choice that reflects your taste.", "perfection lives in the small details."],
    gaul: ["hurry up before it's gone haha", "guaranteed addictive, don't say we didn't warn you", "stop overthinking, just try it", "trust us, you won't regret it", "try it, you'll love it instantly", "grab it before it's sold out!"],
    profesional: ["we're ready to help anytime.", "quality that's proven and trusted.", "the right solution for your needs.", "your satisfaction is our priority.", "trusted by many loyal customers.", "the best service for your needs."],
  },
};

const CTA_VARIANTS = {
  id: {
    order: ["🛒 Order sekarang, stok terbatas!", "🛒 Yuk langsung order sebelum kehabisan!", "🛒 Order sekarang juga, gampang kok!", "🛒 Klik order sekarang, prosesnya cepat!", "🛒 Amankan punya kamu, order sekarang!", "🛒 Order dari sekarang, stok terbatas tiap harinya!"],
    dm: ["📩 DM kita buat info lebih lanjut ya!", "📩 Chat kita dulu kalau masih ada yang mau ditanya!", "📩 DM aja, kita bantu jelasin detailnya!", "📩 Kirim DM, kita respon cepat kok!", "📩 Ada pertanyaan? Langsung DM aja!", "📩 DM sekarang buat konsultasi gratis!"],
    follow: ["🔔 Follow biar gak ketinggalan update terbaru!", "🔔 Yuk follow, banyak promo nyusul!", "🔔 Follow sekarang biar gak kelewatan info penting!", "🔔 Follow dulu biar update-nya masuk terus!", "🔔 Follow kita, banyak kejutan nyusul!", "🔔 Jangan lupa follow buat update selanjutnya!"],
    link: ["🔗 Klik link di bio buat langsung checkout!", "🔗 Tinggal klik link di bio, checkout gampang!", "🔗 Link di bio, klik dan langsung order!", "🔗 Checkout gampang, tinggal klik link di bio!", "🔗 Klik link di bio sekarang juga!", "🔗 Link ada di bio, checkout-nya cepat!"],
    comment: ["💬 Komen di bawah kalau kamu tertarik!", "💬 Tulis di komen kalau mau tau lebih lanjut!", "💬 Yuk komen, kita bales satu-satu!", "💬 Komen \"MAU\" kalau kamu tertarik!", "💬 Ada pertanyaan? Tulis aja di komen!", "💬 Komen di bawah, kita jawab langsung!"],
    save: ["📌 Save dulu biar gak lupa!", "📌 Simpan post ini buat referensi nanti!", "📌 Save sekarang, buka lagi pas butuh!", "📌 Jangan lupa save biar gampang dicari lagi!", "📌 Save post ini sebelum kelewatan!", "📌 Simpan dulu, kapan-kapan pasti kepake!"],
  },
  en: {
    order: ["🛒 Order now, limited stock!", "🛒 Order now before it's gone!", "🛒 Order now, it's easy!", "🛒 Click order now, quick process!", "🛒 Secure yours, order now!", "🛒 Order now, stock is limited daily!"],
    dm: ["📩 DM us for more info!", "📩 Message us if you have questions!", "📩 DM us, we'll help explain the details!", "📩 Send a DM, we reply fast!", "📩 Got questions? Just DM us!", "📩 DM us now for a free consult!"],
    follow: ["🔔 Follow so you don't miss the latest updates!", "🔔 Follow us, more promos coming!", "🔔 Follow now to stay updated!", "🔔 Follow to keep getting updates!", "🔔 Follow us, more surprises ahead!", "🔔 Don't forget to follow for updates!"],
    link: ["🔗 Click the link in bio to checkout!", "🔗 Just click the link in bio, easy checkout!", "🔗 Link in bio, click and order now!", "🔗 Easy checkout, just click the link in bio!", "🔗 Click the link in bio right now!", "🔗 Link's in bio, quick checkout!"],
    comment: ["💬 Comment below if you're interested!", "💬 Drop a comment to learn more!", "💬 Comment away, we reply to everyone!", "💬 Comment \"WANT\" if you're interested!", "💬 Got questions? Just comment below!", "💬 Comment below, we'll answer right away!"],
    save: ["📌 Save this so you don't forget!", "📌 Save this post for later reference!", "📌 Save it now, come back when you need it!", "📌 Don't forget to save this for easy access!", "📌 Save this before you miss it!", "📌 Save it, you'll need it eventually!"],
  },
};

const UI = {
  id: {
    modeOrganic: "Konten Organik", modeAd: "Iklan (Meta Ads)",
    brand: "Brand / nama produk", niche: "Niche / kategori", usp: "Poin jual (pisah koma)",
    audience: "Target audience (opsional)", tone: "Tone", platform: "Platform", cta: "CTA",
    captions: "5 Varian Caption", primaryText: "Primary Text (5 varian)", headline: "Headline", description: "Description",
    script: "Script Video", hashtag: "Hashtag", hook: "Hook", isi: "Isi", ctaLabel: "CTA",
    copy: "Salin", copied: "Tersalin", download: "Download .txt",
  },
  en: {
    modeOrganic: "Organic Content", modeAd: "Ad (Meta Ads)",
    brand: "Brand / product name", niche: "Niche / category", usp: "Selling points (comma separated)",
    audience: "Target audience (optional)", tone: "Tone", platform: "Platform", cta: "CTA",
    captions: "5 Caption Variants", primaryText: "Primary Text (5 variants)", headline: "Headline", description: "Description",
    script: "Video Script", hashtag: "Hashtags", hook: "Hook", isi: "Body", ctaLabel: "CTA",
    copy: "Copy", copied: "Copied", download: "Download .txt",
  },
};

function ctaLine(lang, ctaKey, idx = 0) {
  const variants = CTA_VARIANTS[lang][ctaKey] || CTA_VARIANTS[lang].order;
  return variants[idx] || variants[0];
}

function buildCaptions({ brand, niche, usp, toneKey, ctaKey, audience, lang, seed = 0 }) {
  const openers = OPENERS[lang][toneKey] || OPENERS[lang].santai;
  const closers = CLOSERS[lang][toneKey] || CLOSERS[lang].santai;
  const uspList = usp ? usp.split(",").map((u) => u.trim()).filter(Boolean) : [];
  const audienceLine = audience ? (lang === "id" ? ` buat kamu yang ${audience.toLowerCase()}` : ` for you who ${audience.toLowerCase()}`) : "";
  const mainUsp = uspList[0] ? uspList[0].toLowerCase() : (lang === "id" ? "kualitas terbaik" : "the best quality");
  const productWord = lang === "id" ? "Produk ini" : "This product";
  const brandOrThis = brand || productWord;
  const o = (i) => openers[(i + seed * 2) % openers.length];
  const c = (i) => closers[(i + seed * 3) % closers.length];
  const cta = (i) => ctaLine(lang, ctaKey, (i + seed * 5) % 6);

  const angle1 = [
    o(0),
    lang === "id" ? `${brandOrThis}${niche ? `, ${niche.toLowerCase()}` : ""} hadir${audienceLine}.` : `${brandOrThis}${niche ? `, ${niche.toLowerCase()}` : ""} is here${audienceLine}.`,
    uspList.length ? uspList.map((u) => `✔️ ${u}`).join("\n") : "",
    c(0), "", cta(0),
  ].filter(Boolean).join("\n");

  const angle2 = [
    lang === "id" ? `Masalah: susah nemu ${niche || "produk"} yang pas?` : `Problem: struggling to find the right ${niche || "product"}?`,
    o(1),
    lang === "id" ? `${brand || "Kami"} jawab kebutuhan itu dengan ${mainUsp}.` : `${brand || "We"} answer that need with ${mainUsp}.`,
    uspList.slice(1).length ? uspList.slice(1).map((u) => `+ ${u}`).join("\n") : "",
    c(1), "", cta(1),
  ].filter(Boolean).join("\n");

  const angle3 = [
    o(2),
    lang === "id" ? `Buruan sebelum kehabisan — ${brandOrThis} lagi diminati banget${audienceLine}.` : `Hurry before it's gone — ${brandOrThis} is trending right now${audienceLine}.`,
    uspList.length ? (lang === "id" ? `Kenapa banyak yang pilih ini?\n${uspList.map((u) => `• ${u}`).join("\n")}` : `Why so many choose this?\n${uspList.map((u) => `• ${u}`).join("\n")}`) : "",
    c(2), "", cta(2),
  ].filter(Boolean).join("\n");

  const angle4 = [
    lang === "id" ? `Banyak yang nanya, "${niche || "produk ini"} bagus gak sih?"` : `A lot of people ask, "is this ${niche || "product"} actually good?"`,
    lang === "id" ? `Jawabannya: iya. ${brandOrThis} ${mainUsp ? `terkenal karena ${mainUsp}` : ""}${audienceLine}.` : `The answer: yes. ${brandOrThis} ${mainUsp ? `is known for ${mainUsp}` : ""}${audienceLine}.`,
    uspList.length ? uspList.map((u) => `⭐ ${u}`).join("\n") : "",
    c(3), "", cta(3),
  ].filter(Boolean).join("\n");

  const angle5 = [
    lang === "id" ? "Real talk sebentar..." : "Real talk for a sec...",
    lang === "id" ? `Kalau kamu lagi cari ${niche || "produk yang pas"}, ${brandOrThis} layak dicoba${audienceLine}.` : `If you're looking for the right ${niche || "product"}, ${brandOrThis} is worth trying${audienceLine}.`,
    uspList.length ? (lang === "id" ? `Alasannya simpel:\n${uspList.map((u) => `→ ${u}`).join("\n")}` : `Here's why:\n${uspList.map((u) => `→ ${u}`).join("\n")}`) : "",
    c(4), "", cta(4),
  ].filter(Boolean).join("\n");

  const labels = lang === "id"
    ? ["Angle 1 — Perkenalan", "Angle 2 — Problem/Solution", "Angle 3 — FOMO/Urgency", "Angle 4 — Social Proof", "Angle 5 — Storytelling"]
    : ["Angle 1 — Introduction", "Angle 2 — Problem/Solution", "Angle 3 — FOMO/Urgency", "Angle 4 — Social Proof", "Angle 5 — Storytelling"];

  return [
    { label: labels[0], text: angle1 },
    { label: labels[1], text: angle2 },
    { label: labels[2], text: angle3 },
    { label: labels[3], text: angle4 },
    { label: labels[4], text: angle5 },
  ];
}

function buildAdCopy(args) {
  const captions = buildCaptions(args);
  const uspList = args.usp ? args.usp.split(",").map((u) => u.trim()).filter(Boolean) : [];
  const mainUsp = uspList[0] || (args.lang === "id" ? "Kualitas terbaik" : "Best quality");
  const headline = args.lang === "id"
    ? `${args.brand || "Produk Ini"} — ${mainUsp}`.slice(0, 60)
    : `${args.brand || "This Product"} — ${mainUsp}`.slice(0, 60);
  const description = args.lang === "id" ? "Coba demo gratis dulu sebelum beli" : "Try the free demo before you buy";
  return { primary: captions, headline, description };
}

function buildScript({ brand, niche, usp, toneKey, ctaKey, audience, platform, lang }) {
  const opener = (OPENERS[lang][toneKey] || OPENERS[lang].santai)[0];
  const uspList = usp ? usp.split(",").map((u) => u.trim()).filter(Boolean) : [];
  const dur = platform === "TikTok" ? "15-30s" : platform === "Instagram" ? "20-40s" : "20-30s";

  return {
    hook: lang === "id" ? `[0-3 detik] ${opener} ${niche ? `Ini tentang ${niche.toLowerCase()}.` : ""}` : `[0-3s] ${opener} ${niche ? `This is about ${niche.toLowerCase()}.` : ""}`,
    isi: [
      lang === "id" ? `[Isi, ${dur}]` : `[Body, ${dur}]`,
      lang === "id" ? `Perkenalkan ${brand || "produk ini"}${audience ? ` buat kamu yang ${audience.toLowerCase()}` : ""}.` : `Introducing ${brand || "this product"}${audience ? ` for you who ${audience.toLowerCase()}` : ""}.`,
      uspList.length ? uspList.map((u, i) => `${i + 1}. ${u}`).join("\n") : (lang === "id" ? "Tunjukkan produk dari beberapa sudut / demo pemakaian." : "Show the product from a few angles / usage demo."),
    ].join("\n"),
    cta: `[${lang === "id" ? "Penutup" : "Closing"}] ${ctaLine(lang, ctaKey)}`,
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

function CopyButton({ text, label = "Salin", copiedLabel = "Tersalin" }) {
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
      {copied ? copiedLabel : label}
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
          Ini baru 1 dari 5 varian caption. Versi lengkap: 5 caption + script video + hashtag otomatis.
        </p>
      </div>

      {/* FEATURES */}
      <div className="max-w-5xl mx-auto px-5 pb-14">
        <div className="text-center mb-6">
          <SectionLabel>Apa yang kamu dapat</SectionLabel>
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight mt-1">Fitur lengkap versi penuh</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <FeatureCard icon={PenTool} title="5 Varian Caption" desc="Angle beda-beda: perkenalan, problem-solution, FOMO, social proof, storytelling — tinggal pilih yang paling cocok." />
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
  const [lang, setLang] = useState("id");
  const [mode, setMode] = useState("organic");
  const [form, setForm] = useState({
    brand: "", niche: "", usp: "", toneKey: "santai", platform: "Instagram", ctaKey: "order", audience: "",
  });
  const t = UI[lang];
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  // auto-translate niche/usp/audience ke Inggris saat mode EN aktif
  const [translated, setTranslated] = useState({ niche: "", usp: "", audience: "" });
  const [isTranslating, setIsTranslating] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (lang === "id") {
      setTranslated({ niche: form.niche, usp: form.usp, audience: form.audience });
      return;
    }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setIsTranslating(true);
      const [niche, usp, audience] = await Promise.all([
        translateToEn(form.niche),
        translateToEn(form.usp),
        translateToEn(form.audience),
      ]);
      setTranslated({ niche, usp, audience });
      setIsTranslating(false);
    }, 700);
    return () => clearTimeout(debounceRef.current);
  }, [lang, form.niche, form.usp, form.audience]);

  const effectiveForm = lang === "en" ? { ...form, ...translated } : form;

  const [seed, setSeed] = useState(0);
  const captions = useMemo(() => buildCaptions({ ...effectiveForm, lang, seed }), [effectiveForm, lang, seed]);
  const adCopy = useMemo(() => buildAdCopy({ ...effectiveForm, lang, seed }), [effectiveForm, lang, seed]);
  const script = useMemo(() => buildScript({ ...effectiveForm, lang }), [effectiveForm, lang]);
  const hashtags = useMemo(() => buildHashtags(form), [form]);

  const downloadTxt = () => {
    const lines = [];
    lines.push(`=== ${form.brand || "Brand"} — CopyGen ===`);
    lines.push("");
    if (mode === "organic") {
      lines.push(`-- ${t.captions} --`);
      captions.forEach((c) => { lines.push(c.label); lines.push(c.text); lines.push(""); });
    } else {
      lines.push(`-- ${t.headline} --`); lines.push(adCopy.headline); lines.push("");
      lines.push(`-- ${t.description} --`); lines.push(adCopy.description); lines.push("");
      lines.push(`-- ${t.primaryText} --`);
      adCopy.primary.forEach((c) => { lines.push(c.label); lines.push(c.text); lines.push(""); });
    }
    lines.push(`-- ${t.script} --`);
    lines.push(`${t.hook}: ${script.hook}`);
    lines.push(`${t.isi}: ${script.isi}`);
    lines.push(`${t.ctaLabel}: ${script.cta}`);
    lines.push("");
    lines.push(`-- ${t.hashtag} --`);
    lines.push(hashtags);

    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(form.brand || "copygen").toLowerCase().replace(/\s+/g, "-")}-${mode}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen w-full bg-[#141412] text-[#f2f2ee] font-sans">
      <div className="max-w-6xl mx-auto px-5 py-10">
        <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 border border-[#d7ff3d] flex items-center justify-center rotate-45">
              <PenTool size={15} className="text-[#d7ff3d] -rotate-45" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">CopyGen</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLang(lang === "id" ? "en" : "id")}
              className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wide border border-[#3a3a35] px-3 py-1.5 text-[#8f8f89] hover:border-[#d7ff3d] hover:text-[#d7ff3d] transition-colors"
            >
              {isTranslating ? <Loader2 size={13} className="animate-spin" /> : null}
              {lang === "id" ? "ID" : "EN"}
            </button>
            <button onClick={goBack} className="flex items-center gap-1 text-[11px] font-mono text-[#8f8f89] hover:text-[#d7ff3d] transition-colors">
              <ArrowLeft size={12} /> keluar
            </button>
          </div>
        </div>
        <p className="text-[#8f8f89] text-sm font-mono mb-1 pl-11">isi brief produk → caption + script + hashtag otomatis</p>
        {lang === "en" && (
          <p className="text-[#5a5a55] text-[11px] font-mono mb-5 pl-11">
            {isTranslating ? "Auto-translating your input..." : "Input auto-translated to English."}
          </p>
        )}
        {lang === "id" && <div className="mb-5" />}

        {/* Mode toggle - dinonaktifkan sementara, tinggal uncomment buat aktifin lagi
        <div className="pl-11 mb-8 flex gap-2">
          <button
            onClick={() => setMode("organic")}
            className={`text-xs font-mono uppercase tracking-wide px-3 py-2 border transition-colors ${mode === "organic" ? "bg-[#d7ff3d] text-[#141412] border-[#d7ff3d]" : "border-[#3a3a35] text-[#8f8f89] hover:border-[#d7ff3d] hover:text-[#d7ff3d]"}`}
          >
            {t.modeOrganic}
          </button>
          <button
            onClick={() => setMode("ad")}
            className={`text-xs font-mono uppercase tracking-wide px-3 py-2 border transition-colors ${mode === "ad" ? "bg-[#d7ff3d] text-[#141412] border-[#d7ff3d]" : "border-[#3a3a35] text-[#8f8f89] hover:border-[#d7ff3d] hover:text-[#d7ff3d]"}`}
          >
            {t.modeAd}
          </button>
        </div>
        */}
        <div className="mb-3" />

        <div className="grid md:grid-cols-[380px_1fr] gap-6">
          <div className="border border-[#2c2c29] bg-[#1a1a17] p-5 space-y-4 h-fit">
            <div>
              <label className="text-[10px] font-mono uppercase tracking-widest text-[#8f8f89]">{t.brand}</label>
              <input value={form.brand} onChange={set("brand")} placeholder="cth: Warung Sambal Bu Rina"
                className="w-full mt-1 bg-[#141412] border border-[#3a3a35] px-3 py-2 text-sm focus:outline-none focus:border-[#d7ff3d] placeholder:text-[#5a5a55]" />
            </div>
            <div>
              <label className="text-[10px] font-mono uppercase tracking-widest text-[#8f8f89]">{t.niche}</label>
              <input value={form.niche} onChange={set("niche")} placeholder="cth: sambal kemasan pedas"
                className="w-full mt-1 bg-[#141412] border border-[#3a3a35] px-3 py-2 text-sm focus:outline-none focus:border-[#d7ff3d] placeholder:text-[#5a5a55]" />
            </div>
            <div>
              <label className="text-[10px] font-mono uppercase tracking-widest text-[#8f8f89]">{t.usp}</label>
              <textarea value={form.usp} onChange={set("usp")} placeholder="cth: tanpa pengawet, pedas nampol" rows={3}
                className="w-full mt-1 bg-[#141412] border border-[#3a3a35] px-3 py-2 text-sm focus:outline-none focus:border-[#d7ff3d] placeholder:text-[#5a5a55] resize-none" />
            </div>
            <div>
              <label className="text-[10px] font-mono uppercase tracking-widest text-[#8f8f89]">{t.audience}</label>
              <input value={form.audience} onChange={set("audience")} placeholder="cth: suka pedas & praktis"
                className="w-full mt-1 bg-[#141412] border border-[#3a3a35] px-3 py-2 text-sm focus:outline-none focus:border-[#d7ff3d] placeholder:text-[#5a5a55]" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-[#8f8f89]">{t.tone}</label>
                <select value={form.toneKey} onChange={set("toneKey")}
                  className="w-full mt-1 bg-[#141412] border border-[#3a3a35] px-3 py-2 text-sm focus:outline-none focus:border-[#d7ff3d]">
                  {TONE_KEYS.map((k) => <option key={k} value={k}>{TONE_LABELS[lang][k]}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-[#8f8f89]">{t.platform}</label>
                <select value={form.platform} onChange={set("platform")}
                  className="w-full mt-1 bg-[#141412] border border-[#3a3a35] px-3 py-2 text-sm focus:outline-none focus:border-[#d7ff3d]">
                  {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-[10px] font-mono uppercase tracking-widest text-[#8f8f89]">{t.cta}</label>
              <select value={form.ctaKey} onChange={set("ctaKey")}
                className="w-full mt-1 bg-[#141412] border border-[#3a3a35] px-3 py-2 text-sm focus:outline-none focus:border-[#d7ff3d]">
                {CTA_KEYS.map((k) => <option key={k} value={k}>{CTA_LABELS[lang][k]}</option>)}
              </select>
            </div>
            <button
              onClick={() => setSeed((s) => s + 1)}
              className="w-full flex items-center justify-center gap-1.5 text-[11px] font-mono uppercase tracking-wide border border-[#d7ff3d] text-[#d7ff3d] px-3 py-2 hover:bg-[#d7ff3d] hover:text-[#141412] transition-colors"
            >
              {lang === "id" ? "Acak ulang variasi" : "Shuffle variations"}
            </button>
            <button onClick={downloadTxt} className="w-full flex items-center justify-center gap-1.5 text-[11px] font-mono uppercase tracking-wide bg-[#d7ff3d] text-[#141412] px-3 py-2 hover:bg-[#c2e836] transition-colors">
              {t.download}
            </button>
          </div>

          <div className="space-y-5">
            {mode === "organic" ? (
              <div className="border border-[#2c2c29] bg-[#1a1a17] p-5">
                <div className="flex items-center gap-1.5 mb-4">
                  <PenTool size={14} className="text-[#d7ff3d]" />
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#d7ff3d]">{t.captions}</span>
                </div>
                <div className="space-y-4">
                  {captions.map((c) => (
                    <div key={c.label} className="border-l-2 border-[#d7ff3d] pl-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-mono text-[#8f8f89] uppercase tracking-wide">{c.label}</span>
                        <CopyButton text={c.text} label={t.copy} copiedLabel={t.copied} />
                      </div>
                      <pre className="text-sm leading-relaxed whitespace-pre-wrap font-sans">{c.text}</pre>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div className="border border-[#2c2c29] bg-[#1a1a17] p-5 space-y-4">
                  <div className="border-l-2 border-[#d7ff3d] pl-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-mono text-[#8f8f89] uppercase tracking-wide">{t.headline}</span>
                      <CopyButton text={adCopy.headline} label={t.copy} copiedLabel={t.copied} />
                    </div>
                    <p className="text-sm leading-relaxed">{adCopy.headline}</p>
                  </div>
                  <div className="border-l-2 border-[#d7ff3d] pl-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-mono text-[#8f8f89] uppercase tracking-wide">{t.description}</span>
                      <CopyButton text={adCopy.description} label={t.copy} copiedLabel={t.copied} />
                    </div>
                    <p className="text-sm leading-relaxed">{adCopy.description}</p>
                  </div>
                </div>
                <div className="border border-[#2c2c29] bg-[#1a1a17] p-5">
                  <div className="flex items-center gap-1.5 mb-4">
                    <PenTool size={14} className="text-[#d7ff3d]" />
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#d7ff3d]">{t.primaryText}</span>
                  </div>
                  <div className="space-y-4">
                    {adCopy.primary.map((c) => (
                      <div key={c.label} className="border-l-2 border-[#d7ff3d] pl-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] font-mono text-[#8f8f89] uppercase tracking-wide">{c.label}</span>
                          <CopyButton text={c.text} label={t.copy} copiedLabel={t.copied} />
                        </div>
                        <pre className="text-sm leading-relaxed whitespace-pre-wrap font-sans">{c.text}</pre>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div className="border border-[#2c2c29] bg-[#1a1a17] p-5">
              <div className="flex items-center gap-1.5 mb-4">
                <Film size={14} className="text-[#d7ff3d]" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#d7ff3d]">{t.script}</span>
              </div>
              <div className="space-y-3">
                {[{ label: t.hook, text: script.hook }, { label: t.isi, text: script.isi }, { label: t.ctaLabel, text: script.cta }].map((s) => (
                  <div key={s.label} className="border-l-2 border-[#d7ff3d] pl-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-mono text-[#8f8f89] uppercase tracking-wide">{s.label}</span>
                      <CopyButton text={s.text} label={t.copy} copiedLabel={t.copied} />
                    </div>
                    <pre className="text-sm leading-relaxed whitespace-pre-wrap font-sans">{s.text}</pre>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-[#2c2c29] bg-[#1a1a17] p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#8f8f89]">{t.hashtag}</span>
                <CopyButton text={hashtags} label={t.copy} copiedLabel={t.copied} />
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

  const waLink = "https://wa.me/6289670781401?text=" + encodeURIComponent("Halo, aku mau tanya-tanya soal CopyGen dulu ya!");
  const lynkLink = "https://lynk.id/rifkial23/w6dm6d1kl7w1";

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
