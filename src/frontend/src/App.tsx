import { useCallback, useEffect, useRef, useState } from "react";

// ── Types ───────────────────────────────────────────────────
type MapZone = "residential" | "energy" | "parks" | "cultural" | null;

interface ZoneInfo {
  id: MapZone;
  label: string;
  icon: string;
  description: string;
  details: string[];
  image: string;
  color: string;
}

// ── Zone data ───────────────────────────────────────────────
const _ZONES: ZoneInfo[] = [
  {
    id: "residential",
    label: "Residential Zone",
    icon: "🏠",
    description:
      "Home to 2,000+ eco-conscious residents living in energy-efficient apartments and houses powered entirely by renewables.",
    details: [
      "Solar-powered homes",
      "Green rooftop gardens",
      "Zero-waste buildings",
    ],
    image: "/assets/generated/eco-apartments.dim_800x600.jpg",
    color: "oklch(0.52 0.18 148)",
  },
  {
    id: "energy",
    label: "Energy Zone",
    icon: "⚡",
    description:
      "The beating heart of Eco Sphere\u2019s power grid \u2014 2 solar panel farms and 40 wind turbines deliver 100% clean energy to the entire city.",
    details: ["2 solar farms", "40 wind turbines", "Hydrogen storage grid"],
    image: "/assets/generated/solar-energy.dim_800x600.jpg",
    color: "oklch(0.72 0.22 88)",
  },
  {
    id: "parks",
    label: "Green Parks",
    icon: "🌳",
    description:
      "1 urban park spanning 35 acres. Biodiversity zones, community gardens, and natural wetlands thrive at the city\u2019s core.",
    details: [
      "35 acres of green space",
      "Biodiversity zones",
      "400 native species",
    ],
    image: "/assets/generated/green-park.dim_800x600.jpg",
    color: "oklch(0.60 0.20 148)",
  },
  {
    id: "cultural",
    label: "Temples",
    icon: "🛕",
    description:
      "A sacred district home to beautifully designed eco-friendly Hindu temples that blend spiritual heritage with sustainable architecture and natural surroundings.",
    details: [
      "Eco-friendly temples",
      "Peaceful meditation gardens",
      "Heritage architecture",
    ],
    image: "/assets/generated/hindu-temple.dim_800x500.jpg",
    color: "oklch(0.55 0.18 260)",
  },
];

// ── Apartment detail data ───────────────────────────────────
const APARTMENT_DETAILS = [
  {
    id: "solar-residences",
    title: "Solar Residences",
    emoji: "🏙️",
    shortDesc:
      "Award-winning apartment towers with integrated solar facades, rainwater harvesting, and biophilic interior design.",
    longDesc:
      "Solar Residences are the flagship housing of Eco Sphere. Each tower is clad in high-efficiency photovoltaic panels that generate enough electricity to power every unit, with surplus fed back into the city grid. Rainwater is collected from every rooftop, filtered, and reused for irrigation and toilet flushing, reducing freshwater consumption by 60%. Interiors feature living walls, natural materials, and floor-to-ceiling windows that flood every room with daylight \u2014 reducing lighting energy by up to 40%.",
    highlights: [
      "100% solar-powered units",
      "60% freshwater reduction via rainwater harvesting",
      "Living wall interiors",
      "Smart home energy management",
      "Rooftop community terraces",
    ],
  },
  {
    id: "green-towers",
    title: "Green Towers",
    emoji: "🌆",
    shortDesc:
      "Vertical forests rising 40 storeys high, each level wrapped in 3,000 plants that purify the air naturally.",
    longDesc:
      "Eco Sphere\u2019s Green Towers redefine urban living by integrating nature at every level. Each of the 40 floors is encircled by a lush terrace garden hosting over 75 plant species \u2014 from flowering shrubs to fruit trees. The plants absorb CO\u2082, reduce ambient temperature by 3\u20135\u00b0C, and provide residents with fresh produce year-round. A dedicated team of urban botanists tends the gardens, and residents are encouraged to adopt a personal planting plot.",
    highlights: [
      "3,000 plants per tower",
      "40 storeys of vertical forest",
      "Ambient temperature reduced by 3\u20135\u00b0C",
      "Fresh produce for residents",
      "Urban botanist on site",
    ],
  },
  {
    id: "ecovilla",
    title: "EcoVilla District",
    emoji: "🏡",
    shortDesc:
      "Low-rise villa clusters nestled within community gardens \u2014 the perfect blend of private comfort and shared green space.",
    longDesc:
      "The EcoVilla District offers a quieter, more intimate way to live sustainably. Low-rise villas are arranged in clusters around shared community gardens where residents grow vegetables, host outdoor meals, and gather for events. Each villa is built from recycled timber and natural stone, insulated with eco-friendly materials, and heated or cooled entirely by geothermal systems. Car-free pedestrian pathways connect every home to parks, schools, and transit hubs.",
    highlights: [
      "Recycled timber & stone construction",
      "Geothermal heating and cooling",
      "Car-free pedestrian zones",
      "Shared community gardens",
      "Direct access to parks & transit",
    ],
  },
];

// ── FAQ data ────────────────────────────────────────────────
const FAQS = [
  {
    id: "q1",
    q: "How does Eco Sphere generate all its electricity?",
    a: "Eco Sphere uses 2 large solar panel farms and 40 wind turbines to generate 100% of its electricity from renewable sources. Surplus energy is stored in a hydrogen-based grid for use on cloudy or still days.",
  },
  {
    id: "q2",
    q: "How many people live in Eco Sphere?",
    a: "Currently 2,000+ residents call Eco Sphere home. The city is designed to grow sustainably, with every new building required to meet strict zero-carbon construction standards.",
  },
  {
    id: "q3",
    q: "What makes the apartments eco-friendly?",
    a: "Every apartment features solar-integrated facades, rainwater harvesting systems, living walls, and smart energy management. Buildings are insulated with natural materials and generate more energy than they consume.",
  },
  {
    id: "q4",
    q: "Is there green space for residents?",
    a: "Yes! Eco Sphere has 1 urban park spanning 35 acres, with biodiversity zones hosting 400+ native species, community gardens, natural wetlands, and car-free pedestrian pathways connecting every neighbourhood.",
  },
  {
    id: "q5",
    q: "What is the significance of the temples?",
    a: "The Temples District blends spiritual heritage with sustainable design. The eco-friendly Hindu temples use reclaimed stone, natural ventilation, and rainwater gardens, creating a peaceful sanctuary that honours both culture and the environment.",
  },
];

// ── Scroll-reveal hook ────────────────────────────────────
function useRevealOnScroll(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll(".reveal");
            let idx = 0;
            for (const card of cards) {
              setTimeout(() => card.classList.add("visible"), idx * 150);
              idx++;
            }
          }
        }
      },
      { threshold },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return ref;
}

// ── Tilt card hook ────────────────────────────────────────
function useTilt() {
  const ref = useRef<HTMLDivElement>(null);
  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(600px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateY(-6px)`;
  }, []);
  const handleLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = "";
  }, []);
  return { ref, handleMove, handleLeave };
}

// ── Scroll progress bar ──────────────────────────────────
function ScrollProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      setPct((el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div
      className="fixed top-0 left-0 right-0 z-[60] h-0.5 pointer-events-none"
      style={{ background: "transparent" }}
    >
      <div
        className="h-full transition-all duration-75"
        style={{
          width: `${pct}%`,
          background:
            "linear-gradient(90deg, oklch(0.52 0.18 148), oklch(0.72 0.22 88), oklch(0.52 0.18 148))",
          boxShadow: "0 0 8px oklch(0.65 0.22 148)",
        }}
      />
    </div>
  );
}

// ── Apartment Modal ─────────────────────────────────────────
interface AptModalProps {
  apt: (typeof APARTMENT_DETAILS)[0] | null;
  onClose: () => void;
}

function ApartmentModal({ apt, onClose }: AptModalProps) {
  useEffect(() => {
    if (!apt) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [apt, onClose]);

  if (!apt) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: "oklch(0.05 0.03 200 / 0.85)",
        backdropFilter: "blur(12px)",
      }}
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
      data-ocid="apartments.modal"
    >
      <div
        className="relative w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl"
        style={{
          background: "rgba(15, 25, 35, 0.85)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(100, 220, 120, 0.3)",
          boxShadow: "0 0 60px oklch(0.52 0.18 148 / 0.25)",
        }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        role="presentation"
      >
        <div
          className="px-8 pt-8 pb-6"
          style={{
            background:
              "linear-gradient(135deg, rgba(30,80,40,0.5), rgba(20,30,60,0.5))",
            borderBottom: "1px solid rgba(100,220,120,0.15)",
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span
                className="text-5xl w-16 h-16 flex items-center justify-center rounded-2xl"
                style={{ background: "rgba(40,120,60,0.3)" }}
              >
                {apt.emoji}
              </span>
              <h3
                className="font-display font-bold text-2xl"
                style={{ color: "oklch(0.85 0.18 148)" }}
              >
                {apt.title}
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all text-xl"
              aria-label="Close"
              data-ocid="apartments.close_button"
            >
              ×
            </button>
          </div>
        </div>
        <div className="px-8 py-6">
          <p
            className="text-base leading-relaxed mb-6"
            style={{ color: "oklch(0.75 0.05 200)" }}
          >
            {apt.longDesc}
          </p>
          <h4
            className="font-semibold text-sm uppercase tracking-widest mb-3"
            style={{ color: "oklch(0.65 0.18 148)" }}
          >
            Key Highlights
          </h4>
          <ul className="space-y-2">
            {apt.highlights.map((h) => (
              <li
                key={h}
                className="flex items-start gap-3 text-sm"
                style={{ color: "oklch(0.78 0.06 200)" }}
              >
                <span
                  className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                  style={{
                    background: "oklch(0.52 0.18 148 / 0.2)",
                    color: "oklch(0.75 0.18 148)",
                    border: "1px solid oklch(0.52 0.18 148 / 0.4)",
                  }}
                >
                  ✓
                </span>
                {h}
              </li>
            ))}
          </ul>
        </div>
        <div
          className="px-8 pb-8"
          style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
        >
          <button
            type="button"
            onClick={onClose}
            className="mt-6 w-full py-3 rounded-full font-semibold text-white transition-all hover:scale-105 active:scale-95"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.52 0.18 148), oklch(0.45 0.20 165))",
              boxShadow: "0 4px 20px oklch(0.52 0.18 148 / 0.4)",
            }}
            data-ocid="apartments.confirm_button"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Navbar with active section tracking ──────────────────────
const NAV_LINKS = [
  { label: "Home", id: "home" },
  { label: "About", id: "about" },
  { label: "Apartments", id: "apartments" },
  { label: "Energy", id: "energy" },
  { label: "Parks", id: "parks" },
  { label: "Video", id: "video" },
  { label: "Map", id: "map" },
  { label: "FAQ", id: "faq" },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState("home");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Track which section is in view
  useEffect(() => {
    const sectionIds = NAV_LINKS.map((l) => l.id);
    const observers: IntersectionObserver[] = [];
    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (!el) continue;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveId(id);
        },
        { threshold: 0.35 },
      );
      obs.observe(el);
      observers.push(obs);
    }
    return () => {
      for (const o of observers) o.disconnect();
    };
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4"
        style={{ paddingTop: "14px" }}
      >
        <div
          className={`hidden md:flex items-center justify-between gap-1 px-4 py-2 transition-all duration-500 ${
            scrolled ? "navbar-scrolled" : "navbar-default"
          }`}
          style={{ borderRadius: "9999px", maxWidth: "880px", width: "100%" }}
        >
          <button
            type="button"
            className="flex items-center gap-2 mr-2"
            onClick={() => scrollTo("home")}
            data-ocid="nav.link"
          >
            <img
              src="/assets/generated/eco-sphere-logo-transparent.dim_200x200.png"
              alt="Eco Sphere Logo"
              className="h-7 w-7 object-contain"
            />
            <span
              className="font-display font-bold text-sm"
              style={{ color: "oklch(0.75 0.22 148)" }}
            >
              Eco Sphere
            </span>
          </button>
          <div className="flex items-center gap-0.5">
            {NAV_LINKS.map((link) => (
              <button
                type="button"
                key={link.id}
                onClick={() => scrollTo(link.id)}
                data-ocid={`nav.${link.id}.link`}
                className="relative px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
                style={{
                  color:
                    activeId === link.id ? "white" : "rgba(255,255,255,0.65)",
                  background:
                    activeId === link.id
                      ? "rgba(80,200,100,0.18)"
                      : "transparent",
                  border:
                    activeId === link.id
                      ? "1px solid rgba(100,220,120,0.35)"
                      : "1px solid transparent",
                }}
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile */}
        <div
          className={`md:hidden flex items-center justify-between w-full px-4 py-2 transition-all duration-500 ${
            scrolled ? "navbar-scrolled" : "navbar-default"
          }`}
          style={{ borderRadius: "9999px" }}
        >
          <button
            type="button"
            className="flex items-center gap-2"
            onClick={() => scrollTo("home")}
            data-ocid="nav.mobile.link"
          >
            <img
              src="/assets/generated/eco-sphere-logo-transparent.dim_200x200.png"
              alt="Eco Sphere Logo"
              className="h-7 w-7 object-contain"
            />
            <span
              className="font-display font-bold text-sm"
              style={{ color: "oklch(0.75 0.22 148)" }}
            >
              Eco Sphere
            </span>
          </button>
          <button
            type="button"
            className="text-white/80 hover:text-white p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <div
              className={`w-5 h-0.5 bg-current transition-all ${menuOpen ? "rotate-45 translate-y-1.5" : ""}`}
            />
            <div
              className={`w-5 h-0.5 bg-current my-1 transition-all ${menuOpen ? "opacity-0" : ""}`}
            />
            <div
              className={`w-5 h-0.5 bg-current transition-all ${menuOpen ? "-rotate-45 -translate-y-1.5" : ""}`}
            />
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div
          className="fixed top-14 left-4 right-4 z-50 md:hidden rounded-2xl overflow-hidden"
          style={{
            background: "rgba(12,20,30,0.97)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.12)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          }}
        >
          <div className="px-4 py-3 grid grid-cols-2 gap-1">
            {NAV_LINKS.map((link) => (
              <button
                type="button"
                key={link.id}
                onClick={() => scrollTo(link.id)}
                data-ocid={`nav.mobile.${link.id}.link`}
                className="text-left px-4 py-3 rounded-xl transition-all"
                style={{
                  color:
                    activeId === link.id
                      ? "oklch(0.85 0.18 148)"
                      : "rgba(255,255,255,0.7)",
                  background:
                    activeId === link.id
                      ? "rgba(80,200,100,0.12)"
                      : "transparent",
                }}
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

// ── Hero with cursor spotlight ───────────────────────────────
const LEAVES = [0, 1, 2, 3, 4, 5, 6, 7];

function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!sectionRef.current || !spotRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    spotRef.current.style.left = `${x}px`;
    spotRef.current.style.top = `${y}px`;
    spotRef.current.style.opacity = "1";
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (spotRef.current) spotRef.current.style.opacity = "0";
  }, []);

  return (
    <section
      ref={sectionRef}
      id="home"
      data-ocid="hero.section"
      className="relative min-h-screen flex items-center justify-center overflow-hidden cursor-crosshair"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('/assets/generated/hero-city.dim_1400x700.jpg')",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(10,25,60,0.88) 0%, rgba(5,40,20,0.80) 50%, rgba(10,25,60,0.88) 100%)",
        }}
      />

      {/* Cursor spotlight */}
      <div
        ref={spotRef}
        className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full"
        style={{
          opacity: 0,
          transition: "opacity 0.3s ease",
          background:
            "radial-gradient(circle, oklch(0.60 0.22 148 / 0.18) 0%, transparent 70%)",
          zIndex: 2,
        }}
      />

      <div className="hero-blob hero-blob-1" />
      <div className="hero-blob hero-blob-2" />
      <div className="hero-blob hero-blob-3" />

      {LEAVES.map((i) => (
        <div
          key={i}
          className="hero-leaf"
          style={
            {
              left: `${10 + i * 12}%`,
              bottom: `${15 + (i % 3) * 20}%`,
              "--duration": `${4 + i * 0.7}s`,
              "--delay": `${i * 0.4}s`,
              width: `${12 + i * 3}px`,
              height: `${12 + i * 3}px`,
            } as React.CSSProperties
          }
        />
      ))}

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8 hero-title"
          style={{
            background: "rgba(80,200,100,0.12)",
            border: "1px solid rgba(100,220,130,0.4)",
            color: "oklch(0.80 0.22 148)",
            backdropFilter: "blur(8px)",
          }}
        >
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block" />
          Smart City Initiative 2026
        </div>

        <h1
          className="hero-title font-display font-black tracking-tight leading-none mb-6"
          style={{
            color: "#fff",
            textShadow: "0 4px 40px oklch(0.52 0.18 148 / 0.6)",
            fontSize: "clamp(4rem, 14vw, 9rem)",
          }}
        >
          ECO <span className="shimmer-text">SPHERE</span>
        </h1>

        <p
          className="hero-tagline font-light tracking-widest uppercase mb-12"
          style={{
            color: "oklch(0.85 0.1 148)",
            fontSize: "clamp(1rem, 2.5vw, 1.5rem)",
          }}
        >
          Building a Better World Since 2026
        </p>

        <div className="hero-cta flex flex-col sm:flex-row gap-4 justify-center">
          <button
            type="button"
            className="px-10 py-4 rounded-full text-lg font-semibold text-white transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.52 0.18 148), oklch(0.45 0.20 165))",
              boxShadow: "0 8px 32px oklch(0.52 0.18 148 / 0.5)",
            }}
            onClick={() =>
              document
                .getElementById("about")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            data-ocid="hero.primary_button"
          >
            Explore the City →
          </button>
          <button
            type="button"
            className="px-10 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.25)",
              color: "white",
              backdropFilter: "blur(8px)",
            }}
            onClick={() =>
              document
                .getElementById("map")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            data-ocid="hero.secondary_button"
          >
            🗺️ View City Map
          </button>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60">
        <span className="text-white text-xs tracking-widest uppercase">
          Scroll
        </span>
        <div className="w-0.5 h-8 bg-white/40 relative overflow-hidden">
          <div className="w-full h-1/2 bg-white/80 absolute top-0 animate-bounce" />
        </div>
      </div>
    </section>
  );
}

// ── Logo Cloud ──────────────────────────────────────────────
const LOGO_ITEMS = [
  { id: "solar", icon: "☀️", label: "Solar Tech" },
  { id: "wind", icon: "💨", label: "Wind Power" },
  { id: "water", icon: "💧", label: "Clean Water" },
  { id: "bio", icon: "🌿", label: "BioDesign" },
  { id: "carbon", icon: "🌍", label: "Zero Carbon" },
  { id: "smart", icon: "🏙️", label: "Smart Grid" },
];

function LogoCloud() {
  return (
    <section
      className="py-10 px-4 relative overflow-hidden"
      style={{
        background: "oklch(0.09 0.04 200)",
        borderTop: "1px solid rgba(255,255,255,0.04)",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      <div className="max-w-5xl mx-auto text-center">
        <p
          className="text-xs font-semibold uppercase tracking-widest mb-6"
          style={{ color: "oklch(0.50 0.05 200)" }}
        >
          Powered by world-class sustainability technology
        </p>
        <div className="flex flex-wrap justify-center items-center gap-4">
          {LOGO_ITEMS.map((item) => (
            <div
              key={item.id}
              className="logo-cloud-item flex items-center gap-2 px-5 py-2.5 rounded-full cursor-default select-none"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <span className="text-xl">{item.icon}</span>
              <span
                className="text-sm font-semibold"
                style={{ color: "oklch(0.62 0.06 200)" }}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── About ───────────────────────────────────────────────────
const FEATURES = [
  {
    id: "solar",
    icon: "☀️",
    title: "Renewable Energy",
    desc: "100% of Eco Sphere\u2019s power comes from solar panels, wind turbines, and hydro systems \u2014 zero fossil fuels, zero compromise.",
  },
  {
    id: "green",
    icon: "🌿",
    title: "Green Living",
    desc: "Every building breathes. Vertical gardens, living roofs, and nature-integrated architecture make sustainability a lifestyle.",
  },
  {
    id: "community",
    icon: "🤝",
    title: "Community Wellbeing",
    desc: "Shared spaces, community gardens, cultural hubs, and free public transport unite 2,000+ residents in a thriving ecosystem.",
  },
];

function TiltCard({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const { ref, handleMove, handleLeave } = useTilt();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
      }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
    </div>
  );
}

function AboutSection() {
  const ref = useRevealOnScroll(0.15);

  return (
    <section
      id="about"
      data-ocid="about.section"
      className="py-24 px-4 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.97 0.01 148) 0%, oklch(0.93 0.03 148) 100%)",
      }}
    >
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-30 blur-3xl pointer-events-none"
        style={{ background: "oklch(0.75 0.18 148)" }}
      />
      <div
        className="absolute bottom-0 left-0 w-72 h-72 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: "oklch(0.65 0.20 165)" }}
      />

      <div className="max-w-7xl mx-auto relative" ref={ref}>
        <div className="text-center mb-16 reveal">
          <span
            className="text-sm font-semibold uppercase tracking-widest"
            style={{ color: "oklch(0.52 0.18 148)" }}
          >
            Our Vision
          </span>
          <h2
            className="font-display font-bold mt-3 mb-5"
            style={{
              color: "oklch(0.12 0.04 200)",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
            }}
          >
            What is Eco Sphere?
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ color: "oklch(0.40 0.05 200)" }}
          >
            Eco Sphere is a pioneering sustainable smart city designed from the
            ground up for harmony between humanity and nature. Every system
            \u2014 energy, housing, mobility, and culture \u2014 is engineered
            for a zero-carbon future.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {FEATURES.map((f, i) => (
            <TiltCard
              key={f.id}
              className="reveal glass-card rounded-3xl p-8 text-center"
              data-ocid={`about.item.${i + 1}` as string}
            >
              <div
                className="text-5xl mb-5 mx-auto w-20 h-20 rounded-2xl flex items-center justify-center"
                style={{ background: "oklch(0.52 0.18 148 / 0.12)" }}
              >
                {f.icon}
              </div>
              <h3
                className="font-display font-bold text-xl mb-3"
                style={{ color: "oklch(0.15 0.04 200)" }}
              >
                {f.title}
              </h3>
              <p
                className="leading-relaxed"
                style={{ color: "oklch(0.45 0.05 200)" }}
              >
                {f.desc}
              </p>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Apartments ──────────────────────────────────────────────
const APARTMENTS = [
  {
    id: "solar-residences",
    title: "Solar Residences",
    emoji: "🏙️",
    desc: "Award-winning apartment towers with integrated solar facades, rainwater harvesting, and biophilic interior design.",
  },
  {
    id: "green-towers",
    title: "Green Towers",
    emoji: "🌆",
    desc: "Vertical forests rising 40 storeys high, each level wrapped in 3,000 plants that purify the air naturally.",
  },
  {
    id: "ecovilla",
    title: "EcoVilla District",
    emoji: "🏡",
    desc: "Low-rise villa clusters nestled within community gardens \u2014 the perfect blend of private comfort and shared green space.",
  },
];

function ApartmentsSection() {
  const ref = useRevealOnScroll(0.1);
  const [selectedApt, setSelectedApt] = useState<
    (typeof APARTMENT_DETAILS)[0] | null
  >(null);

  return (
    <>
      <section
        id="apartments"
        data-ocid="apartments.section"
        className="py-24 px-4 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.10 0.04 200) 0%, oklch(0.13 0.06 180) 50%, oklch(0.10 0.04 200) 100%)",
        }}
      >
        <div
          className="absolute top-20 right-10 w-80 h-80 rounded-full opacity-15 blur-3xl pointer-events-none"
          style={{ background: "oklch(0.52 0.18 148)" }}
        />
        <div
          className="absolute bottom-10 left-10 w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: "oklch(0.45 0.18 220)" }}
        />

        <div className="max-w-7xl mx-auto relative" ref={ref}>
          <div className="text-center mb-16 reveal">
            <span
              className="text-sm font-semibold uppercase tracking-widest"
              style={{ color: "oklch(0.65 0.22 148)" }}
            >
              Where You Live
            </span>
            <h2
              className="font-display font-bold mt-3 mb-5 text-white"
              style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
            >
              Sustainable Apartments
            </h2>
            <p
              className="text-lg max-w-2xl mx-auto"
              style={{ color: "oklch(0.70 0.05 200)" }}
            >
              Every home in Eco Sphere is a statement in sustainable living
              \u2014 beautiful, efficient, and deeply connected to the natural
              world.
            </p>
          </div>

          <div className="reveal rounded-3xl overflow-hidden mb-12 shadow-2xl">
            <img
              src="/assets/generated/eco-apartments.dim_800x600.jpg"
              alt="Eco-friendly apartments"
              className="w-full h-64 sm:h-80 object-cover"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {APARTMENTS.map((apt, i) => (
              <TiltCard
                key={apt.id}
                className="reveal glass-card-dark rounded-3xl overflow-hidden"
                data-ocid={`apartments.item.${i + 1}` as string}
              >
                <div
                  className="h-40 flex items-center justify-center text-6xl"
                  style={{ background: "rgba(40,120,60,0.15)" }}
                >
                  {apt.emoji}
                </div>
                <div className="p-6">
                  <h3 className="font-display font-bold text-lg mb-2 text-white">
                    {apt.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed mb-4"
                    style={{ color: "oklch(0.65 0.05 200)" }}
                  >
                    {apt.desc}
                  </p>
                  <button
                    type="button"
                    className="text-sm font-semibold px-5 py-2 rounded-full transition-all hover:scale-105"
                    style={{
                      background: "oklch(0.52 0.18 148 / 0.15)",
                      color: "oklch(0.75 0.18 148)",
                      border: "1px solid oklch(0.52 0.18 148 / 0.4)",
                    }}
                    onClick={() =>
                      setSelectedApt(
                        APARTMENT_DETAILS.find((d) => d.id === apt.id) ?? null,
                      )
                    }
                    data-ocid={`apartments.secondary_button.${i + 1}`}
                  >
                    Learn More →
                  </button>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>
      <ApartmentModal apt={selectedApt} onClose={() => setSelectedApt(null)} />
    </>
  );
}

// ── Energy ──────────────────────────────────────────────────
function useCounterAnimation(target: number, suffix: string, inView: boolean) {
  const [display, setDisplay] = useState(`0${suffix}`);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const step = 16;
    const increment = target / (duration / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setDisplay(`${target.toLocaleString()}${suffix}`);
        clearInterval(timer);
      } else {
        setDisplay(`${Math.floor(start).toLocaleString()}${suffix}`);
      }
    }, step);
    return () => clearInterval(timer);
  }, [inView, target, suffix]);
  return display;
}

const ENERGY_STATS = [
  { id: "solar", icon: "☀️", label: "Solar Farms" },
  { id: "wind", icon: "💨", label: "Wind Turbines" },
  { id: "clean", icon: "⚡", label: "Clean Energy" },
];

function EnergySection() {
  const ref = useRevealOnScroll(0.2);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setInView(true);
        }
      },
      { threshold: 0.3 },
    );
    const el = ref.current;
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
  const c1 = useCounterAnimation(2, "", inView);
  const c2 = useCounterAnimation(40, "", inView);
  const statValues = [c1, c2, inView ? "100%" : "0%"];

  return (
    <section
      id="energy"
      data-ocid="energy.section"
      className="py-24 px-4 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.97 0.01 148) 0%, oklch(0.93 0.04 140) 100%)",
      }}
    >
      <div
        className="absolute top-10 left-10 w-72 h-72 rounded-full opacity-25 blur-3xl pointer-events-none"
        style={{ background: "oklch(0.75 0.22 88)" }}
      />
      <div className="max-w-7xl mx-auto relative" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="reveal">
              <span
                className="text-sm font-semibold uppercase tracking-widest"
                style={{ color: "oklch(0.52 0.18 148)" }}
              >
                Clean Power
              </span>
              <h2
                className="font-display font-bold mt-3 mb-6"
                style={{
                  color: "oklch(0.12 0.04 200)",
                  fontSize: "clamp(2rem, 5vw, 3.5rem)",
                }}
              >
                Renewable Energy
              </h2>
              <p
                className="text-lg leading-relaxed mb-8"
                style={{ color: "oklch(0.40 0.05 200)" }}
              >
                Eco Sphere runs entirely on clean energy. Our massive solar
                arrays capture the sun\u2019s power while 40 wind turbines
                harness coastal breezes. Together they power every home,
                vehicle, and business \u2014 with surplus stored for a rainy
                day.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4 reveal">
              {ENERGY_STATS.map((stat, i) => (
                <TiltCard
                  key={stat.id}
                  className="glass-card rounded-2xl p-5 text-center"
                  data-ocid={`energy.item.${i + 1}` as string}
                >
                  <div className="text-2xl mb-1">{stat.icon}</div>
                  <div
                    className="font-display font-black text-2xl"
                    style={{ color: "oklch(0.52 0.18 148)" }}
                  >
                    {statValues[i]}
                  </div>
                  <div
                    className="text-xs font-medium mt-1"
                    style={{ color: "oklch(0.45 0.05 200)" }}
                  >
                    {stat.label}
                  </div>
                </TiltCard>
              ))}
            </div>
          </div>
          <div className="reveal rounded-3xl overflow-hidden shadow-2xl">
            <img
              src="/assets/generated/solar-energy.dim_800x600.jpg"
              alt="Solar energy farm"
              className="w-full h-full object-cover"
              style={{ minHeight: "360px" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Parks ───────────────────────────────────────────────────
const PARK_BADGES = [
  { id: "parks", text: "🌳 1 Urban Park" },
  { id: "bio", text: "🦋 Biodiversity Zones" },
  { id: "gardens", text: "🌱 Community Gardens" },
];

function ParksSection() {
  const ref = useRevealOnScroll(0.1);
  return (
    <section
      id="parks"
      data-ocid="parks.section"
      className="py-24 px-4 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.18 0.08 148) 0%, oklch(0.14 0.06 180) 100%)",
      }}
    >
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: "oklch(0.60 0.22 148)" }}
      />
      <div
        className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-15 blur-2xl pointer-events-none"
        style={{ background: "oklch(0.45 0.20 165)" }}
      />
      <div className="max-w-7xl mx-auto relative" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="reveal rounded-3xl overflow-hidden shadow-2xl order-last lg:order-first">
            <img
              src="/assets/generated/green-park.dim_800x600.jpg"
              alt="Green park"
              className="w-full object-cover"
              style={{ minHeight: "360px" }}
            />
          </div>
          <div>
            <div className="reveal">
              <span
                className="text-sm font-semibold uppercase tracking-widest"
                style={{ color: "oklch(0.75 0.22 148)" }}
              >
                Nature First
              </span>
              <h2
                className="font-display font-bold mt-3 mb-6 text-white"
                style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
              >
                Green Parks &amp; Community
              </h2>
              <p
                className="text-lg leading-relaxed mb-8"
                style={{ color: "oklch(0.80 0.08 165)" }}
              >
                Nature is not an afterthought in Eco Sphere \u2014 it\u2019s the
                foundation. One urban park weaves through the city like a living
                network, connecting residents to biodiversity zones, community
                gardens, and tranquil wetlands.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 reveal">
              {PARK_BADGES.map((badge, i) => (
                <span
                  key={badge.id}
                  className="px-5 py-2.5 rounded-full text-sm font-semibold"
                  data-ocid={`parks.item.${i + 1}`}
                  style={{
                    background: "rgba(80,200,100,0.12)",
                    border: "1px solid rgba(100,220,120,0.35)",
                    color: "oklch(0.85 0.18 148)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  {badge.text}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Video ───────────────────────────────────────────────────
function VideoSection() {
  const ref = useRevealOnScroll(0.1);
  return (
    <section
      id="video"
      data-ocid="video.section"
      className="py-24 px-4"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.93 0.04 140) 0%, oklch(0.97 0.01 148) 100%)",
      }}
    >
      <div className="max-w-5xl mx-auto" ref={ref}>
        <div className="text-center mb-12 reveal">
          <span
            className="text-sm font-semibold uppercase tracking-widest"
            style={{ color: "oklch(0.52 0.18 148)" }}
          >
            Our Story
          </span>
          <h2
            className="font-display font-bold mt-3 mb-5"
            style={{
              color: "oklch(0.12 0.04 200)",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
            }}
          >
            Eco Sphere in Action
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ color: "oklch(0.40 0.05 200)" }}
          >
            Watch how Eco Sphere brings together sustainability, community, and
            innovation in one thriving smart city.
          </p>
        </div>
        <div
          className="reveal rounded-3xl overflow-hidden shadow-2xl glass-card"
          data-ocid="video.canvas_target"
        >
          <div
            style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}
          >
            <iframe
              src="https://drive.google.com/file/d/1BDAPb4WvaWgvwEmVdtrRtCboc07tGHJI/preview"
              title="Eco Sphere Video"
              allow="autoplay; fullscreen"
              allowFullScreen
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                border: "none",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Map ─────────────────────────────────────────────────────
// ── Hotspot data ─────────────────────────────────────────────
interface Hotspot {
  id: string;
  label: string;
  icon: string;
  left: string;
  top: string;
  color: string;
  description: string;
  details: string[];
}

const HOTSPOTS: Hotspot[] = [
  {
    id: "solar",
    label: "Solar Power Plant",
    icon: "☀️",
    left: "8%",
    top: "18%",
    color: "oklch(0.75 0.22 88)",
    description:
      "Eco Sphere's solar power plant spans 12 acres with 2 large photovoltaic farms generating clean electricity for every home and building in the city.",
    details: [
      "2 solar panel farms",
      "Powers 100% of the city",
      "Zero carbon emissions",
      "Smart grid integration",
    ],
  },
  {
    id: "park",
    label: "Urban Park",
    icon: "🌳",
    left: "8%",
    top: "52%",
    color: "oklch(0.60 0.20 148)",
    description:
      "A lush 35-acre urban park at the heart of Eco Sphere, featuring walking trails, community gardens, natural wetlands, and 400+ native plant species.",
    details: [
      "35 acres of green space",
      "400+ native species",
      "Community gardens",
      "Natural wetlands",
    ],
  },
  {
    id: "lake",
    label: "City Lake",
    icon: "💧",
    left: "10%",
    top: "70%",
    color: "oklch(0.62 0.18 220)",
    description:
      "A natural freshwater lake that acts as Eco Sphere's water reservoir. It supports biodiversity, provides recreational activities, and feeds the city's clean water system.",
    details: [
      "Freshwater reservoir",
      "Kayaking & recreation",
      "Biodiversity habitat",
      "Natural water filtration",
    ],
  },
  {
    id: "sports",
    label: "Sports Area",
    icon: "⚽",
    left: "38%",
    top: "74%",
    color: "oklch(0.65 0.20 50)",
    description:
      "A world-class eco-friendly sports complex with solar-lit courts, natural grass fields, and zero-waste facilities promoting active and healthy community living.",
    details: [
      "Solar-powered lighting",
      "Multi-sport courts",
      "Natural grass fields",
      "Zero-waste facilities",
    ],
  },
  {
    id: "clubhouse",
    label: "Clubhouse",
    icon: "🏛️",
    left: "25%",
    top: "52%",
    color: "oklch(0.70 0.18 300)",
    description:
      "The community hub of Eco Sphere — home to co-working spaces, event halls, a rooftop café, and collaborative workshops for residents to gather and innovate.",
    details: [
      "Co-working spaces",
      "Rooftop café",
      "Event & workshop halls",
      "Community programs",
    ],
  },
  {
    id: "hospital",
    label: "Hospital",
    icon: "🏥",
    left: "72%",
    top: "8%",
    color: "oklch(0.65 0.18 15)",
    description:
      "A state-of-the-art green hospital powered entirely by renewables, featuring energy-efficient wards, a healing garden, and advanced telemedicine facilities.",
    details: [
      "100% renewable powered",
      "Healing garden",
      "Telemedicine hub",
      "Net-zero design",
    ],
  },
  {
    id: "flats",
    label: "Building Flats",
    icon: "🏢",
    left: "60%",
    top: "40%",
    color: "oklch(0.52 0.18 148)",
    description:
      "Twelve eco-designed apartment blocks (numbered 1–12) housing Eco Sphere's 2,000+ residents in energy-efficient, solar-powered, green-roofed living spaces.",
    details: [
      "12 apartment blocks",
      "2,000+ residents",
      "Solar-powered homes",
      "Green rooftop gardens",
    ],
  },
  {
    id: "temples",
    label: "Religious Zone",
    icon: "🛕",
    left: "68%",
    top: "74%",
    color: "oklch(0.60 0.18 260)",
    description:
      "A peaceful multi-faith religious zone featuring a Hindu Temple, Church, Mosque, and Buddhist Temple — all designed with eco-friendly architecture and meditation gardens.",
    details: [
      "Hindu Temple",
      "Church",
      "Mosque",
      "Buddhist Temple",
      "Meditation gardens",
    ],
  },
];

function MapSection() {
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const activeInfo = HOTSPOTS.find((h) => h.id === activeHotspot);
  const ref = useRevealOnScroll(0.1);

  // Close modal on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveHotspot(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <section
      id="map"
      data-ocid="map.section"
      className="py-24 px-4 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.07 0.04 200) 0%, oklch(0.10 0.05 220) 100%)",
      }}
    >
      <div
        className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: "oklch(0.52 0.18 148)" }}
      />
      <div className="max-w-6xl mx-auto relative" ref={ref}>
        <div className="text-center mb-16 reveal">
          <span
            className="text-sm font-semibold uppercase tracking-widest"
            style={{ color: "oklch(0.65 0.22 148)" }}
          >
            Interactive Tour
          </span>
          <h2
            className="font-display font-bold mt-3 mb-5 text-white"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
          >
            Explore Our City Map
          </h2>
          <p
            className="text-lg max-w-xl mx-auto"
            style={{ color: "oklch(0.65 0.05 200)" }}
          >
            Click any glowing hotspot to discover what makes each zone special.
          </p>
        </div>

        {/* Map container */}
        <div
          className="reveal relative mx-auto rounded-3xl overflow-hidden"
          style={{
            maxWidth: "870px",
            boxShadow: "0 0 80px oklch(0.52 0.18 148 / 0.3)",
          }}
        >
          {/* Map image */}
          <img
            src="/assets/uploads/Screenshot-2026-03-11-192321-1.png"
            alt="Eco Sphere City Map"
            className="w-full block"
            style={{ display: "block" }}
          />

          {/* Hotspot overlays */}
          {HOTSPOTS.map((spot) => (
            <button
              key={spot.id}
              type="button"
              data-ocid={`map.${spot.id}.map_marker`}
              onClick={() =>
                setActiveHotspot(activeHotspot === spot.id ? null : spot.id)
              }
              className="absolute flex flex-col items-center gap-1 group"
              style={{
                left: spot.left,
                top: spot.top,
                transform: "translate(-50%, -50%)",
                zIndex: 10,
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
              title={spot.label}
            >
              {/* Pulsing dot */}
              <span className="relative flex items-center justify-center">
                <span
                  className="absolute rounded-full animate-ping"
                  style={{
                    width: "28px",
                    height: "28px",
                    background: `${spot.color}`,
                    opacity: 0.45,
                  }}
                />
                <span
                  className="relative rounded-full flex items-center justify-center text-sm font-bold transition-transform group-hover:scale-125"
                  style={{
                    width: "22px",
                    height: "22px",
                    background: spot.color,
                    boxShadow: `0 0 14px ${spot.color}`,
                  }}
                >
                  <span style={{ fontSize: "11px" }}>{spot.icon}</span>
                </span>
              </span>
              {/* Label */}
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  background: "rgba(0,0,0,0.75)",
                  color: spot.color,
                  backdropFilter: "blur(6px)",
                  border: `1px solid ${spot.color}60`,
                  fontSize: "9px",
                }}
              >
                {spot.label}
              </span>
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="reveal mt-8 flex flex-wrap justify-center gap-3">
          {HOTSPOTS.map((spot) => (
            <button
              key={spot.id}
              type="button"
              onClick={() =>
                setActiveHotspot(activeHotspot === spot.id ? null : spot.id)
              }
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all hover:scale-105"
              style={{
                background:
                  activeHotspot === spot.id
                    ? `${spot.color}30`
                    : "rgba(255,255,255,0.05)",
                border: `1px solid ${activeHotspot === spot.id ? spot.color : "rgba(255,255,255,0.12)"}`,
                color:
                  activeHotspot === spot.id
                    ? spot.color
                    : "oklch(0.70 0.05 200)",
              }}
              data-ocid={`map.${spot.id}.toggle`}
            >
              <span>{spot.icon}</span>
              {spot.label}
            </button>
          ))}
        </div>
      </div>

      {/* Modal */}
      {activeInfo && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{
            background: "rgba(0,0,0,0.70)",
            backdropFilter: "blur(8px)",
          }}
          onClick={() => setActiveHotspot(null)}
          onKeyDown={(e) => e.key === "Escape" && setActiveHotspot(null)}
          data-ocid="map.modal"
        >
          <div
            className="relative rounded-3xl overflow-hidden max-w-lg w-full"
            style={{
              background: "oklch(0.10 0.04 220)",
              border: `2px solid ${activeInfo.color}`,
              boxShadow: `0 0 60px ${activeInfo.color}40`,
              maxHeight: "90vh",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            data-ocid="map.dialog"
          >
            {/* Header stripe */}
            <div
              className="h-2 w-full"
              style={{ background: activeInfo.color }}
            />
            <div className="p-8">
              {/* Close button */}
              <button
                type="button"
                className="absolute top-5 right-5 w-9 h-9 rounded-full flex items-center justify-center text-lg font-bold transition-all hover:scale-110"
                style={{
                  background: `${activeInfo.color}20`,
                  color: activeInfo.color,
                }}
                onClick={() => setActiveHotspot(null)}
                data-ocid="map.close_button"
              >
                ×
              </button>

              <div className="flex items-center gap-4 mb-5">
                <span
                  className="text-4xl w-16 h-16 flex items-center justify-center rounded-2xl"
                  style={{
                    background: `${activeInfo.color}20`,
                    border: `1px solid ${activeInfo.color}40`,
                  }}
                >
                  {activeInfo.icon}
                </span>
                <div>
                  <h3
                    className="font-display font-bold text-2xl"
                    style={{ color: activeInfo.color }}
                  >
                    {activeInfo.label}
                  </h3>
                  <p
                    className="text-xs uppercase tracking-widest mt-1"
                    style={{ color: "oklch(0.55 0.05 200)" }}
                  >
                    Eco Sphere Zone
                  </p>
                </div>
              </div>

              <p
                className="text-sm leading-relaxed mb-6"
                style={{ color: "oklch(0.75 0.05 200)" }}
              >
                {activeInfo.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {activeInfo.details.map((d) => (
                  <span
                    key={d}
                    className="text-xs px-3 py-1.5 rounded-full font-medium"
                    style={{
                      background: `${activeInfo.color}15`,
                      color: activeInfo.color,
                      border: `1px solid ${activeInfo.color}40`,
                    }}
                  >
                    ✓ {d}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

// ── FAQ accordion ────────────────────────────────────────────
function FAQSection() {
  const [openId, setOpenId] = useState<string | null>(null);
  const ref = useRevealOnScroll(0.1);

  return (
    <section
      id="faq"
      data-ocid="faq.section"
      className="py-24 px-4 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.97 0.01 148) 0%, oklch(0.93 0.03 148) 100%)",
      }}
    >
      <div
        className="absolute top-0 left-1/4 w-80 h-80 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: "oklch(0.65 0.20 165)" }}
      />

      <div className="max-w-3xl mx-auto relative" ref={ref}>
        <div className="text-center mb-14 reveal">
          <span
            className="text-sm font-semibold uppercase tracking-widest"
            style={{ color: "oklch(0.52 0.18 148)" }}
          >
            Got Questions?
          </span>
          <h2
            className="font-display font-bold mt-3 mb-4"
            style={{
              color: "oklch(0.12 0.04 200)",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
            }}
          >
            Frequently Asked
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="reveal glass-card rounded-2xl overflow-hidden"
                data-ocid={`faq.item.${i + 1}`}
              >
                <button
                  type="button"
                  className="w-full flex items-center justify-between px-6 py-5 text-left group"
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  data-ocid={`faq.toggle.${i + 1}`}
                >
                  <span
                    className="font-semibold text-base pr-4"
                    style={{ color: "oklch(0.15 0.04 200)" }}
                  >
                    {faq.q}
                  </span>
                  <span
                    className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-300"
                    style={{
                      background: isOpen
                        ? "oklch(0.52 0.18 148)"
                        : "oklch(0.52 0.18 148 / 0.12)",
                      color: isOpen ? "white" : "oklch(0.52 0.18 148)",
                      transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                    }}
                  >
                    +
                  </span>
                </button>
                <div
                  className="overflow-hidden transition-all duration-400"
                  style={{
                    maxHeight: isOpen ? "300px" : "0",
                    opacity: isOpen ? 1 : 0,
                  }}
                >
                  <p
                    className="px-6 pb-5 text-base leading-relaxed"
                    style={{ color: "oklch(0.42 0.05 200)" }}
                  >
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── Creators Section ─────────────────────────────────────────
const CREATORS = [
  { name: "Abhijay Jalagari" },
  { name: "Ansh Charabharthy" },
  { name: "Aarna Agarwal" },
  { name: "Aadhya Maulin Bhaght" },
  { name: "Jian Joshi" },
];

function CreatorsSection() {
  return (
    <section
      id="creators"
      className="py-20 px-4"
      style={{ background: "oklch(0.08 0.025 200)" }}
    >
      <div className="max-w-4xl mx-auto text-center">
        <p
          className="text-sm font-semibold uppercase tracking-widest mb-3"
          style={{ color: "oklch(0.65 0.18 148)" }}
        >
          Made by Students
        </p>
        <h2
          className="text-4xl md:text-5xl font-display font-bold mb-4"
          style={{ color: "oklch(0.92 0.05 200)" }}
        >
          Meet the Creators
        </h2>
        <p
          className="text-lg mb-12 max-w-xl mx-auto"
          style={{ color: "oklch(0.6 0.06 200)" }}
        >
          This website was built by a group of passionate students as part of a
          school sustainability project.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {CREATORS.map((creator) => (
            <div
              key={creator.name}
              className="rounded-2xl p-6 flex items-center gap-4"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(10px)",
              }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0"
                style={{
                  background: "oklch(0.65 0.18 148)",
                  color: "oklch(0.08 0.03 200)",
                }}
              >
                {creator.name.charAt(0)}
              </div>
              <span
                className="text-lg font-semibold"
                style={{ color: "oklch(0.88 0.05 200)" }}
              >
                {creator.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Footer ──────────────────────────────────────────────────
function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer
      className="py-12 px-4 text-center"
      style={{
        background: "oklch(0.06 0.03 200)",
        borderTop: "1px solid oklch(0.18 0.04 200)",
      }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center gap-3 mb-4">
          <img
            src="/assets/generated/eco-sphere-logo-transparent.dim_200x200.png"
            alt="Eco Sphere"
            className="h-10 w-10 object-contain"
          />
          <span
            className="font-display font-bold text-xl"
            style={{ color: "oklch(0.65 0.18 148)" }}
          >
            Eco Sphere
          </span>
        </div>
        <p className="text-sm mb-2" style={{ color: "oklch(0.55 0.05 200)" }}>
          Building a Better World Since 2026
        </p>
        <p className="text-sm mb-6" style={{ color: "oklch(0.45 0.05 200)" }}>
          © {year} Eco Sphere. Building a Better World.
        </p>
        <p
          className="text-xs mt-3 italic"
          style={{ color: "oklch(0.45 0.05 200)" }}
        >
          This is not a real city. This website was made as a school project.
        </p>
        <p className="text-xs" style={{ color: "oklch(0.38 0.04 200)" }}>
          Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
            style={{ color: "oklch(0.52 0.18 148)" }}
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </footer>
  );
}

// ── App ─────────────────────────────────────────────────────
export default function App() {
  return (
    <div className="min-h-screen">
      <ScrollProgress />
      <Navbar />
      <main>
        <HeroSection />
        <LogoCloud />
        <AboutSection />
        <ApartmentsSection />
        <EnergySection />
        <ParksSection />
        <VideoSection />
        <MapSection />
        <FAQSection />
        <CreatorsSection />
      </main>
      <Footer />
    </div>
  );
}
