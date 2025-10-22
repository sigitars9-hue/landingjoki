import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Star,
  Gamepad2,
  Users2,
  Zap,
  MessageCircle,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  BadgeCheck,
  Lock,
  AlarmClockCheck,
  Sparkles,
  ChevronDown,
  ExternalLink,
} from "lucide-react";
import ryuuImg from "./assets/admins/ryuu.jpg";
import imyImg from "./assets/admins/imy.jpg";
import haruImg from "./assets/admins/haru.jpg";

/*
  Redesign v3 — FIXED
  - ✅ Wrap return with a single parent (React Fragment) to avoid adjacent JSX error
  - Font Inter/Poppins via Google Fonts (default Inter)
  - Palette disesuaikan: biru–cyan profesional (seperti referensi)
  - Scroll reveal: setiap section/kartu muncul saat masuk viewport (Framer Motion + viewport)
  - Coverage grid (bukan marquee), Tabs + Accordion untuk price list besar
  - Tetap: "Mulai Order dalam 3 Langkah"
  - ✅ Added simple runtime smoke tests (console) to verify sections mount
*/

/* ───────────────────────── Config ───────────────────────── */
const cx = (...a) => a.filter(Boolean).join(" ");

const BRAND = {
  name: "JokiVerse",
  // Aksen biru senada dengan referensi
  accent: "from-cyan-400 via-blue-500 to-indigo-500",
  wa: "6289657934433", // nomor WA final
};

/* ───────────────────────── Coverage (curated) ───────────────────────── */
const COVERAGE = {
  HoYoverse: [
    "Genshin Impact",
    "Honkai: Star Rail",
    "Honkai Impact 3rd",
    "Zenless Zone Zero",
  ],
  "Kuro Games": ["Wuthering Waves", "Punishing: Gray Raven"],
  "Yostar / Hypergryph": ["Arknights"],
  NEXON: ["Blue Archive"],
  Lainnya: ["Nikke", "Tower of Fantasy", "FGO", "Reverse: 1999"],
};

/* ───────────────────────── Price Data (from your message) ───────────────────────── */
const PRICE = {
  HSR: {
    title: "Honkai: Star Rail",
    groups: [
      {
        name: "Akun / Rawat Akun",
        items: ["Mingguan = 25k", "Bulanan = 130k", "1 Patch = 160k"],
        note:
          "Benefit mingguan: daily, weekly, HSU/DU weekly point. Bulanan/1 patch: daily, weekly, HSU/DU weekly point, request build 1 char, event limited clear (berlangsung).",
      },
      {
        name: "Build Character",
        items: [
          "Level + Light Cone = 10k",
          "Trace = 15k",
          "DPS/Sub = 45k",
          "Support = 30k",
        ],
      },
      { name: "Other", items: ["Spend Trailblaze Power = 500/ronde"] },
      {
        name: "Quest / Event",
        items: [
          "Trailblaze Story / Continuance = 20k",
          "Companion / Side Story = 10k",
          "Event = 20k",
        ],
      },
      {
        name: "Paket HSU",
        items: [
          "HSU Normal full diff clear = 100k",
          "HSU Swarm Disaster clear = 200k",
          "HSU Gold & Gears clear = 180k",
          "HSU Unknown Domain clear = 190k",
        ],
      },
      {
        name: "Divergent Universe",
        items: ["DU clear till Diff 5 = 70k", "DU Level Farm = 2k / level"],
      },
      {
        name: "DU Conundrum",
        items: [
          "X1 - X3 = 60k",
          "X4 - X5 = 80k",
          "X6 only = 60k",
          "X1 - X6 = 200k (konfirmasi akun)",
        ],
      },
      {
        name: "Endgame Content (jika endgame)",
        items: ["MoC clear till floor 10", "PF clear till floor 2", "AS clear till floor 2"],
      },
    ],
  },
  ZZZ: {
    title: "Zenless Zone Zero",
    groups: [
      {
        name: "Akun",
        items: [
          "Joki Build: 25k / char",
          "Rawkun Mingguan: 25k",
          "Rawkun Bulanan: 100k",
          "Spend stamina: 7,5k / 240 stamina",
        ],
      },
      {
        name: "Quest",
        items: [
          "Main Quest: 20k",
          "Hard mode: 10k",
          "Combat: 5k",
          "Puzzle: 4k",
          "Exploration: 7k",
          "Rally: 5k",
          "Challenge: 5k",
          "Special: 4k",
          "Event: 15k",
        ],
      },
      {
        name: "Other",
        items: [
          "Shiyu Defense: 20k / floor (konfirmasi karakter)",
          "Shiyu Defense endgame: 25k / floor (konfirmasi karakter)",
          "Hollow Z: 15k / floor",
          "Hollow Z Core: 20k / diff",
          "Weekly boss: 15k / 3 boss",
        ],
      },
      {
        name: "Paket",
        items: [
          "Officer Mewmew: 30k / page",
          "Yunkui Summit: 50k",
          "Appergio: 40k",
          "Explore: 7k / map",
          "Joki level HZ: 15k / run",
        ],
      },
    ],
  },
  R1999: {
    title: "Reverse: 1999",
    groups: [
      {
        name: "Story",
        items: [
          "Normal: 5–10k per chapter (semakin jauh semakin sulit)",
          "Hard: +2k",
        ],
      },
      {
        name: "Rawkun",
        items: ["Seminggu: 15k (bisa request farm material)", "Perbulan: 30k"],
      },
      {
        name: "Artificial Somnambulism / Limbo",
        items: ["AS biasa: 20k (all)", "AS Limbo EX: 15k", "AS Lucidscape EX: 20k"],
      },
      { name: "The Three Door", items: ["5–10k per stage (tergantung kesulitan)"] },
      { name: "Event", items: ["Event clear biasa & hard: 30k–50k (tergantung karakter)"] },
      { name: "Build Arcanist", items: ["25k (Activity Candy harus banyak)"] },
    ],
  },
  HI3: {
    title: "Honkai Impact 3rd",
    groups: [
      {
        name: "Rawkun",
        items: [
          "Mingguan = 30k",
          "Bulanan = 120k",
          "1 patch: 6w 250k, 8w 350k, 9w 400k",
          "Benefit: Include Abyss (3 stage exalted, Q‑Manifold sebisanya), ER, Event, Memorial Arena",
        ],
      },
      { name: "Event", items: ["Minor Event 25k", "Major Event 35k"] },
      { name: "Elysian Realm Only", items: ["8–15k"] },
      {
        name: "Story",
        items: [
          "Quest 10–15k / chapter",
          "Open World 20k / chapter & map (Part 2)",
          "Story ER 15k / chapter",
        ],
      },
    ],
  },
  Genshin: {
    title: "Genshin Impact",
    groups: [
      {
        name: "Build char (paket)",
        items: ["Ascend 1–90: 85k", "Up talent: 80k", "Relic: 50k", "Paket: 215k → 180k"],
      },
      { name: "Event", items: ["Event all phase: 45–55k", "Event umum: 20–25k", "Event mudah/cepat: 12–15k"] },
      { name: "Story", items: ["Archon Quest: 15k / act"] },
      {
        name: "Eksplorasi 100%",
        items: [
          "Mondstadt 120k (Dragonspine 55k)",
          "Liyue 140k (Chenyu 140k, Chasm 100k)",
          "Inazuma 230k (Enkanomiya 120k)",
          "Sumeru: forest 230k, desert 320k",
          "Fontaine 360k (Remuria 80k)",
        ],
      },
      { name: "Material", items: ["100–250 / pcs"] },
      {
        name: "Oculus (ALL)",
        items: [
          "Anemoculus 40k",
          "Geoculus 50k",
          "Electroculus 120k",
          "Dendroculus 240k",
          "Hydroculus 220k",
        ],
      },
      { name: "Rawkun (revisi)", items: ["Daily 5k", "Weekly 30k", "Monthly 90k"] },
    ],
  },
  WW: {
    title: "Wuthering Waves",
    groups: [
      { name: "Rawkun", items: ["Sebulan 200k", "1 Patch 350k"] },
      {
        name: "Explore Map",
        items: ["Huanglong 300k", "Blackshores 100k", "Rinascita 100k", "Septimont 100k"],
      },
      { name: "Build Char", items: ["Echo only 25k / char", "Echo + Lvling talent/skill 60k / char"] },
      { name: "Level Up Char", items: ["10k / level", "1–90 75k"] },
      { name: "Event", items: ["15–35k"] },
      { name: "ToA", items: ["5k / lantai"] },
    ],
  },
  BA: {
    title: "Blue Archive",
    groups: [
      { name: "Rawat Akun", items: ["Weekly 20k", "Monthly 70k"] },
      { name: "Stage", items: ["Normal 6k / area", "Hard 4k / area"] },
      { name: "Grand Assault", items: ["Normal–Hardcore 2–4k", "Extreme 6k", "Insane–Torment 8–15k"] },
      { name: "Total Assault", items: ["3k per hari (diff seperti Grand Assault)"] },
      { name: "Event", items: ["Full Stage + Challenge 20k"] },
      { name: "Lainnya", items: ["JFD 4k"] },
    ],
  },
};

const GAME_TABS = ["HSR", "ZZZ", "R1999", "HI3", "Genshin", "WW", "BA"];

/* ───────────────────────── Small UI ───────────────────────── */
function Pill({ children }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
      <BadgeCheck className="size-3.5" /> {children}
    </span>
  );
}

function Section({ id, title, subtitle, children }) {
  return (
    <section id={id} className="mx-auto max-w-6xl px-4 py-16" data-testid={`section-${id}`}>
      <div className="mb-8 flex flex-col gap-2">
        <h2 className="text-2xl font-semibold text-zinc-100">{title}</h2>
        {subtitle && <p className="max-w-2xl text-sm text-zinc-400">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

function GradientAvatar({ initials, img }) {
  return (
    <div className="relative size-14 overflow-hidden rounded-2xl shadow-lg ring-1 ring-white/10">
      {img ? (
        <img
          src={img}
          alt={initials}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      ) : (
        <div className="grid h-full w-full place-items-center bg-gradient-to-br from-[#0f172a] via-[#0b1220] to-[#0a0f1a] text-sm font-semibold text-white">
          {initials}
        </div>
      )}
    </div>
  );
}


/* ───────────────────────── Coverage Grid ───────────────────────── */
function CoverageGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Object.entries(COVERAGE).map(([label, games]) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45 }}
          className="rounded-2xl border border-white/10 bg-[#0b0f16]/60 p-4"
        >
          <div className="mb-2 text-sm font-semibold text-zinc-200">{label}</div>
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {games.map((g) => (
              <li
                key={g}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-300"
              >
                <Gamepad2 className="size-4" /> {g}
              </li>
            ))}
          </ul>
        </motion.div>
      ))}
    </div>
  );
}

/* ───────────────────────── Promo Slider ───────────────────────── */
function PromoSlider() {
  const [idx, setIdx] = useState(0);
  const promos = [
    { title: "Weekend Top Up", desc: "Diskon 15% + prioritas pengerjaan", tag: "Weekend" },
    { title: "Farm 7 Hari", desc: "Resin/energy & material harian — hemat 20%", tag: "Value" },
    { title: "Starter Pack", desc: "Leveling + build awal — mulai 49K", tag: "Limited" },
  ];
  const len = promos.length;
  const next = () => setIdx((p) => (p + 1) % len);
  const prev = () => setIdx((p) => (p - 1 + len) % len);

  useEffect(() => {
    const t = setInterval(next, 3800);
    return () => clearInterval(t);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0b1220]/80 to-[#0a0f1a]/60 p-5"
    >
      <div className="flex items-center justify-between pb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="size-5 text-zinc-200" />
          <span className="text-sm font-semibold text-zinc-200">Promo & Penawaran</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={prev} className="rounded-full border border-white/10 bg-zinc-800 p-1 hover:bg-zinc-700"><ChevronLeft className="size-4"/></button>
          <button onClick={next} className="rounded-full border border-white/10 bg-zinc-800 p-1 hover:bg-zinc-700"><ChevronRight className="size-4"/></button>
        </div>
      </div>

      <div className="relative h-36">
        {promos.map((p, i) => (
          <motion.article
            key={p.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: i === idx ? 1 : 0, y: i === idx ? 0 : 8 }}
            transition={{ duration: 0.35 }}
            className={cx("absolute inset-0 grid grid-rows-[auto_1fr] rounded-2xl border border-white/10 bg-white/5 p-4", i===idx?"pointer-events-auto":"pointer-events-none")}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-zinc-100">{p.title}</h3>
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-zinc-300">{p.tag}</span>
            </div>
            <p className="mt-1 text-sm text-zinc-400">{p.desc}</p>
          </motion.article>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2">
        {Array.from({ length: len }).map((_, i) => (
          <button key={i} onClick={() => setIdx(i)} className="group relative h-1 flex-1 overflow-hidden rounded bg-zinc-700">
            <span className={cx("absolute inset-y-0 left-0", i===idx?"animate-[fill_3.8s_linear_forwards] bg-zinc-200":"bg-zinc-500")}/>
          </button>
        ))}
      </div>
      <style>{`@keyframes fill{from{width:0}to{width:100%}}`}</style>
    </motion.div>
  );
}

/* ───────────────────────── Admin Cards ───────────────────────── */
function AdminCards() {

const ADMINS = [
  {
    name: "Ryuu",
    role: "Bendahara",
    about: "Mengelola dan Mengamankan keuangan joki.",
    initials: "RY",
    online: true,
    img: ryuuImg,
    profileUrl: "https://gachaverse-page.vercel.app/admins/pacar-elysia" 
  },
  {
    name: "Imy",
    role: "Sekretaris",
    about: "Pencatatan dan Brief.",
    initials: "MY",
    online: true,
    img: imyImg,       
    profileUrl: "https://gachaverse-page.vercel.app/admins/imy"    
  },
  {
    name: "Haru",
    role: "Leader",
    about: "Koordinator 30+ worker dan pusat pengaduan.",
    initials: "HR",
    online: true,
    img: haruImg,
    profileUrl: "http://gachaverse-page.vercel.app/admins/haru"
  },
];


  return (
    <div className="grid gap-4 md:grid-cols-3">
      {ADMINS.map((a, i) => (
        <motion.article
          key={a.name}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, delay: 0.05 * i }}
          className="group rounded-2xl border border-white/10 bg-[#0b0f16]/60 p-5 hover:border-white/20 hover:bg-[#0b0f16]/80"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <GradientAvatar initials={a.initials} img={a.img} />
              <span className={cx("absolute -right-1 -top-1 size-3 rounded-full ring-2 ring-[#0b0f16]", a.online?"bg-emerald-400":"bg-zinc-500")}/>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-100">{a.name}</h3>
              <p className="text-xs text-zinc-400">{a.role}</p>
            </div>
          </div>
          <p className="mt-3 text-sm text-zinc-300">{a.about}</p>
          <div className="mt-4 flex gap-2">
            <a href={`https://wa.me/${BRAND.wa}?text=Halo%20${a.name}`} target="_blank" className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-zinc-200 hover:bg-white/10">
              <MessageCircle className="size-4"/> Chat
            </a>
            <span className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-zinc-300">
              <ShieldCheck className="size-4"/> Verified

              {a.profileUrl ? (
    <a
      href={a.profileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-zinc-200 hover:bg-white/10"
      title="Buka Profile"
    >
      Buka Profile <ExternalLink className="size-4" />
    </a>
  ) : (
    <button
      disabled
      className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-zinc-400 opacity-50 cursor-not-allowed"
      title="Link profile belum tersedia"
    >
      Buka Profile <ExternalLink className="size-4" />
    </button>
  )}
            </span>
          </div>
        </motion.article>
      ))}
    </div>
  );
}

/* ───────────────────────── Safety Grid ───────────────────────── */
function SafetyGrid() {
  const Item = ({ icon: Icon, title, desc }) => (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border border-white/10 bg-white/5 p-4"
    >
      <div className="flex items-center gap-2 text-zinc-100"><Icon className="size-4"/> <span className="text-sm font-semibold">{title}</span></div>
      <p className="mt-1 text-xs text-zinc-400">{desc}</p>
    </motion.div>
  );
  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
      <Item icon={Lock} title="Keamanan" desc="Device/IP audit, akses terbatas, jejak login bersih."/>
      <Item icon={AlarmClockCheck} title="SLA Terukur" desc="Target waktu jelas, update progres harian."/>
      <Item icon={ShieldCheck} title="Garansi" desc="Refund parsial bila target tidak tercapai."/>
      <Item icon={Star} title="Kepuasan 4.9" desc="Ribuan order selesai dengan rating tinggi."/>
    </div>
  );
}

/* ───────────────────────── Tabs + Accordions for Price ───────────────────────── */
function PriceTabs() {
  const [tab, setTab] = useState("HSR");
  const keys = GAME_TABS;
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
      className="rounded-3xl border border-white/10 bg-[#0b0f16]/50 p-4"
    >
      <div className="flex flex-wrap items-center gap-2">
        {keys.map((k) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={
              "rounded-xl border px-3 py-1.5 text-xs font-semibold " +
              (tab === k
                ? "border-white/20 bg-gradient-to-r " + BRAND.accent + " text-zinc-900"
                : "border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10")
            }
          >
            {PRICE[k].title}
          </button>
        ))}
      </div>

      <div className="mt-4">
        <PriceAccordion groups={PRICE[tab].groups} />
        <div className="mt-4 flex justify-end">
          <a
            href={`https://wa.me/${BRAND.wa}?text=Halo%20Admin%2C%20saya%20ingin%20order%20${encodeURIComponent(PRICE[tab].title)}`}
            target="_blank"
            className={"inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold bg-gradient-to-r " + BRAND.accent + " text-zinc-900"}
          >
            Tanya & Order <ArrowRight className="size-4" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

function PriceAccordion({ groups }) {
  const [open, setOpen] = useState({});
  const toggle = (name) => setOpen((o) => ({ ...o, [name]: !o[name] }));
  return (
    <div className="divide-y divide-white/10 rounded-2xl border border-white/10">
      {groups.map((g) => (
        <div key={g.name} className="bg-white/5">
          <button
            onClick={() => toggle(g.name)}
            className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left"
          >
            <div>
              <div className="text-sm font-semibold text-zinc-100">{g.name}</div>
              {g.note && <div className="text-xs text-zinc-400">{g.note}</div>}
            </div>
            <ChevronDown
              className={"size-4 transition-transform " + (open[g.name] ? "rotate-180" : "rotate-0")}
            />
          </button>
          {open[g.name] && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} className="px-4 pb-4">
              <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-300">
                {g.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ───────────────────────── CTAs ───────────────────────── */
function CTAs() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <a href="#order" className={"inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold text-zinc-900 bg-gradient-to-r " + BRAND.accent + " shadow-lg shadow-blue-500/10 hover:opacity-95"}>
        Pesan Sekarang <ArrowRight className="size-4" />
      </a>
      <a href={`https://wa.me/${BRAND.wa}`} target="_blank" className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-zinc-200 hover:bg-white/10">
        <MessageCircle className="size-4" /> Chat Admin
      </a>
    </div>
  );
}

/* ───────────────────────── Main ───────────────────────── */
export default function LandingPage() {
  const FONT = "inter";
  const fontStack = useMemo(
    () =>
      FONT === "poppins"
        ? 'Poppins, Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans"'
        : 'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans"',
    [FONT]
  );

  useEffect(() => {
    const sections = ["promo", "coverage", "price", "admins", "safety", "order"];
    const missing = sections.filter((id) => !document.querySelector(`[data-testid="section-${id}"]`));
    if (missing.length) console.warn("[SMOKE TEST] Missing sections:", missing);
    else console.log("[SMOKE TEST] All sections mounted OK");
  }, []);

  return (
    <>
      <div
        className="min-h-screen bg-gradient-to-b from-[#07090c] via-[#090c12] to-[#0b0f16] text-zinc-200"
        style={{ fontFamily: fontStack }}
        data-testid="app-root"
      >
        {/* Load Google Fonts */}
        <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
      `}</style>

        {/* ───────── Nav (clean) ───────── */}
        <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0a0f16]/70 backdrop-blur">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="size-7 rounded-lg bg-gradient-to-br from-[#0f172a] to-[#0a0f1a]" />
              <span className="text-sm font-semibold">{BRAND.name}</span>
            </div>
            <div className="hidden items-center gap-5 text-sm text-zinc-300 md:flex">
              <a href="#promo" className="hover:text-zinc-100">Promo</a>
              <a href="#coverage" className="hover:text-zinc-100">Coverage</a>
              <a href="#price" className="hover:text-zinc-100">Price</a>
              <a href="#admins" className="hover:text-zinc-100">Admin</a>
              <a href="#order" className="hover:text-zinc-100">Order</a>
            </div>
            <a href="#order" className={"hidden rounded-xl px-3 py-2 text-xs font-semibold md:inline-flex bg-gradient-to-r " + BRAND.accent + " text-zinc-900"}>
              Mulai Joki
            </a>
          </nav>
        </header>

        {/* ───────── Hero (bento + reveal) ───────── */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto max-w-6xl px-4 pb-12 pt-12"
        >
          <div className="absolute inset-x-0 -top-24 -z-10 h-72 bg-gradient-to-b from-white/5 to-transparent blur-3xl" />
          <div className="grid items-stretch gap-4 md:grid-cols-3">
            {/* Left: copy + CTAs */}
            <motion.div initial={{opacity:0, y:18}} whileInView={{opacity:1, y:0}} viewport={{ once:true, amount:0.2 }} transition={{ duration:0.5, delay:0.05 }} className="col-span-2 rounded-3xl border border-white/10 bg-[#0b0f16]/60 p-6">
              <Pill>Joki Aman • Cepat • Transparan</Pill>
              <h1 className="mt-3 text-3xl font-semibold leading-tight text-zinc-100 md:text-4xl">Trusted Gacha & Daily Farm Service</h1>
              <p className="mt-3 max-w-2xl text-zinc-400">30+ worker berpengalaman mencakup mayoritas game gacha. Progres harian, laporan real‑time, dan proteksi keamanan akun.</p>
              <div className="mt-6"><CTAs /></div>
              <div className="mt-6 grid grid-cols-3 gap-3 text-center md:max-w-md">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><div className="text-xl font-semibold text-zinc-100">30+</div><div className="text-xs text-zinc-400">Worker Aktif</div></div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><div className="text-xl font-semibold text-zinc-100">5000+</div><div className="text-xs text-zinc-400">Order Selesai</div></div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><div className="text-xl font-semibold text-zinc-100">4.9</div><div className="flex items-center justify-center gap-1 text-xs text-zinc-400"><Star className="size-3"/> Rating</div></div>
              </div>
            </motion.div>
            {/* Right: safety bento */}
            <div className="grid gap-4">
              {[
                { title: 'Shift Worker 24/7', desc:'Penjadwalan ketat & rotasi aman.', icon: Users2},
                { title: 'Safe Login Control', desc:'IP/Device audit + jejak login bersih.', icon: ShieldCheck},
                { title: 'SLA Terukur', desc:'Progres harian & target waktu jelas.', icon: Zap},
              ].map((b, i)=> (
                <motion.div key={b.title} initial={{opacity:0, y:16}} whileInView={{opacity:1, y:0}} viewport={{ once:true, amount:0.2 }} transition={{ duration:0.45, delay:0.05*i }} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <div className="flex items-center gap-2 text-sm font-semibold text-zinc-100">{b.icon && <b.icon className="size-4"/>} {b.title}</div>
                  <p className="mt-1 text-xs text-zinc-400">{b.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ───────── Promo ───────── */}
        <Section id="promo" title="Promo Otomatis" subtitle="Penawaran terbaik kami, update berkala.">
          <PromoSlider />
        </Section>

        {/* ───────── Coverage (reveal) ───────── */}
        <Section id="coverage" title="Cakupan Game Gacha" subtitle="Kami support mayoritas judul populer. Butuh judul lain? Tinggal chat admin.">
          <CoverageGrid />
        </Section>

        {/* ───────── Price per Game (Tabs) ───────── */}
        <Section id="price" title="Price List per Game" subtitle="Semua harga promo yang kamu kirim sudah ditata dalam tab. Klik kategori untuk lihat rinciannya.">
          <PriceTabs />
        </Section>

        {/* ───────── Admins ───────── */}
        <Section id="admins" title="Admin Utama Pengurus Joki" subtitle="Tiga pengurus inti memastikan workflow rapi, aman, dan tepat waktu.">
          <AdminCards />
        </Section>

        {/* ───────── Safety quick grid ───────── */}
        <Section id="safety" title="Keamanan & Garansi" subtitle="Standar kerja yang transparan dan terukur.">
          <SafetyGrid />
        </Section>

        {/* ───────── Order / Pricing ───────── */}
        <Section id="order" title="Mulai Order dalam 3 Langkah" subtitle="Pilih paket di bawah, lalu kirim brief via WhatsApp — admin akan konfirmasi slot dan estimasi waktu.">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { name: "Daily Farm", price: "29K", points: ["Claim resin/energy", "Materials rutin", "Laporan harian"] },
              { name: "Event & Quest", price: "49K", points: ["Story/Quest/Event", "Eksplorasi map", "Rewards secure"], highlight: true },
              { name: "Build & Spiral", price: "99K", points: ["Build karakter dasar", "Abyss/Endgame", "Optimisasi artifact"] },
            ].map((p, i) => (
              <motion.div key={p.name} initial={{opacity:0, y:18}} whileInView={{opacity:1, y:0}} viewport={{ once:true, amount:0.2 }} transition={{ duration:0.45, delay:0.05*i }} className={"relative rounded-2xl border border-white/10 p-5 " + (p.highlight?"bg-white/10":"bg-white/5")}>
                {p.highlight && (<div className="absolute -top-2 right-3 rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-zinc-300">Recommended</div>)}
                <h3 className="text-base font-semibold text-zinc-100">{p.name}</h3>
                <div className="mt-2 text-3xl font-bold text-zinc-100">{p.price}</div>
                <ul className="mt-3 space-y-2 text-sm text-zinc-300">
                  {p.points.map((pt) => (
                    <li key={pt} className="flex items-center gap-2"><Zap className="size-4"/> {pt}</li>
                  ))}
                </ul>
                <a href={`https://wa.me/${BRAND.wa}?text=Halo%20Admin%2C%20saya%20ingin%20order%20paket%20${encodeURIComponent(p.name)}`} target="_blank" className={"mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold " + (p.highlight?("bg-gradient-to-r " + BRAND.accent + " text-zinc-900"):"border border-white/10 bg-white/5 text-zinc-200 hover:bg-white/10")}> 
                  Pilih Paket <ArrowRight className="size-4"/>
                </a>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{opacity:0, y:14}} whileInView={{opacity:1, y:0}} viewport={{ once:true, amount:0.2 }} transition={{ duration:0.45, delay:0.15 }} className="mt-8 rounded-2xl border border-white/10 bg-[#0b0f16]/60 p-6">
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
              <div>
                <h3 className="text-base font-semibold text-zinc-100">Custom Request & Jadwal Prioritas</h3>
                <p className="mt-1 text-sm text-zinc-400">Punya kebutuhan spesifik (limited banner, race event, dll)? Kirim detail akun & target. Kami sesuaikan worker dan timeline.</p>
              </div>
              <CTAs />
            </div>
          </motion.div>
        </Section>

        {/* ───────── Footer ───────── */}
        <footer className="border-t border-white/10 bg-[#0a0f16]">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 md:flex-row">
            <div className="text-sm text-zinc-400">© {new Date().getFullYear()} {BRAND.name}. All rights reserved.</div>
            <div className="flex items-center gap-4 text-sm text-zinc-300">
              <a href="#" className="hover:text-zinc-100">Syarat</a>
              <a href="#" className="hover:text-zinc-100">Kebijakan</a>
              <a href={`https://wa.me/${BRAND.wa}`} target="_blank" className="hover:text-zinc-100">Kontak</a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
