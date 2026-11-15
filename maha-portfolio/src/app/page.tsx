"use client";
import {
  motion, AnimatePresence, useScroll, useSpring, useInView, animate,
  useMotionValue, useTransform, useMotionTemplate,
} from "framer-motion";
import { ReactNode, MouseEvent as RMouseEvent, useEffect, useRef, useState } from "react";
import {
  USER_INFO, PROJECTS, EXPERIENCE, SKILL_GROUPS, CERTIFICATIONS, PUBLICATION, EDUCATION, COCURRICULAR,
  WORKSHOP, HACKATHONS, ACHIEVEMENTS, ROTATING_WORDS, HERO_STATS, Project, Skill,
} from "../lib/data";

/* ---------- motion presets ---------- */
const EASE = [0.22, 1, 0.36, 1] as const;
const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.8, ease: EASE },
};
const stagger = (i: number) => ({ ...fadeUp, transition: { duration: 0.7, delay: i * 0.1, ease: EASE } });

const CONTACTS = [
  { label: "WhatsApp", value: "Chat instantly", href: `https://wa.me/${USER_INFO.whatsapp}`, type: "whatsapp" },
  { label: "Email", value: USER_INFO.email, href: `mailto:${USER_INFO.email}`, type: "email" },
  { label: "LinkedIn", value: "Let's connect", href: USER_INFO.linkedin, type: "linkedin" },
];

const NAV = [
  ["about", "About"],
  ["experience", "Experience"],
  ["projects", "Projects"],
  ["recognition", "Awards"],
  ["more", "Certifications"],
];

const ALL_SKILLS: Skill[] = SKILL_GROUPS.flatMap(g => g.skills);

/* ---------- icons ---------- */
function ContactIcon({ type, className = "w-5 h-5" }: { type: string; className?: string }) {
  if (type === "whatsapp") return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 10.5h.01M12 10.5h.01M15.5 10.5h.01M21 12c0 4.418-4.03 8-9 8a9.9 9.9 0 01-4.26-.95L3 20l1.4-3.72A7.4 7.4 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  );
  if (type === "email") return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 3a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14m-.5 15.5v-5.3a3.26 3.26 0 00-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 011.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 001.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 00-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );
}
const Arrow = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
);
const External = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
);
const Check = () => (
  <svg className="w-5 h-5 mt-0.5 shrink-0 text-[#D4AF37]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
);
const Zoom = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 8v6M8 11h6M19 11a8 8 0 11-16 0 8 8 0 0116 0z" /></svg>
);

/* ---------- building blocks ---------- */
function SectionHead({ eyebrow, title, action }: { eyebrow: string; title: string; action?: ReactNode }) {
  const words = title.split(" ");
  return (
    <div className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <motion.p {...fadeUp} className="text-[#D4AF37] uppercase tracking-[0.4em] text-xs font-bold mb-5 flex items-center gap-3">
          <span className="h-px w-10 bg-[#D4AF37]" />{eyebrow}
        </motion.p>
        <motion.h2 initial="hidden" whileInView="show" viewport={{ once: true, margin: "-40px" }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
          className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9]">
          {words.map((w, i) => (
            <span key={i} className="inline-block overflow-hidden mr-[0.25em] pb-1">
              <motion.span className="inline-block"
                variants={{ hidden: { y: "110%" }, show: { y: "0%", transition: { duration: 0.8, ease: EASE } } }}>
                {w}
              </motion.span>
            </span>
          ))}
        </motion.h2>
      </div>
      {action}
    </div>
  );
}

function Counter({ to, decimals = 0, prefix = "", suffix = "" }: { to: number; decimals?: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 1.8, ease: "easeOut", onUpdate: setVal });
    return () => c.stop();
  }, [inView, to]);
  return <span ref={ref}>{prefix}{val.toFixed(decimals)}{suffix}</span>;
}

function SkillLogo({ skill, size = "w-5 h-5" }: { skill: Skill; size?: string }) {
  const [failed, setFailed] = useState(false);
  if (skill.logo && !failed) return <img src={skill.logo} alt="" className={`${size} object-contain`} onError={() => setFailed(true)} />;
  return <span className="text-[#D4AF37] text-base leading-none">{skill.glyph ?? "✦"}</span>;
}

function RotatingWord() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI(n => (n + 1) % ROTATING_WORDS.length), 2400);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="relative block h-[1.4em] leading-[1.4em] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.span key={i}
          initial={{ y: "100%", opacity: 0, rotateX: -60 }} animate={{ y: "0%", opacity: 1, rotateX: 0 }} exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="absolute left-0 top-0 text-[#D4AF37] font-bold whitespace-nowrap">
          {ROTATING_WORDS[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

// Card with a gold spotlight that follows the cursor + subtle 3D tilt
function GlowCard({ children, className = "", tilt = false }: { children: ReactNode; className?: string; tilt?: boolean }) {
  const mx = useMotionValue(-300), my = useMotionValue(-300);
  const rx = useSpring(0, { stiffness: 200, damping: 20 }), ry = useSpring(0, { stiffness: 200, damping: 20 });
  const bg = useMotionTemplate`radial-gradient(420px circle at ${mx}px ${my}px, rgba(212,175,55,0.14), transparent 70%)`;
  const onMove = (e: RMouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(e.clientX - r.left); my.set(e.clientY - r.top);
    if (tilt) { ry.set(((e.clientX - r.left) / r.width - 0.5) * 8); rx.set(-((e.clientY - r.top) / r.height - 0.5) * 8); }
  };
  const onLeave = () => { mx.set(-300); my.set(-300); rx.set(0); ry.set(0); };
  return (
    <motion.div onMouseMove={onMove} onMouseLeave={onLeave}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
      className={`group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.025] hover:border-[#D4AF37]/40 transition-colors ${className}`}>
      <motion.div aria-hidden className="pointer-events-none absolute inset-0 z-0" style={{ background: bg }} />
      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
}

function Photo({ src, alt, onOpen, className = "aspect-[4/3]" }: { src: string; alt: string; onOpen: (s: string) => void; className?: string }) {
  return (
    <button onClick={() => onOpen(src)} className={`group/img relative overflow-hidden rounded-2xl border border-white/10 ${className}`}>
      <img src={src} alt={alt} className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-700" />
      <span className="absolute inset-0 bg-black/0 group-hover/img:bg-black/40 transition-colors flex items-center justify-center">
        <span className="opacity-0 group-hover/img:opacity-100 scale-75 group-hover/img:scale-100 transition-all bg-[#D4AF37] text-black rounded-full p-3"><Zoom /></span>
      </span>
    </button>
  );
}

/* ---------- page ---------- */
export default function Portfolio() {
  const [contactOpen, setContactOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [tab, setTab] = useState<"certs" | "talks" | "lead">("certs");
  const [copied, setCopied] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  // hero parallax
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const photoY = useTransform(heroP, [0, 1], [0, 120]);
  const nameY = useTransform(heroP, [0, 1], [0, -60]);

  // cursor glow
  const cx = useSpring(-500, { stiffness: 150, damping: 25 }), cy = useSpring(-500, { stiffness: 150, damping: 25 });
  useEffect(() => {
    const move = (e: MouseEvent) => { cx.set(e.clientX - 200); cy.set(e.clientY - 200); };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [cx, cy]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setContactOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setLightbox(null); };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); };
  }, []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(USER_INFO.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* clipboard unavailable */ }
  };

  const tabs = [
    { id: "certs", label: "Certifications" },
    { id: "talks", label: "Knowledge Sharing" },
    { id: "lead", label: "Leadership" },
  ] as const;

  return (
    <main className="relative text-white selection:bg-[#D4AF37]/40 overflow-x-hidden font-sans"
      style={{ background: "radial-gradient(ellipse at 20% 0%, #1a1200 0%, #0a0a0a 40%, #000000 100%)" }}>

      {/* scroll progress */}
      <motion.div style={{ scaleX: progress }} className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#D4AF37] to-[#f5e1a4] origin-left z-[60]" />

      {/* cursor glow (desktop) */}
      <motion.div aria-hidden style={{ x: cx, y: cy }}
        className="pointer-events-none fixed top-0 left-0 z-0 hidden md:block w-[400px] h-[400px] rounded-full bg-[#D4AF37]/[0.07] blur-[80px]" />

      {/* ambient */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.07, 0.12, 0.07] }} transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-[-15%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#D4AF37] blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-950/40 blur-[160px]" />
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "80px 80px" }} />
      </div>

      {/* NAV */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md border-b border-white/5 bg-black/40">
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-20 flex items-center justify-between">
          <a href="#top" className="text-2xl font-black tracking-tighter">
            MAHA<motion.span animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1.6, repeat: Infinity }} className="text-[#D4AF37]">.</motion.span>
          </a>
          <div className="hidden lg:flex items-center gap-10 text-[15px] font-medium text-gray-400">
            {NAV.map(([id, label]) => (
              <a key={id} href={`#${id}`} className="relative hover:text-white transition-colors group">
                {label}
                <span className="absolute -bottom-1.5 left-0 h-[2px] w-0 bg-[#D4AF37] group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div className="relative" ref={dropdownRef}>
              <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }} onClick={() => setContactOpen(o => !o)}
                className="bg-[#D4AF37] text-black px-6 py-2.5 rounded-full font-bold shadow-[0_0_25px_rgba(212,175,55,0.35)]">
                Let&apos;s Talk
              </motion.button>
              <AnimatePresence>
                {contactOpen && (
                  <motion.div initial={{ opacity: 0, y: -8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 top-full mt-3 w-72 bg-black/90 backdrop-blur-xl border border-[#D4AF37]/30 rounded-2xl p-2 shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
                    {CONTACTS.map(c => (
                      <a key={c.label} href={c.href} target="_blank" rel="noopener noreferrer" onClick={() => setContactOpen(false)}
                        className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-[#D4AF37]/10 transition-all group">
                        <span className="text-[#D4AF37]"><ContactIcon type={c.type} /></span>
                        <span className="min-w-0">
                          <span className="block text-white font-bold group-hover:text-[#D4AF37] transition-colors">{c.label}</span>
                          <span className="block text-gray-500 text-sm truncate">{c.value}</span>
                        </span>
                      </a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button onClick={() => setMenuOpen(o => !o)} className="lg:hidden p-2 text-gray-300" aria-label="Menu">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" d={menuOpen ? "M6 6l12 12M18 6L6 18" : "M4 7h16M4 12h16M4 17h16"} />
              </svg>
            </button>
          </div>
        </div>
        <AnimatePresence>
          {menuOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="lg:hidden overflow-hidden border-t border-white/5 bg-black/95">
              <div className="px-6 py-5 flex flex-col gap-4 text-lg text-gray-300">
                {NAV.map(([id, label]) => <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>{label}</a>)}
                <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* HERO */}
      <section id="top" ref={heroRef} className="relative min-h-screen flex items-center px-6 md:px-10 pt-28 pb-16">
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-[1.25fr_1fr] gap-12 lg:gap-8 items-center">
          {/* left */}
          <motion.div style={{ y: nameY }}>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2.5 bg-white/[0.05] border border-white/10 rounded-full px-5 py-2 mb-8">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
              </span>
              <span className="text-sm text-gray-300">Junior Engineer @ <span className="text-white font-bold">AT&amp;S</span> · Data Analytics &amp; Visualizations</span>
            </motion.div>

            <h1 className="font-black tracking-tighter leading-[0.85] mb-8" style={{ fontSize: "clamp(3.5rem, 8.5vw, 8.5rem)" }}>
              {["MAHA", "VAARSHINIE"].map((line, li) => (
                <span key={line} className="block overflow-hidden pb-2">
                  <motion.span className="block bg-gradient-to-b from-white via-white/90 to-gray-500 bg-clip-text text-transparent"
                    initial={{ y: "105%" }} animate={{ y: "0%" }} transition={{ duration: 1, delay: 0.2 + li * 0.15, ease: EASE }}>
                    {line}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
              className="text-2xl md:text-4xl text-gray-200 font-light mb-5" style={{ perspective: 600 }}>
              I turn production data into <RotatingWord />
            </motion.p>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
              className="text-lg text-gray-400 max-w-xl mb-10 leading-relaxed">
              BI &amp; data analytics for semiconductor manufacturing, backed by award-winning AI research.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
              className="flex flex-wrap gap-4">
              <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} href="/resume.pdf" target="_blank" rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 bg-[#D4AF37] text-black px-8 py-4 rounded-full font-bold text-base shadow-[0_0_30px_rgba(212,175,55,0.35)]">
                View Resume <Arrow className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.a>
              {[["LinkedIn", USER_INFO.linkedin], ["GitHub", USER_INFO.github]].map(([label, href]) => (
                <motion.a key={label} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} href={href} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-white/20 hover:border-[#D4AF37] hover:text-[#D4AF37] px-8 py-4 rounded-full font-bold text-base text-gray-200 transition-colors">
                  {label} <External />
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          {/* right: photo */}
          <motion.div style={{ y: photoY }} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.3, ease: EASE }}
            className="relative mx-auto w-full max-w-[420px]">
            {/* spinning ring */}
            <motion.div aria-hidden animate={{ rotate: 360 }} transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-5 rounded-[3rem] opacity-80"
              style={{ background: "conic-gradient(from 0deg, transparent, #D4AF37, transparent 30%, transparent 60%, #D4AF37aa, transparent 80%)", filter: "blur(18px)" }} />
            <div className="relative rounded-[2.5rem] p-[2px] bg-gradient-to-br from-[#D4AF37] via-[#D4AF37]/20 to-[#D4AF37]/60">
              <div className="rounded-[2.4rem] overflow-hidden bg-black aspect-[4/5]">
                <img src="/maha.jpg" alt="Maha Vaarshinie presenting a Power BI dashboard" className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-1000" />
              </div>
            </div>

            {/* caption */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}
              className="mt-5 flex items-center justify-center gap-2 text-sm text-gray-400">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
              Presenting a Power BI dashboard
            </motion.div>
          </motion.div>
        </div>

        {/* scroll cue */}
        <motion.a href="#about" animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}
          className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 text-gray-500 text-xs tracking-[0.3em] uppercase">
          Scroll
          <span className="w-6 h-10 rounded-full border-2 border-gray-600 flex justify-center pt-2"><span className="w-1 h-2 rounded-full bg-[#D4AF37]" /></span>
        </motion.a>
      </section>

      {/* SKILL MARQUEE */}
      <div className="relative py-6 -rotate-[1.5deg] scale-[1.03] bg-[#D4AF37] text-black overflow-hidden">
        <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="flex w-max gap-10 whitespace-nowrap">
          {[...ALL_SKILLS, ...ALL_SKILLS].map((s, i) => (
            <span key={i} className="inline-flex items-center gap-10 text-2xl md:text-3xl font-black uppercase tracking-tight">
              {s.name}<span className="text-black/40">✦</span>
            </span>
          ))}
        </motion.div>
      </div>

      {/* STATS */}
      <section className="px-6 md:px-10 pt-24">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {HERO_STATS.map((s, i) => (
            <motion.div key={s.label} {...stagger(i)} whileHover={{ y: -8, rotate: i % 2 ? 1 : -1 }}
              className="bg-white/[0.03] border border-white/10 hover:border-[#D4AF37]/40 rounded-3xl p-7 transition-colors">
              <p className="text-4xl md:text-6xl font-black tracking-tighter text-white">
                <Counter to={s.value} decimals={s.decimals ?? 0} prefix={s.prefix ?? ""} suffix={s.suffix ?? ""} />
              </p>
              <p className="text-sm uppercase tracking-wider text-gray-400 mt-3">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-28 px-6 md:px-10 scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <SectionHead eyebrow="About Me" title="Data that drives the factory floor" />
          <div className="grid lg:grid-cols-5 gap-10">
            <motion.p {...fadeUp} className="lg:col-span-3 text-xl md:text-2xl text-gray-300 leading-relaxed font-light">
              {USER_INFO.about}
            </motion.p>
            <div className="lg:col-span-2 flex flex-col gap-5">
              {EDUCATION.map((edu, i) => (
                <motion.div key={i} {...stagger(i)}>
                  <GlowCard className="p-8">
                    <p className="text-xs font-mono tracking-[0.3em] text-[#D4AF37] mb-3">{edu.date}</p>
                    <h3 className="text-xl font-bold leading-snug mb-1 group-hover:text-[#D4AF37] transition-colors">{edu.degree}</h3>
                    <p className="text-gray-400 italic mb-5">{edu.institution}</p>
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">CGPA</p>
                        <p className="text-5xl font-black text-white/90">{edu.cgpa}</p>
                      </div>
                      <p className="text-gray-500 text-xs tracking-widest uppercase">{edu.location}</p>
                    </div>
                  </GlowCard>
                </motion.div>
              ))}
            </div>
          </div>

          {/* skills */}
          <div className="grid md:grid-cols-3 gap-5 mt-16">
            {SKILL_GROUPS.map((g, gi) => (
              <motion.div key={g.title} {...stagger(gi)}>
                <GlowCard className="p-8 h-full">
                  <p className="text-sm uppercase tracking-[0.3em] text-[#D4AF37] font-bold mb-6">{g.title}</p>
                  <div className="flex flex-wrap gap-2.5">
                    {g.skills.map((s, i) => (
                      <motion.span key={s.name}
                        initial={{ opacity: 0, scale: 0.6 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                        transition={{ delay: i * 0.04, type: "spring", stiffness: 300, damping: 18 }}
                        whileHover={{ y: -4, scale: 1.06 }}
                        className="inline-flex items-center gap-2.5 bg-white/[0.04] border border-white/10 hover:border-[#D4AF37]/60 rounded-full pl-2 pr-4 py-2 cursor-default">
                        <span className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center"><SkillLogo skill={s} /></span>
                        <span className="text-sm font-medium text-gray-200">{s.name}</span>
                      </motion.span>
                    ))}
                  </div>
                </GlowCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" className="py-28 px-6 md:px-10 border-t border-white/5 scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <SectionHead eyebrow="Professional Journey" title="Where I work" />
          <div className="flex flex-col gap-8">
            {EXPERIENCE.map((exp, i) => (
              <motion.div key={exp.role} {...stagger(i)}>
                <GlowCard className={`p-8 md:p-12 ${exp.current ? "bg-gradient-to-br from-[#D4AF37]/[0.09] to-transparent border-[#D4AF37]/25" : ""}`}>
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
                    <div>
                      {exp.current && (
                        <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] bg-[#D4AF37] text-black px-4 py-1.5 rounded-full mb-4">
                          <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" /> Current Role
                        </span>
                      )}
                      <h3 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">{exp.role}</h3>
                      <p className="text-lg text-gray-300 mt-3">{exp.company}</p>
                      <p className="text-gray-500 mt-1">{exp.location}</p>
                    </div>
                    <span className="text-base font-mono text-[#D4AF37] whitespace-nowrap md:mt-2">{exp.date}</span>
                  </div>
                  <ul className="grid md:grid-cols-2 gap-x-10 gap-y-4 mb-8">
                    {exp.tasks.map((t, ti) => (
                      <motion.li key={t} initial={{ opacity: 0, x: -15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                        transition={{ delay: ti * 0.07 }}
                        className="flex gap-3 text-base md:text-lg text-gray-300 leading-relaxed"><Check />{t}</motion.li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-2.5">
                    {exp.tools.map(t => (
                      <span key={t} className="text-xs font-bold tracking-wider uppercase text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/25 px-4 py-2 rounded-full">{t}</span>
                    ))}
                  </div>
                  {exp.images && exp.images.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10">
                      {exp.images.map((img, idx) => <Photo key={idx} src={img} alt={`${exp.role} ${idx + 1}`} onOpen={setLightbox} />)}
                    </div>
                  )}
                </GlowCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="py-28 px-6 md:px-10 border-t border-white/5 scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <SectionHead eyebrow="Intelligence Registry" title="Selected work" action={
            <motion.a whileHover={{ scale: 1.05 }} href={USER_INFO.github} target="_blank" rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 border border-[#D4AF37]/50 hover:bg-[#D4AF37] hover:text-black px-6 py-3 rounded-full font-bold text-[#D4AF37] transition-colors self-start md:self-auto">
              All on GitHub <Arrow className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.a>
          } />
          <div className="grid md:grid-cols-2 gap-8">
            {PROJECTS.map((p: Project, i: number) => (
              <motion.div key={p.title} {...stagger(i)}>
                <GlowCard tilt className="h-full">
                  <a href={p.repo} target="_blank" rel="noopener noreferrer" className="flex flex-col h-full">
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <img src={p.image} alt={p.title} className="w-full h-full object-cover grayscale-[60%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                      <span className="absolute top-5 left-6 text-6xl font-black text-transparent [-webkit-text-stroke:1.5px_rgba(212,175,55,0.8)]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <div className="p-8 flex flex-col flex-1">
                      <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-3 group-hover:text-[#D4AF37] transition-colors">{p.title}</h3>
                      <p className="text-gray-400 text-base md:text-lg leading-relaxed mb-6">{p.desc}</p>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {p.tags.map(tag => (
                          <span key={tag} className="text-xs font-bold tracking-[0.15em] uppercase text-[#D4AF37] bg-[#D4AF37]/5 px-4 py-2 rounded-xl border border-[#D4AF37]/15">{tag}</span>
                        ))}
                      </div>
                      {p.repo && (
                        <span className="mt-auto inline-flex items-center gap-2 font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                          View repository <Arrow className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                        </span>
                      )}
                    </div>
                  </a>
                </GlowCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* RECOGNITION */}
      <section id="recognition" className="py-28 px-6 md:px-10 border-t border-white/5 scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <SectionHead eyebrow="Awards & Achievements" title="Recognition" />
          <div className="grid lg:grid-cols-3 gap-6">
            {ACHIEVEMENTS[0] && (
              <motion.div {...stagger(0)} className="lg:col-span-2">
                <GlowCard className="h-full p-10 md:p-12 bg-gradient-to-br from-[#D4AF37]/[0.14] to-transparent border-[#D4AF37]/30">
                  <motion.div animate={{ y: [0, -10, 0], rotate: [0, 8, -4, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-8 right-8 text-7xl select-none" aria-hidden>🥈</motion.div>
                  <span className="inline-block bg-[#D4AF37] text-black text-xs font-black uppercase tracking-[0.2em] px-5 py-2 rounded-full mb-6 shadow-[0_0_20px_rgba(212,175,55,0.35)]">{ACHIEVEMENTS[0].award}</span>
                  <h3 className="text-3xl md:text-4xl font-black tracking-tight mb-2 pr-20">{ACHIEVEMENTS[0].title}</h3>
                  <p className="text-[#D4AF37] mb-6">{ACHIEVEMENTS[0].organisation} · {ACHIEVEMENTS[0].date}</p>
                  <p className="text-gray-300 text-lg leading-relaxed mb-8">{ACHIEVEMENTS[0].desc}</p>
                  {ACHIEVEMENTS[0].link && (
                    <a href={ACHIEVEMENTS[0].link} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[#D4AF37] font-bold tracking-widest uppercase border-b-2 border-[#D4AF37] pb-1 hover:text-white hover:border-white transition-colors">
                      {ACHIEVEMENTS[0].linkLabel} <External />
                    </a>
                  )}
                </GlowCard>
              </motion.div>
            )}
            {ACHIEVEMENTS[1] && (
              <motion.div {...stagger(1)}>
                <GlowCard className="h-full p-10 flex flex-col">
                  <p className="text-sm uppercase tracking-[0.25em] text-[#D4AF37] font-bold mb-4">{ACHIEVEMENTS[1].award}</p>
                  <p className="text-8xl font-black tracking-tighter text-[#D4AF37] leading-none">Top <Counter to={5} /></p>
                  <p className="uppercase tracking-widest text-gray-400 mt-3">{ACHIEVEMENTS[1].stat?.label}</p>
                  <p className="text-gray-300 text-lg leading-relaxed mt-auto pt-8">{ACHIEVEMENTS[1].desc}</p>
                </GlowCard>
              </motion.div>
            )}
            <motion.div {...stagger(2)} className="lg:col-span-2">
              <GlowCard className="h-full p-10 md:p-12">
                <p className="text-sm uppercase tracking-[0.25em] text-[#D4AF37] font-bold mb-5">📄 Selected Publication</p>
                <h3 className="text-2xl md:text-4xl font-bold italic leading-tight mb-4">&ldquo;{PUBLICATION.title}&rdquo;</h3>
                <p className="text-gray-400 text-lg mb-8">{PUBLICATION.details}</p>
                <a href={PUBLICATION.certPdf} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#D4AF37] font-bold tracking-widest uppercase border-b-2 border-[#D4AF37] pb-1 hover:text-white hover:border-white transition-colors">
                  Presentation Certificate <External />
                </a>
              </GlowCard>
            </motion.div>
            <motion.div {...stagger(3)}>
              <GlowCard className="h-full p-10 bg-gradient-to-br from-[#111] to-black">
                <p className="text-sm uppercase tracking-[0.25em] text-[#D4AF37] font-bold mb-5">⚡ Hackathons</p>
                <h3 className="text-4xl font-black italic tracking-tighter mb-6 leading-none">2x International Participant</h3>
                <div className="flex flex-col gap-3">
                  {HACKATHONS.map(h => (
                    <a key={h.title} href={h.certPath} target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-between font-bold text-gray-200 hover:text-black hover:bg-[#D4AF37] border border-[#D4AF37]/30 rounded-xl px-5 py-3.5 transition-colors">
                      {h.title} <External />
                    </a>
                  ))}
                </div>
              </GlowCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* BEYOND WORK */}
      <section id="more" className="py-28 px-6 md:px-10 border-t border-white/5 scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <SectionHead eyebrow="Credentials & Community" title="Beyond the dashboard" />
          <div className="inline-flex flex-wrap gap-1 bg-white/[0.04] border border-white/10 rounded-full p-1.5 mb-10">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`relative px-5 md:px-7 py-3 rounded-full text-sm md:text-base font-bold transition-colors ${tab === t.id ? "text-black" : "text-gray-400 hover:text-white"}`}>
                {tab === t.id && <motion.span layoutId="tab-pill" className="absolute inset-0 bg-[#D4AF37] rounded-full" transition={{ type: "spring", stiffness: 380, damping: 30 }} />}
                <span className="relative">{t.label}</span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
              {tab === "certs" && (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {CERTIFICATIONS.map((c, i) => (
                    <motion.div key={c.name} initial={{ opacity: 0, y: 20, rotate: -2 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ delay: i * 0.07 }}>
                      <GlowCard className="h-full p-7 flex flex-col">
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <span className="w-12 h-12 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-xl">🎓</span>
                          {c.date && <span className="text-xs font-mono text-gray-500 whitespace-nowrap shrink-0">{c.date}</span>}
                        </div>
                        <p className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] font-bold mb-2">{c.issuer}</p>
                        <h4 className="text-lg font-bold leading-snug text-white mb-4">{c.name}</h4>
                        <div className="mt-auto flex items-center justify-between gap-2">
                          {c.credentialId && <span className="text-xs font-mono text-gray-500 truncate">ID {c.credentialId}</span>}
                          {c.url && (
                            <a href={c.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-bold text-[#D4AF37] hover:text-white">
                              Verify <External className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </GlowCard>
                    </motion.div>
                  ))}
                </div>
              )}

              {tab === "talks" && WORKSHOP.map(ws => (
                <GlowCard key={ws.title} className="p-8 md:p-10">
                  <div className="max-w-3xl mb-8">
                    <h3 className="text-3xl md:text-4xl font-black tracking-tight mb-2">{ws.title}</h3>
                    <p className="text-[#D4AF37] mb-4">{ws.organisation} · {ws.date}</p>
                    <p className="text-gray-300 text-lg leading-relaxed">{ws.desc}</p>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4">
                    {ws.images.map((img, idx) => <Photo key={idx} src={img} alt={`Workshop ${idx + 1}`} onOpen={setLightbox} />)}
                  </div>
                </GlowCard>
              ))}

              {tab === "lead" && (
                <div className="grid md:grid-cols-3 gap-6">
                  {COCURRICULAR.map(item => (
                    <GlowCard key={item.role} className="h-full">
                      {item.images?.[0] && <Photo src={item.images[0]} alt={item.role} onOpen={setLightbox} className="aspect-[4/3] w-full !rounded-none !border-0" />}
                      <div className="p-7">
                        <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-bold">{item.category}</span>
                        <h4 className="text-xl font-bold mt-2 group-hover:text-[#D4AF37] transition-colors">{item.role}</h4>
                        <p className="text-gray-400 mt-1">{item.organisation}</p>
                        {item.date && <p className="text-sm font-mono text-gray-500 mt-3">{item.date}</p>}
                      </div>
                    </GlowCard>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-28 px-6 md:px-10 scroll-mt-20">
        <motion.div {...fadeUp} className="max-w-7xl mx-auto relative rounded-[2.5rem] p-[2px] overflow-hidden">
          <motion.div aria-hidden animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-[100%]"
            style={{ background: "conic-gradient(from 0deg, transparent 0deg, #D4AF37 50deg, transparent 110deg, transparent 180deg, #D4AF37 230deg, transparent 290deg)" }} />
          <div className="relative rounded-[calc(2.5rem-2px)] bg-[#0b0b0b] p-10 md:p-16 grid lg:grid-cols-2 gap-12 items-center overflow-hidden">
            <div aria-hidden className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#D4AF37]/10 blur-[100px]" />
            <div className="relative">
              <p className="text-[#D4AF37] uppercase tracking-[0.4em] text-xs font-bold mb-6 flex items-center gap-3">
                <span className="h-px w-10 bg-[#D4AF37]" />Get in touch
              </p>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.95] mb-6">
                Got data that needs a{" "}
                <span className="bg-gradient-to-r from-[#D4AF37] to-[#f5e1a4] bg-clip-text text-transparent">story?</span>{" "}
                <motion.span className="inline-block origin-[70%_70%]" animate={{ rotate: [0, 18, -8, 18, 0] }} transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 1.5 }}>👋</motion.span>
              </h2>
              <p className="text-gray-300 text-lg md:text-xl leading-relaxed">
                Open to collaborations, BI and analytics consulting, speaking and workshop invitations. Drop a message — I usually reply within a day.
              </p>
            </div>
            <div className="relative flex flex-col gap-4">
              {CONTACTS.map((c, i) => (
                <motion.div key={c.label} {...stagger(i)} whileHover={{ x: 8 }} className="relative">
                  <a href={c.href} target="_blank" rel="noopener noreferrer"
                    className="group flex items-center gap-5 bg-white/[0.04] border border-white/10 hover:border-[#D4AF37] hover:bg-[#D4AF37]/[0.08] rounded-2xl px-6 py-5 transition-all">
                    <motion.span whileHover={{ rotate: [0, -15, 15, 0], scale: 1.1 }} transition={{ duration: 0.5 }}
                      className="w-14 h-14 rounded-2xl bg-[#D4AF37] text-black flex items-center justify-center shrink-0">
                      <ContactIcon type={c.type} className="w-6 h-6" />
                    </motion.span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-bold text-xl group-hover:text-[#D4AF37] transition-colors">{c.label}</span>
                      <span className="block text-gray-400 truncate">{c.value}</span>
                    </span>
                    <Arrow className={`w-6 h-6 text-gray-500 group-hover:text-[#D4AF37] group-hover:translate-x-1 transition-all ${c.type === "email" ? "mr-20" : ""}`} />
                  </a>
                  {c.type === "email" && (
                    <button onClick={copyEmail}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-bold uppercase tracking-wider text-gray-300 hover:text-black hover:bg-[#D4AF37] border border-white/15 rounded-lg px-3 py-2 transition-colors">
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.span key={copied ? "y" : "n"} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="block">
                          {copied ? "Copied ✓" : "Copy"}
                        </motion.span>
                      </AnimatePresence>
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      <footer className="border-t border-white/5 py-10 px-6 md:px-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p className="tracking-[0.3em] uppercase">© 2026 Maha Vaarshinie Rajoo</p>
          <motion.a whileHover={{ y: -3 }} href="#top" className="inline-flex items-center gap-2 hover:text-[#D4AF37] transition-colors">
            Back to top
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>
          </motion.a>
        </div>
      </footer>

      {/* LIGHTBOX */}
      <AnimatePresence>
        {lightbox && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setLightbox(null)}
            className="fixed inset-0 z-[100000] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-10 cursor-zoom-out">
            <motion.img key={lightbox} src={lightbox} alt="" initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl" />
            <button className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-[#D4AF37] hover:text-black text-2xl" aria-label="Close">✕</button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
