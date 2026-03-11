import { useEffect, useRef, useState } from "react";

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
const ZONES: ZoneInfo[] = [
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

// ── Shared scroll-reveal hook ───────────────────────────────────
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

// ── Navbar ──────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const links = [
    { label: "Home", id: "home" },
    { label: "About", id: "about" },
    { label: "Apartments", id: "apartments" },
    { label: "Energy", id: "energy" },
    { label: "Parks", id: "parks" },
    { label: "Video", id: "video" },
    { label: "Map", id: "map" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "navbar-solid" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            type="button"
            className="flex items-center gap-3 group"
            onClick={() => scrollTo("home")}
            data-ocid="nav.link"
          >
            <img
              src="/assets/generated/eco-sphere-logo-transparent.dim_200x200.png"
              alt="Eco Sphere Logo"
              className="h-10 w-10 object-contain"
            />
            <span
              className="font-display font-bold text-xl"
              style={{ color: "oklch(0.75 0.22 148)" }}
            >
              Eco Sphere
            </span>
          </button>

          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <button
                type="button"
                key={link.id}
                onClick={() => scrollTo(link.id)}
                data-ocid={`nav.${link.id}.link`}
                className="px-4 py-2 rounded-full text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                {link.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="md:hidden text-white/80 hover:text-white p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-6 h-0.5 bg-current mb-1.5 transition-all" />
            <div className="w-6 h-0.5 bg-current mb-1.5 transition-all" />
            <div className="w-6 h-0.5 bg-current transition-all" />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          className="md:hidden"
          style={{ background: "oklch(0.12 0.04 200 / 0.97)" }}
        >
          <div className="px-4 py-3 flex flex-col gap-1">
            {links.map((link) => (
              <button
                type="button"
                key={link.id}
                onClick={() => scrollTo(link.id)}
                data-ocid={`nav.mobile.${link.id}.link`}
                className="text-left px-4 py-3 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

// ── Hero ────────────────────────────────────────────────────
const LEAVES = [0, 1, 2, 3, 4, 5, 6, 7];

function HeroSection() {
  return (
    <section
      id="home"
      data-ocid="hero.section"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
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
            "linear-gradient(180deg, oklch(0.08 0.05 200 / 0.75) 0%, oklch(0.06 0.05 200 / 0.85) 100%)",
        }}
      />

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
            background: "oklch(0.52 0.18 148 / 0.2)",
            border: "1px solid oklch(0.65 0.22 148 / 0.5)",
            color: "oklch(0.80 0.22 148)",
          }}
        >
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block" />
          Smart City Initiative 2026
        </div>

        <h1
          className="hero-title font-display font-black text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight leading-none mb-6"
          style={{
            color: "#fff",
            textShadow: "0 4px 40px oklch(0.52 0.18 148 / 0.6)",
          }}
        >
          ECO <span className="shimmer-text">SPHERE</span>
        </h1>

        <p
          className="hero-tagline text-xl sm:text-2xl font-light tracking-widest uppercase mb-12"
          style={{ color: "oklch(0.85 0.1 148)" }}
        >
          Building a Better World Since 2026
        </p>

        <button
          type="button"
          className="hero-cta px-10 py-4 rounded-full text-lg font-semibold text-white transition-all duration-300 hover:scale-105 active:scale-95"
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

function AboutSection() {
  const ref = useRevealOnScroll(0.15);

  return (
    <section
      id="about"
      data-ocid="about.section"
      className="py-24 px-4"
      style={{ background: "oklch(0.97 0.01 148)" }}
    >
      <div className="max-w-7xl mx-auto" ref={ref}>
        <div className="text-center mb-16 reveal">
          <span
            className="text-sm font-semibold uppercase tracking-widest"
            style={{ color: "oklch(0.52 0.18 148)" }}
          >
            Our Vision
          </span>
          <h2
            className="font-display font-bold text-4xl sm:text-5xl mt-3 mb-5"
            style={{ color: "oklch(0.12 0.04 200)" }}
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
            <div
              key={f.id}
              className="reveal eco-card rounded-3xl p-8 text-center"
              style={{
                background: "white",
                border: "1px solid oklch(0.88 0.03 148)",
                boxShadow: "0 4px 24px oklch(0.52 0.18 148 / 0.08)",
              }}
              data-ocid={`about.item.${i + 1}`}
            >
              <div
                className="text-5xl mb-5 mx-auto w-20 h-20 rounded-2xl flex items-center justify-center"
                style={{ background: "oklch(0.92 0.06 148)" }}
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
            </div>
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

  return (
    <section
      id="apartments"
      data-ocid="apartments.section"
      className="py-24 px-4"
      style={{ background: "oklch(0.11 0.04 200)" }}
    >
      <div className="max-w-7xl mx-auto" ref={ref}>
        <div className="text-center mb-16 reveal">
          <span
            className="text-sm font-semibold uppercase tracking-widest"
            style={{ color: "oklch(0.65 0.22 148)" }}
          >
            Where You Live
          </span>
          <h2 className="font-display font-bold text-4xl sm:text-5xl mt-3 mb-5 text-white">
            Sustainable Apartments
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ color: "oklch(0.70 0.05 200)" }}
          >
            Every home in Eco Sphere is a statement in sustainable living \u2014
            beautiful, efficient, and deeply connected to the natural world.
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
            <div
              key={apt.id}
              className="reveal eco-card rounded-3xl overflow-hidden"
              style={{
                background: "oklch(0.16 0.05 200)",
                border: "1px solid oklch(0.25 0.06 200)",
              }}
              data-ocid={`apartments.item.${i + 1}`}
            >
              <div
                className="h-40 flex items-center justify-center text-6xl"
                style={{ background: "oklch(0.20 0.06 148 / 0.4)" }}
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
                  data-ocid={`apartments.secondary_button.${i + 1}`}
                >
                  Learn More →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
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
      className="py-24 px-4"
      style={{ background: "oklch(0.97 0.01 148)" }}
    >
      <div className="max-w-7xl mx-auto" ref={ref}>
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
                className="font-display font-bold text-4xl sm:text-5xl mt-3 mb-6"
                style={{ color: "oklch(0.12 0.04 200)" }}
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
                <div
                  key={stat.id}
                  className="rounded-2xl p-5 text-center"
                  style={{
                    background: "white",
                    border: "1px solid oklch(0.88 0.03 148)",
                    boxShadow: "0 4px 16px oklch(0.52 0.18 148 / 0.1)",
                  }}
                  data-ocid={`energy.item.${i + 1}`}
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
                </div>
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
        className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-20 blur-3xl"
        style={{ background: "oklch(0.60 0.22 148)" }}
      />
      <div
        className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-15 blur-2xl"
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
              <h2 className="font-display font-bold text-4xl sm:text-5xl mt-3 mb-6 text-white">
                Green Parks &amp; Community
              </h2>
              <p
                className="text-lg leading-relaxed mb-8"
                style={{ color: "oklch(0.80 0.08 165)" }}
              >
                Nature is not an afterthought in Eco Sphere \u2014 it\u2019s the
                foundation. One urban park weaves through the city like a living
                network, connecting residents to biodiversity zones, community
                gardens, and tranquil wetlands. Here, every child grows up with
                a tree to climb and a garden to tend.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 reveal">
              {PARK_BADGES.map((badge, i) => (
                <span
                  key={badge.id}
                  className="px-5 py-2.5 rounded-full text-sm font-semibold"
                  style={{
                    background: "oklch(0.52 0.18 148 / 0.2)",
                    border: "1px solid oklch(0.65 0.22 148 / 0.5)",
                    color: "oklch(0.85 0.18 148)",
                  }}
                  data-ocid={`parks.item.${i + 1}`}
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
      style={{ background: "oklch(0.97 0.01 148)" }}
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
            className="font-display font-bold text-4xl sm:text-5xl mt-3 mb-5"
            style={{ color: "oklch(0.12 0.04 200)" }}
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
          className="reveal rounded-3xl overflow-hidden shadow-2xl"
          style={{
            border: "1px solid oklch(0.88 0.03 148)",
            background: "oklch(0.10 0.04 200)",
          }}
          data-ocid="video.canvas_target"
        >
          <div
            style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}
          >
            <iframe
              src="https://www.canva.com/design/DAHDJ-sEPC8/view?embed"
              title="Eco Sphere Video"
              allow="fullscreen"
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
function MapSection() {
  const [activeZone, setActiveZone] = useState<MapZone>(null);
  const activeInfo = ZONES.find((z) => z.id === activeZone);
  const ref = useRevealOnScroll(0.1);

  return (
    <section
      id="map"
      data-ocid="map.section"
      className="py-24 px-4"
      style={{ background: "oklch(0.08 0.04 200)" }}
    >
      <div className="max-w-7xl mx-auto" ref={ref}>
        <div className="text-center mb-16 reveal">
          <span
            className="text-sm font-semibold uppercase tracking-widest"
            style={{ color: "oklch(0.65 0.22 148)" }}
          >
            Interactive Tour
          </span>
          <h2 className="font-display font-bold text-4xl sm:text-5xl mt-3 mb-5 text-white">
            Explore Our City
          </h2>
          <p
            className="text-lg max-w-xl mx-auto"
            style={{ color: "oklch(0.65 0.05 200)" }}
          >
            Click on any zone to learn about that part of Eco Sphere.
          </p>
        </div>

        <div className="reveal grid grid-cols-2 gap-4 max-w-3xl mx-auto mb-10">
          {ZONES.map((zone) => (
            <button
              type="button"
              key={zone.id}
              className={`map-zone rounded-3xl p-8 text-center flex flex-col items-center gap-4 ${
                activeZone === zone.id ? "active" : ""
              }`}
              style={{
                background:
                  activeZone === zone.id
                    ? "oklch(0.18 0.06 200)"
                    : "oklch(0.14 0.05 200)",
                border: `2px solid ${
                  activeZone === zone.id ? zone.color : "oklch(0.25 0.05 200)"
                }`,
              }}
              onClick={() =>
                setActiveZone(
                  activeZone === zone.id ? null : (zone.id as MapZone),
                )
              }
              data-ocid={`map.${zone.id}.map_marker`}
            >
              <span className="text-5xl">{zone.icon}</span>
              <span
                className="font-display font-bold text-base sm:text-lg"
                style={{
                  color:
                    activeZone === zone.id
                      ? zone.color
                      : "oklch(0.75 0.05 200)",
                }}
              >
                {zone.label}
              </span>
            </button>
          ))}
        </div>

        {activeInfo && (
          <div
            className="info-panel max-w-3xl mx-auto rounded-3xl overflow-hidden"
            style={{
              background: "oklch(0.14 0.05 200)",
              border: `2px solid ${activeInfo.color}`,
              boxShadow: `0 0 40px ${activeInfo.color}40`,
            }}
            data-ocid="map.panel"
          >
            <img
              src={activeInfo.image}
              alt={activeInfo.label}
              className="w-full h-52 object-cover"
            />
            <div className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{activeInfo.icon}</span>
                <h3
                  className="font-display font-bold text-2xl"
                  style={{ color: activeInfo.color }}
                >
                  {activeInfo.label}
                </h3>
              </div>
              <p
                className="text-base leading-relaxed mb-6"
                style={{ color: "oklch(0.75 0.05 200)" }}
              >
                {activeInfo.description}
              </p>
              <div className="flex flex-wrap gap-3">
                {activeInfo.details.map((d) => (
                  <span
                    key={d}
                    className="text-sm px-4 py-2 rounded-full font-medium"
                    style={{
                      background: `${activeInfo.color}20`,
                      color: activeInfo.color,
                      border: `1px solid ${activeInfo.color}50`,
                    }}
                  >
                    \u2713 {d}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
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
          \u00a9 {year} Eco Sphere. Building a Better World.
        </p>
        <p className="text-xs" style={{ color: "oklch(0.38 0.04 200)" }}>
          Built with \u2764\ufe0f using{" "}
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
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <ApartmentsSection />
        <EnergySection />
        <ParksSection />
        <VideoSection />
        <MapSection />
      </main>
      <Footer />
    </div>
  );
}
