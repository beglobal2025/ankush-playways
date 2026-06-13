"use client";

import { motion, type MotionProps, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import CategoryCard from "@/components/CategoryCard";
import ProductCard from "@/components/ProductCard";
import SectionHeading from "@/components/SectionHeading";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import FloatingWhatsAppButton from "@/components/WhatsAppButton";
import { categories, getWhatsAppUrl, popularProducts, products } from "@/lib/catalogue";

const navItems = [
  ["Home", "#home"],
  ["About", "#about"],
  ["Products", "#products"],
  ["Offer", "#offer"],
  ["Testimonials", "#testimonials"],
  ["Contact", "#contact"],
];

const offers = [
  ["Safe Designs", "Rounded edges, sturdy builds, and soft-touch finishes for carefree play.", "#ff7668"],
  ["Bright Colours", "Playful palettes that feel cheerful, modern, and easy for kids to love.", "#68cabb"],
  ["Quality Check", "Every product is reviewed for strength, balance, and finishing details.", "#ffa626"],
  ["Bulk Supply", "Reliable toy collections for stores, schools, play zones, and distributors.", "#7ca7e8"],
];

const testimonials = [
  {
    quote:
      "The riding toys are colorful, sturdy, and instantly became the favourite corner of our playroom.",
    name: "Priya Sharma",
    tint: "bg-[#fff0e8]",
  },
  {
    quote:
      "Beautiful finishing and quick service. The kids loved the slide and playhouse range from the first day.",
    name: "Rohan Mehta",
    tint: "bg-[#eaf7ff]",
  },
  {
    quote:
      "A dependable collection for our preschool. The designs feel safe, bright, and long lasting.",
    name: "Anita Verma",
    tint: "bg-[#f3edff]",
  },
];

const rolePlayCostumes = products.filter((product) => product.category === "Role Play Costumes");
const rolePlayHighlights = rolePlayCostumes.slice(0, 4);
const catalogueCategories = categories.filter((category) => category.name !== "Role Play Costumes");
const rolePlayAccents = ["bg-[#6fa3dc]", "bg-[#ef817b]", "bg-[#80cbbb]", "bg-[#ff7658]"];
const rockerRange = [
  {
    product: products.find((product) => product.id === "lf-624"),
    label: "Riders",
    image: "/assets/catalog/cutouts/pony-rocking-rideon.png",
    accent: "bg-[#ffbe21]",
    badge: "bg-[#3b82f6]",
  },
  {
    product: products.find((product) => product.id === "lf-108b"),
    label: "Rock & Riders",
    image: "/assets/catalog/cutouts/crab-see-saw.png",
    accent: "bg-[#20bfae]",
    badge: "bg-[#7c3aed]",
  },
  {
    product: products.find((product) => product.id === "lf-925c"),
    label: "Rockers",
    image: "/assets/catalog/cutouts/elephant-rocker.png",
    accent: "bg-[#ff5f67]",
    badge: "bg-[#0ea5e9]",
  },
];

const heroSlides = [
  {
    eyebrow: "Indoor Play Equipment",
    title: "Pick the best",
    accent: "Play Set",
    description:
      "We provide colourful slides, playhouses, activity toys, ride-ons, and indoor play products for the development of children.",
    image: "/assets/catalog/cutouts/play-slide.png",
    alt: "Colorful indoor slide and play structure from the ANKUSH Playways catalog",
    background: "bg-[#ffd8df]",
    accentColor: "text-[#00a9b8]",
    ctaColor: "bg-[#00bfae] hover:bg-[#009f96] shadow-teal-200",
    cta: "Explore Products",
    toySide: "right",
    decorClass: "bg-[#e94858]/65",
  },
  {
    eyebrow: "Slide, Climb & Smile",
    title: "Find the best",
    accent: "Play Structure",
    description:
      "Bright indoor play structures with sturdy balance, smooth edges, and attractive designs for active play.",
    image: "/assets/catalog/cutouts/play-structure.png",
    alt: "Colorful indoor play structure with slide from the ANKUSH Playways catalog",
    background: "bg-[#fff0a8]",
    accentColor: "text-[#e85b80]",
    ctaColor: "bg-[#e85b80] hover:bg-[#d43f69] shadow-pink-200",
    cta: "View Categories",
    toySide: "right",
    decorClass: "bg-[#ffbf31]/65",
  },
  {
    eyebrow: "Tiny Wheels, Big Fun",
    title: "Ride-on toys",
    accent: "To Play",
    description:
      "Cheerful ride-on cars and toddler toys made to turn every room into a little playground.",
    image: "/assets/catalog/cutouts/ride-on-car.png",
    alt: "Red ride-on toy car from the ANKUSH Playways catalog",
    background: "bg-[#c7efff]",
    accentColor: "text-[#ff9f1c]",
    ctaColor: "bg-[#ff9f1c] hover:bg-[#f08a00] shadow-yellow-200",
    cta: "Shop Collection",
    toySide: "center",
    decorClass: "bg-[#52d5cd]/55",
  },
  {
    eyebrow: "Classroom Comfort",
    title: "Dual Seating Desk",
    accent: "Adjustable",
    description:
      "A practical two-seat study desk with adjustable support, comfortable chairs, and a sturdy classroom-ready build.",
    image: "/assets/catalog/cutouts/dual-seating-desk-adjustable.png",
    alt: "Dual Seating Desk Adjustable from the ANKUSH Playways catalog",
    background: "bg-[#e8f2ff]",
    accentColor: "text-[#f05a28]",
    ctaColor: "bg-[#2563eb] hover:bg-[#1d4ed8] shadow-blue-200",
    cta: "View Desks",
    toySide: "right",
    decorClass: "bg-[#7fb3ff]/55",
  },
  {
    eyebrow: "Pretend Play Favourite",
    title: "Junior Living",
    accent: "House",
    description:
      "A charming activity playhouse for imaginative role play, social learning, and bright indoor play corners.",
    image: "/assets/catalog/cutouts/junior-living-house.png",
    alt: "Junior Living House from the ANKUSH Playways catalog",
    background: "bg-[#dcfce7]",
    accentColor: "text-[#0ea5a4]",
    ctaColor: "bg-[#16a34a] hover:bg-[#15803d] shadow-green-200",
    cta: "View Play Houses",
    toySide: "center",
    decorClass: "bg-[#facc15]/55",
  },
];

function fadeUp(delay = 0): MotionProps {
  return {
    initial: { opacity: 0, y: 34 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.18 },
    transition: { duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] },
  };
}

function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-sky-100 bg-white/90 shadow-[0_10px_30px_rgba(30,120,180,0.10)] backdrop-blur">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
        <a href="#home" className="flex items-center" aria-label="ANKUSH Playways home">
          <img
            src="/assets/logo.svg"
            alt="ANKUSH Playways"
            className="h-16 w-auto max-w-[150px] object-contain sm:h-[80px] sm:max-w-[180px]"
          />
        </a>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="grid size-11 place-items-center rounded-full border border-sky-100 bg-sky-50 text-sky-700 shadow-sm md:hidden"
        >
          <span className="relative block h-3.5 w-5">
            <span className="absolute left-0 top-0 h-0.5 w-5 rounded bg-current" />
            <span className="absolute left-0 top-1.5 h-0.5 w-5 rounded bg-current" />
            <span className="absolute bottom-0 left-0 h-0.5 w-5 rounded bg-current" />
          </span>
        </button>

        <div className="hidden items-center gap-7 text-sm font-bold text-sky-800 md:flex">
          {navItems.map(([label, href]) => (
            <a key={label} href={href} className="transition hover:text-pink-500">
              {label}
            </a>
          ))}
        </div>
      </nav>

      {open ? (
        <div className="border-t border-sky-100 bg-white px-5 py-4 md:hidden">
          <div className="grid gap-3 text-sm font-bold text-sky-800">
            {navItems.map(([label, href]) => (
              <a key={label} href={href} onClick={() => setOpen(false)} className="rounded-full bg-sky-50 px-4 py-3">
                {label}
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}

function FloatingDecor() {
  const reduce = useReducedMotion();
  const animate = reduce ? {} : { y: [0, -16, 0], rotate: [-3, 3, -3] };

  return (
    <>
      <motion.img
        src="/assets/balloon.svg"
        alt=""
        aria-hidden="true"
        animate={animate}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none fixed right-4 top-32 z-20 hidden w-24 opacity-90 lg:block"
      />
      <motion.img
        src="/assets/catalog/building-blocks.jpg"
        alt=""
        aria-hidden="true"
        animate={reduce ? {} : { y: [0, 18, 0], rotate: [4, -2, 4] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none fixed bottom-24 right-16 z-20 hidden w-28 rounded-2xl opacity-90 shadow-xl lg:block"
      />
    </>
  );
}

function SectionTitle({
  title,
  accent,
}: {
  eyebrow?: string;
  title: string;
  accent?: string;
}) {
  return (
    <motion.div {...fadeUp()} className="mx-auto mb-8 max-w-3xl text-center">
      <h2 className="text-4xl font-black leading-tight text-sky-700 sm:text-5xl">
        {title} {accent ? <span className="text-yellow-500">{accent}</span> : null}
      </h2>
      <div className="mx-auto mt-4 h-1.5 w-24 rounded-full bg-gradient-to-r from-pink-400 via-yellow-400 to-teal-400" />
    </motion.div>
  );
}

function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 5200);

    return () => window.clearInterval(timer);
  }, [reduce]);

  const goToSlide = (index: number) => {
    setActiveSlide((index + heroSlides.length) % heroSlides.length);
  };

  return (
    <section id="home" className="relative overflow-hidden bg-white pt-20">
      <div className="relative min-h-[calc(100vh-5rem)] overflow-hidden">
        <motion.div
          className="flex min-h-[calc(100vh-5rem)]"
          animate={{ x: `-${activeSlide * 100}%` }}
          transition={{ duration: reduce ? 0 : 0.85, ease: [0.76, 0, 0.24, 1] }}
        >
          {heroSlides.map((slide, index) => (
            <article
              key={slide.accent}
              className={`relative min-h-[calc(100vh-5rem)] w-full shrink-0 overflow-hidden ${slide.background}`}
            >
              <div className="absolute inset-0 opacity-80 [background-image:linear-gradient(115deg,rgba(255,255,255,0.45)_0_18%,transparent_18%_100%)]" />
              <div className="absolute -left-24 bottom-0 h-64 w-[45rem] rounded-[55%_45%_0_0] bg-white/45" />
              <div
                className={`absolute bottom-0 right-0 h-[58%] w-[72%] rounded-tl-[68%] ${slide.decorClass}`}
              />
              <div className="absolute left-0 right-0 bottom-0 h-24 bg-white [clip-path:ellipse(66%_70%_at_50%_100%)]" />
              <img src="/assets/toy-bear.svg" alt="" aria-hidden="true" className="absolute left-[8%] top-[18%] hidden w-20 rotate-[-8deg] opacity-95 md:block" />
              <img src="/assets/kite.svg" alt="" aria-hidden="true" className="absolute right-[8%] top-[12%] hidden w-28 rotate-12 opacity-80 lg:block" />
              <img src="/assets/blocks.svg" alt="" aria-hidden="true" className="absolute bottom-8 left-[10%] z-10 hidden w-40 opacity-95 md:block" />

              <div className="relative mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[0.42fr_0.58fr]">
                <motion.div
                  initial={false}
                  animate={{
                    opacity: activeSlide === index ? 1 : 0.35,
                    x: activeSlide === index ? 0 : -32,
                  }}
                  transition={{ duration: 0.6, delay: activeSlide === index ? 0.2 : 0 }}
                  className="relative z-20 max-w-xl pt-8 text-center sm:text-left lg:pt-0"
                >
                  <p className="mb-5 font-serif text-xl italic text-[#df4c65] drop-shadow-[0_2px_0_rgba(255,255,255,0.75)]">
                    {slide.eyebrow}
                  </p>
                  <h1 className="text-5xl font-black leading-[0.98] text-sky-950 drop-shadow-[0_3px_0_rgba(255,255,255,0.75)] sm:text-6xl lg:text-7xl">
                    {slide.title}
                    <span className={`block ${slide.accentColor}`}>{slide.accent}</span>
                  </h1>
                  <p className="mx-auto mt-6 max-w-md text-base font-bold leading-7 text-slate-700 drop-shadow-[0_1px_0_rgba(255,255,255,0.85)] sm:mx-0">
                    {slide.description}
                  </p>
                  <a
                    href="#products"
                    className={`mt-7 inline-flex rounded-full px-7 py-3.5 text-sm font-black text-white shadow-xl transition hover:-translate-y-1 ${slide.ctaColor}`}
                  >
                    {slide.cta}
                  </a>
                </motion.div>

                <motion.div
                  initial={false}
                  animate={{
                    opacity: activeSlide === index ? 1 : 0.45,
                    scale: activeSlide === index ? 1 : 0.88,
                    x: activeSlide === index ? 0 : 80,
                  }}
                  transition={{ duration: 0.75, delay: activeSlide === index ? 0.22 : 0 }}
                  className={`relative z-10 flex justify-center self-end pb-16 lg:self-center lg:pb-0 ${slide.toySide === "center" ? "lg:justify-center" : "lg:justify-end"}`}
                >
                  <div className="absolute bottom-2 left-1/2 h-20 w-[68%] -translate-x-1/2 rounded-[50%] bg-slate-900/14 blur-2xl" />
                  <motion.img
                    src={slide.image}
                    alt={slide.alt}
                    animate={{ y: reduce ? 0 : [0, -16, 0] }}
                    transition={{ duration: 4.2, repeat: reduce ? 0 : Infinity, ease: "easeInOut" }}
                    className="hero-product-cutout relative w-full max-w-[720px] object-contain drop-shadow-[0_34px_30px_rgba(31,87,140,0.25)]"
                  />
                </motion.div>
              </div>
            </article>
          ))}
        </motion.div>

        <button
          type="button"
          aria-label="Previous banner"
          onClick={() => goToSlide(activeSlide - 1)}
          className="absolute left-0 top-1/2 z-30 grid h-20 w-11 -translate-y-1/2 place-items-center bg-white/25 text-4xl font-light text-white backdrop-blur-sm transition hover:bg-white/40"
        >
          ‹
        </button>
        <button
          type="button"
          aria-label="Next banner"
          onClick={() => goToSlide(activeSlide + 1)}
          className="absolute right-0 top-1/2 z-30 grid h-20 w-11 -translate-y-1/2 place-items-center bg-white/25 text-4xl font-light text-white backdrop-blur-sm transition hover:bg-white/40"
        >
          ›
        </button>

        <div className="absolute bottom-7 left-1/2 z-30 flex -translate-x-1/2 items-center gap-3" aria-label="Hero banner slides">
          {heroSlides.map((item, index) => (
            <button
              key={item.accent}
              type="button"
              aria-label={`Show banner ${index + 1}`}
              aria-current={activeSlide === index}
              onClick={() => goToSlide(index)}
              className={`size-3 rounded-full border-2 border-white transition-all ${
                activeSlide === index ? "bg-white" : "bg-transparent hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="relative overflow-hidden bg-white py-14 lg:py-16">
      <img src="/assets/kite.svg" alt="" aria-hidden="true" className="absolute left-4 top-20 hidden w-32 -rotate-12 opacity-80 lg:block" />
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-2">
        <motion.div {...fadeUp()} className="relative mx-auto w-full max-w-[600px]">
          <div className="absolute -left-8 top-12 h-44 w-44 rounded-full bg-sky-200" />
          <div className="absolute -right-5 -top-5 h-28 w-28 rounded-full bg-yellow-200" />
          <div className="paper-shadow relative overflow-hidden rounded-[34px] border-[14px] border-white bg-[#fff5ef] p-6">
            <img
              src="/assets/catalog/playroom-tables.jpg"
              alt="Colorful indoor playroom table and chair setup from the ANKUSH Playways catalog"
              className="mx-auto h-80 w-full rounded-[20px] object-cover sm:h-[23rem]"
            />
          </div>
        </motion.div>

        <motion.div {...fadeUp(0.08)}>
          <h2 className="text-4xl font-black leading-tight text-sky-700 sm:text-5xl">
            Welcome to <span className="text-yellow-500">ANKUSH Playways Products</span>
          </h2>
          <div className="mt-5 h-1.5 w-24 rounded-full bg-gradient-to-r from-pink-400 via-yellow-400 to-teal-400" />
          <div className="mt-8 border-l-4 border-sky-200 pl-7 text-base font-medium leading-8 text-slate-700">
            <p>
              We create child-friendly toys and riding products that bring colour, motion, and imagination into everyday play. Our collection focuses on sturdy materials, cheerful designs, and comfortable shapes for toddlers and young kids.
            </p>
            <p className="mt-4">
              From play structures and ride-on cars to ball pools, blocks, and activity toys, each product is designed to feel joyful on the shelf and dependable in little hands.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ProductCategories() {
  return (
    <section id="products" className="bg-white pb-16 pt-12">
      <SectionHeading
        eyebrow="Browse by range"
        title="All Catalogue"
        accent="Categories"
        description="Discover every ANKUSH Playways catalogue range, grouped for schools, play zones, preschools, and family spaces."
      />
      <div className="grid w-full gap-6 px-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {catalogueCategories.map((category, index) => (
          <motion.div key={category.id} {...fadeUp(Math.min(index * 0.025, 0.28))}>
            <CategoryCard category={category} index={index} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function RockerRange() {
  return (
    <section className="relative overflow-hidden bg-white py-16">
      <div className="absolute inset-x-0 bottom-0 h-24 bg-[#fff0f4] [background-image:radial-gradient(circle_at_24px_24px,rgba(244,114,182,0.18)_0_2px,transparent_3px)] [background-size:72px_72px]" />
      <div className="relative mx-auto max-w-7xl px-5 text-center sm:px-8">
        <h2 className="text-4xl font-black leading-tight text-sky-700 sm:text-5xl">
          Find the <span className="text-yellow-500">Rockers Range</span>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base font-medium leading-7 text-slate-600">
          Bright ride-on rockers and see-saw toys made for active, cheerful indoor play.
        </p>

        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          {rockerRange.map(({ product, label, image, accent, badge }, index) =>
            product ? (
              <motion.article key={product.slug} {...fadeUp(index * 0.06)} className="group relative">
                <div className="relative mx-auto aspect-[1.06] max-w-[390px]">
                  <div className="absolute inset-x-5 bottom-8 h-[78%] rounded-[42%_58%_38%_62%/55%_42%_58%_45%] bg-slate-900/10 translate-x-5 translate-y-5" />
                  <div className={`absolute inset-x-5 bottom-12 h-[78%] rounded-[58%_42%_62%_38%/45%_58%_42%_55%] ${accent}`} />
                  <span className={`absolute right-7 top-6 z-10 grid size-16 place-items-center rounded-full ${badge} text-3xl font-black text-white shadow-xl shadow-sky-100`}>
                    {index + 1}
                  </span>
                  <img
                    src={image}
                    alt={product.images[0]?.alt ?? product.name}
                    className="relative z-10 mx-auto h-full w-full object-contain drop-shadow-[0_24px_18px_rgba(30,64,120,0.20)] transition duration-300 group-hover:-translate-y-2"
                  />
                </div>
                <h3 className="mt-4 text-2xl font-black text-slate-950">{label}</h3>
                <p className="mt-1 text-sm font-bold text-slate-500">{product.name}</p>
                <div className="mt-5 flex justify-center gap-3">
                  <Link
                    href={`/products/${product.slug}`}
                    className="inline-flex rounded-full bg-sky-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-sky-100 transition hover:-translate-y-1 hover:bg-sky-700"
                  >
                    View Details
                  </Link>
                  <a
                    href={getWhatsAppUrl(product)}
                    className="inline-flex rounded-full bg-teal-500 px-5 py-3 text-sm font-black text-white shadow-lg shadow-teal-100 transition hover:-translate-y-1 hover:bg-teal-600"
                  >
                    Enquire
                  </a>
                </div>
              </motion.article>
            ) : null,
          )}
        </div>
      </div>
    </section>
  );
}

function PopularProducts() {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scrollProducts = (direction: "left" | "right") => {
    const slider = sliderRef.current;

    if (!slider) {
      return;
    }

    slider.scrollBy({
      left: direction === "left" ? -slider.clientWidth * 0.82 : slider.clientWidth * 0.82,
      behavior: "smooth",
    });
  };

  return (
    <section className="bg-[#f4fbff] py-16">
      <SectionHeading
        eyebrow="Popular picks"
        title="Featured"
        accent="Products"
        description="A quick look at catalogue products with real images, MRP details, and direct enquiry actions."
      />
      <div className="relative px-5 sm:px-8">
        <button
          type="button"
          aria-label="Previous featured products"
          onClick={() => scrollProducts("left")}
          className="absolute left-2 top-1/2 z-20 hidden size-11 -translate-y-1/2 place-items-center rounded-full bg-white text-2xl font-black text-sky-700 shadow-xl shadow-sky-100 transition hover:-translate-x-0.5 hover:bg-sky-50 lg:grid"
        >
          ‹
        </button>
        <div
          ref={sliderRef}
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {popularProducts.map((product, index) => (
            <motion.div
              key={product.slug}
              {...fadeUp(index * 0.04)}
              className="flex w-[82vw] shrink-0 snap-start sm:w-[44vw] lg:w-[23vw] 2xl:w-[18vw]"
            >
              <ProductCard product={product} showPrice={false} showActions={false} />
            </motion.div>
          ))}
        </div>
        <button
          type="button"
          aria-label="Next featured products"
          onClick={() => scrollProducts("right")}
          className="absolute right-2 top-1/2 z-20 hidden size-11 -translate-y-1/2 place-items-center rounded-full bg-white text-2xl font-black text-sky-700 shadow-xl shadow-sky-100 transition hover:translate-x-0.5 hover:bg-sky-50 lg:grid"
        >
          ›
        </button>
      </div>
    </section>
  );
}

function RolePlayCostumes() {
  if (rolePlayHighlights.length === 0) {
    return null;
  }

  return (
    <section className="kid-pattern relative overflow-hidden py-16">
      <img src="/assets/blocks.svg" alt="" aria-hidden="true" className="absolute right-10 top-6 hidden w-28 rotate-6 opacity-90 lg:block" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mx-auto mb-8 max-w-3xl text-center">
          <h2 className="text-4xl font-black leading-tight text-sky-700 sm:text-5xl">
            Role Play <span className="text-yellow-500">Costumes</span>
          </h2>
          <div className="mx-auto mt-4 h-1.5 w-24 rounded-full bg-gradient-to-r from-pink-400 via-yellow-400 to-teal-400" />
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {rolePlayHighlights.map((product, index) => {
            const name = product.name.replace("Fireghter", "Firefighter");

            return (
              <motion.article key={product.slug} {...fadeUp(index * 0.05)} className="group">
                <Link
                  href={`/products/${product.slug}`}
                  className={`relative block h-full min-h-[360px] overflow-hidden rounded-[10px] ${rolePlayAccents[index % rolePlayAccents.length]} p-5 text-white shadow-xl shadow-pink-100/80 transition hover:-translate-y-1 hover:shadow-2xl`}
                >
                  <h3 className="relative z-20 text-2xl font-black leading-tight">{name}</h3>
                  <div className="absolute bottom-0 left-0 right-0 h-[72%] bg-[#fff9f7] [clip-path:polygon(0_12%,100%_0,100%_100%,0_100%)]" />
                  <div className="absolute right-0 top-[22%] h-20 w-20 rounded-bl-full bg-[#30396f]" />
                  <div className="absolute bottom-6 left-0 h-44 w-14 rounded-r-full bg-sky-100" />
                  <img
                    src={product.images[0]?.src}
                    alt={product.images[0]?.alt ?? product.name}
                    className="absolute bottom-14 left-1/2 z-10 h-[62%] w-[82%] -translate-x-1/2 object-contain mix-blend-multiply transition duration-300 group-hover:scale-105"
                  />
                  <span className="absolute bottom-9 left-7 z-20 inline-flex rounded-full bg-white px-5 py-3 text-sm font-black text-sky-700 shadow-lg">
                    Explore
                  </span>
                </Link>
              </motion.article>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            href={`/products?category=${encodeURIComponent("Role Play Costumes")}`}
            className="inline-flex rounded-full bg-sky-600 px-7 py-3.5 text-sm font-black text-white shadow-lg shadow-sky-100 transition hover:-translate-y-1 hover:bg-sky-700"
          >
            View Role Play Range
          </Link>
        </div>
      </div>
    </section>
  );
}

function CatalogueCTA() {
  return (
    <section className="bg-white px-5 py-14 sm:px-8">
      <div className="mx-auto grid max-w-7xl items-center gap-8 overflow-hidden rounded-[34px] bg-sky-700 p-8 text-white shadow-2xl shadow-sky-100 sm:p-10 lg:grid-cols-[1fr_auto]">
        <div>
          <h2 className="text-3xl font-black leading-tight sm:text-5xl">Explore every product from the 2026 catalogue</h2>
          <p className="mt-4 max-w-2xl text-sm font-semibold leading-7 text-sky-50">
            Search by product code, filter by category, compare MRP, and enquire instantly on WhatsApp.
          </p>
        </div>
        <Link
          href="/products"
          className="inline-flex justify-center rounded-full bg-white px-7 py-4 text-sm font-black text-sky-700 shadow-xl transition hover:-translate-y-1 hover:bg-yellow-100"
        >
          Explore Complete Catalogue
        </Link>
      </div>
    </section>
  );
}

function Offer() {
  return (
    <section id="offer" className="kid-pattern relative overflow-hidden py-16">
      <SectionTitle title="What We Offer" />
      <div className="mx-auto grid max-w-7xl gap-6 px-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
        {offers.map(([title, text, color], index) => (
          <motion.article
            key={title}
            {...fadeUp(index * 0.05)}
            whileHover={{ y: -8 }}
            className="rounded-[28px] bg-white p-7 shadow-xl shadow-pink-100/80"
          >
            <div className="mb-6 grid size-16 place-items-center rounded-3xl text-2xl font-black text-white" style={{ backgroundColor: color }}>
              {index + 1}
            </div>
            <h3 className="text-2xl font-black text-sky-800">{title}</h3>
            <p className="mt-4 text-sm font-medium leading-7 text-slate-600">{text}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function Promo() {
  const features = ["Perfect designs", "Safe for playing", "No sharp edges", "Attractive looks"];

  return (
    <section className="relative overflow-hidden bg-[#ca5fd0] py-16">
      <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.22)_0_24%,transparent_24%_100%)]" />
      <div className="absolute bottom-0 left-0 h-44 w-[42rem] rounded-tr-[80%] bg-white/20" />
      <div className="absolute bottom-0 right-0 h-60 w-[50rem] rounded-tl-[80%] bg-[#ffca28]/40" />
      <img src="/assets/toy-duck.svg" alt="" aria-hidden="true" className="absolute right-[8%] top-10 hidden w-24 -rotate-12 opacity-90 lg:block" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2">
        <motion.div {...fadeUp()} className="relative order-2 lg:order-1">
          <div className="absolute bottom-0 left-1/2 h-20 w-[70%] -translate-x-1/2 rounded-[50%] bg-slate-950/20 blur-2xl" />
          <img
            src="/assets/catalog/cutouts/play-structure.png"
            alt="Indoor play structure from the ANKUSH Playways catalog"
            className="hero-product-cutout relative mx-auto h-80 w-full object-contain sm:h-[27rem]"
          />
        </motion.div>

        <motion.div {...fadeUp(0.08)} className="relative z-10 order-1 text-white lg:order-2">
          <h2 className="text-4xl font-black leading-tight drop-shadow-[0_4px_0_rgba(90,36,120,0.24)] sm:text-6xl">
            Best Toy Collection For Your Kids
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {features.map((feature, index) => (
              <div key={feature} className="flex items-center gap-4">
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl border-4 border-white text-xl font-black">{index + 1}</span>
                <span className="text-xl font-black leading-6">{feature}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section id="testimonials" className="relative overflow-hidden bg-white py-16">
      <SectionTitle eyebrow="Testimonial" title="Happy" accent="Clients" />
      <div className="mx-auto grid max-w-6xl gap-7 px-5 sm:px-8 lg:grid-cols-3">
        {testimonials.map((item, index) => (
          <motion.article
            key={item.name}
            {...fadeUp(index * 0.06)}
            className={`${item.tint} relative rounded-[30px] border-2 border-dashed border-sky-200 p-8 shadow-lg shadow-sky-100`}
          >
            <p className="text-lg font-semibold leading-8 text-slate-700">"{item.quote}"</p>
            <h3 className="mt-8 text-center text-lg font-black text-slate-900">{item.name}</h3>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="contact" className="relative overflow-hidden bg-white pt-12">
      <div className="wave-footer bg-sky-600 px-5 pb-10 pt-20 text-white sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-3">
          <div>
            <h3 className="text-3xl font-black">We Promise</h3>
            <p className="mt-6 max-w-md text-sm font-medium leading-8 text-sky-50">
              We never compromise on the quality of our toy range and work to deliver durable, colourful, child-friendly products on time.
            </p>
          </div>
          <div>
            <h3 className="text-3xl font-black">Useful Links</h3>
            <div className="mt-6 grid gap-3 text-sm font-bold text-sky-50">
              {navItems.slice(1).map(([label, href]) => (
                <a key={label} href={href} className="transition hover:text-yellow-200">
                  {label}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-black">Contact Us</h3>
            <div className="mt-6 grid gap-4 text-sm font-semibold leading-7 text-sky-50">
              <p>Phone: +91-9811148225</p>
              <p>Email: contact@gmail.com</p>
              <p>Address: Sector 3, Bawana Industrial Area, Delhi 110039, India.</p>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-12 max-w-7xl border-t border-sky-400 pt-7 text-center text-sm font-semibold text-sky-50">
          &copy; 2026 ANKUSH Playways. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}

function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/919811148225"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-5 z-50 grid size-16 place-items-center rounded-2xl bg-[#25d366] text-white shadow-2xl shadow-green-300 transition hover:-translate-y-1"
    >
      <svg viewBox="0 0 32 32" aria-hidden="true" className="size-9 fill-current">
        <path d="M16.04 3.2A12.68 12.68 0 0 0 5.18 22.4L3.6 28.8l6.55-1.52A12.72 12.72 0 1 0 16.04 3.2Zm0 2.42a10.3 10.3 0 0 1 8.7 15.82 10.34 10.34 0 0 1-12.94 3.6l-.45-.23-3.9.9.93-3.78-.28-.48a10.26 10.26 0 0 1 7.94-15.83Zm-4.5 5.47c-.22 0-.58.08-.88.42-.3.33-1.16 1.13-1.16 2.76s1.19 3.2 1.36 3.43c.17.22 2.3 3.68 5.67 5.02 2.8 1.1 3.37.88 3.98.82.6-.06 1.96-.8 2.24-1.57.27-.77.27-1.43.19-1.57-.08-.14-.3-.22-.63-.39-.33-.16-1.96-.96-2.26-1.07-.3-.11-.52-.16-.74.17-.22.33-.85 1.07-1.04 1.29-.2.22-.39.25-.72.08-.33-.16-1.4-.52-2.67-1.65-.99-.88-1.65-1.97-1.84-2.3-.2-.33-.02-.51.15-.67.15-.15.33-.39.5-.58.16-.2.22-.33.33-.55.11-.22.06-.41-.03-.58-.08-.16-.74-1.78-1.02-2.44-.27-.64-.54-.55-.74-.56h-.66Z" />
      </svg>
    </a>
  );
}

export default function LandingPage() {
  return (
    <main>
      <SiteHeader />
      <FloatingDecor />
      <Hero />
      <About />
      <ProductCategories />
      <RockerRange />
      <PopularProducts />
      <RolePlayCostumes />
      <CatalogueCTA />
      <Offer />
      <Promo />
      <Testimonials />
      <SiteFooter />
      <FloatingWhatsAppButton floating />
    </main>
  );
}
