"use client";

import { motion, type MotionProps, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import CategoryCard from "@/components/CategoryCard";
import SectionHeading from "@/components/SectionHeading";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import FloatingWhatsAppButton from "@/components/WhatsAppButton";
import type { Category, Product } from "@/lib/catalogue";
import { getWhatsAppUrl } from "@/lib/catalogue";

const navItems = [
  ["Home", "#home"],
  ["About", "#about"],
  ["Products", "#products"],
  ["Testimonials", "#testimonials"],
  ["Contact Us", "/contact"],
];

const offers = [
  ["Safe Designs", "Rounded edges, sturdy builds, and soft-touch finishes for carefree play.", "#fd9aa0"],
  ["Bright Colours", "Playful palettes that feel cheerful, modern, and easy for kids to love.", "#a6e5cd"],
  ["Quality Check", "Every product is reviewed for strength, balance, and finishing details.", "#feb300"],
  ["Bulk Supply", "Reliable toy collections for stores, schools, play zones, and distributors.", "#7ecae1"],
];

const testimonials = [
  {
    quote:
      "The riding toys are colorful, sturdy, and instantly became the favourite corner of our playroom.",
    name: "Priya Sharma",
    tint: "bg-[var(--sun-coral-soft)]",
  },
  {
    quote:
      "Beautiful finishing and quick service. The kids loved the slide and playhouse range from the first day.",
    name: "Rohan Mehta",
    tint: "bg-[var(--sun-sky-soft)]",
  },
  {
    quote:
      "A dependable collection for our preschool. The designs feel safe, bright, and long lasting.",
    name: "Anita Verma",
    tint: "bg-[var(--sun-yellow-pale)]",
  },
  {
    quote:
      "The outdoor equipment arrived on time and the quality exceeded our expectations. Our students enjoy it every day.",
    name: "Gurpreet Kaur",
    tint: "bg-[var(--sun-mint-soft)]",
  },
  {
    quote:
      "From product selection to delivery, the team was responsive and helpful throughout our school playground project.",
    name: "Amit Malhotra",
    tint: "bg-[var(--sun-coral-soft)]",
  },
  {
    quote:
      "We received durable, vibrant products at a great value. Ankush Playways has become our trusted supplier.",
    name: "Neha Kapoor",
    tint: "bg-[var(--sun-sky-soft)]",
  },
];

const rolePlayAccents = [
  "bg-[var(--sun-sky)]",
  "bg-[var(--sun-coral)]",
  "bg-[var(--sun-mint-strong)]",
  "bg-[var(--sun-yellow)]",
];

const featuredThemes = [
  {
    frame: "border-[var(--sun-sky)]",
    image: "bg-[var(--sun-sky-soft)]",
    badge: "bg-[var(--sun-sky)]",
    footer: "bg-[var(--sun-sky-dark)]",
  },
  {
    frame: "border-[var(--sun-mint-strong)]",
    image: "bg-[var(--sun-mint-soft)]",
    badge: "bg-[var(--sun-mint-strong)]",
    footer: "bg-[var(--sun-mint-strong)]",
  },
  {
    frame: "border-[var(--sun-yellow)]",
    image: "bg-[var(--sun-yellow-pale)]",
    badge: "bg-[var(--sun-yellow)]",
    footer: "bg-[var(--sun-yellow)]",
  },
  {
    frame: "border-[var(--sun-coral-strong)]",
    image: "bg-[var(--sun-coral-soft)]",
    badge: "bg-[var(--sun-coral-strong)]",
    footer: "bg-[var(--sun-coral-strong)]",
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
    alt: "Colorful indoor slide and play structure from the Ankush Playways catalog",
    background: "hero-scene-coral",
    accentColor: "text-[var(--sun-sky-dark)]",
    ctaColor: "bg-[var(--sun-mint-strong)] hover:bg-[var(--sun-sky-dark)] shadow-[#a6e5cd]/40",
    cta: "Explore Products",
    toySide: "right",
    decorClass: "bg-[var(--sun-coral)]/65",
  },
  {
    eyebrow: "Slide, Climb & Smile",
    title: "Find the best",
    accent: "Play Structure",
    description:
      "Bright indoor play structures with sturdy balance, smooth edges, and attractive designs for active play.",
    image: "/assets/catalog/cutouts/play-structure.png",
    alt: "Colorful indoor play structure with slide from the Ankush Playways catalog",
    background: "hero-scene-yellow",
    accentColor: "text-[var(--sun-coral-strong)]",
    ctaColor: "bg-[var(--sun-coral-strong)] hover:bg-[var(--sun-sky-dark)] shadow-[#fd9aa0]/30",
    cta: "View Categories",
    toySide: "right",
    decorClass: "bg-[var(--sun-yellow)]/65",
  },
  {
    eyebrow: "Tiny Wheels, Big Fun",
    title: "Ride-on toys",
    accent: "To Play",
    description:
      "Cheerful ride-on cars and toddler toys made to turn every room into a little playground.",
    image: "/assets/catalog/cutouts/ride-on-car.png",
    alt: "Red ride-on toy car from the Ankush Playways catalog",
    background: "hero-scene-sky",
    accentColor: "text-[var(--sun-yellow)]",
    ctaColor: "bg-[var(--sun-yellow)] hover:bg-[var(--sun-sky-dark)] shadow-[#feb300]/25",
    cta: "Shop Collection",
    toySide: "center",
    decorClass: "bg-[var(--sun-mint)]/65",
  },
  {
    eyebrow: "Classroom Comfort",
    title: "Dual Seating Desk",
    accent: "Adjustable",
    description:
      "A practical two-seat study desk with adjustable support, comfortable chairs, and a sturdy classroom-ready build.",
    image: "/assets/catalog/cutouts/dual-seating-desk-adjustable.png",
    alt: "Dual Seating Desk Adjustable from the Ankush Playways catalog",
    background: "hero-scene-sky",
    accentColor: "text-[var(--sun-coral-strong)]",
    ctaColor: "bg-[var(--sun-sky)] hover:bg-[var(--sun-sky-dark)] shadow-[#7ecae1]/25",
    cta: "View Desks",
    toySide: "right",
    decorClass: "bg-[var(--sun-sky)]/55",
  },
  {
    eyebrow: "Pretend Play Favourite",
    title: "Junior Living",
    accent: "House",
    description:
      "A charming activity playhouse for imaginative role play, social learning, and bright indoor play corners.",
    image: "/assets/catalog/cutouts/junior-living-house.png",
    alt: "Junior Living House from the Ankush Playways catalog",
    background: "hero-scene-mint",
    accentColor: "text-[var(--sun-sky-dark)]",
    ctaColor: "bg-[var(--sun-mint-strong)] hover:bg-[var(--sun-sky-dark)] shadow-[#a6e5cd]/35",
    cta: "View Play Houses",
    toySide: "center",
    decorClass: "bg-[var(--sun-yellow)]/55",
  },
];

type HeroSlide = (typeof heroSlides)[number] & {
  ctaHref?: string;
  customBanner?: boolean;
  imageClass?: string;
};

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
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--sun-line)] bg-white/90 shadow-[0_10px_30px_rgba(126,202,225,0.18)] backdrop-blur">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
        <a href="#home" className="flex items-center" aria-label="Ankush Playways home">
          <img
            src="/assets/ankush-logo.png"
            alt="Ankush Playways"
            className="h-16 w-auto max-w-[150px] object-contain sm:h-[120px] sm:max-w-[200px]"
          />
        </a>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="grid size-11 place-items-center rounded-full border border-[var(--sun-line)] bg-[var(--sun-sky-soft)] text-[var(--sun-ink)] shadow-sm md:hidden"
        >
          <span className="relative block h-3.5 w-5">
            <span className="absolute left-0 top-0 h-0.5 w-5 rounded bg-current" />
            <span className="absolute left-0 top-1.5 h-0.5 w-5 rounded bg-current" />
            <span className="absolute bottom-0 left-0 h-0.5 w-5 rounded bg-current" />
          </span>
        </button>

        <div className="hidden items-center gap-7 text-sm font-bold text-[var(--sun-ink)] md:flex">
          {navItems.map(([label, href]) => (
            <a key={label} href={href} className="transition hover:text-[var(--sun-coral-strong)]">
              {label}
            </a>
          ))}
        </div>
      </nav>

      {open ? (
        <div className="border-t border-[var(--sun-line)] bg-white px-5 py-4 md:hidden">
          <div className="grid gap-3 text-sm font-bold text-[var(--sun-ink)]">
            {navItems.map(([label, href]) => (
              <a key={label} href={href} onClick={() => setOpen(false)} className="rounded-full bg-[var(--sun-sky-soft)] px-4 py-3">
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
        src="/assets/catalog/cutouts/makarci-stepping-balance-stones.png"
        alt=""
        aria-hidden="true"
        animate={reduce ? {} : { y: [0, 18, 0], rotate: [4, -2, 4] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none fixed bottom-28 right-20 z-20 hidden w-36 object-contain opacity-95 drop-shadow-[0_18px_20px_rgba(40,141,176,0.24)] lg:block"
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
      <h2 className="text-4xl font-black leading-tight text-[var(--sun-sky-dark)] sm:text-5xl">
        {title} {accent ? <span className="text-[var(--sun-coral-strong)]">{accent}</span> : null}
      </h2>
      <div className="mx-auto mt-4 h-1.5 w-24 rounded-full bg-gradient-to-r from-[var(--sun-coral)] via-[var(--sun-yellow)] to-[var(--sun-mint)]" />
    </motion.div>
  );
}

function Hero({ bannerCtaHrefs = [], bannerImageSrcs = [] }: { bannerCtaHrefs?: string[]; bannerImageSrcs?: string[] }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const reduce = useReducedMotion();
  const slides: HeroSlide[] = heroSlides.map((slide, index) => {
    const bannerImageSrc = bannerImageSrcs[index];

    return bannerImageSrc
      ? {
          ...slide,
          ctaHref: bannerCtaHrefs[index],
          image: bannerImageSrc,
          alt: `Ankush Playways homepage banner ${index + 1}`,
          customBanner: true,
        }
      : {
          ...slide,
          ctaHref: bannerCtaHrefs[index],
        };
  });
  const slideCount = slides.length;

  useEffect(() => {
    if (reduce) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slideCount);
    }, 6800);

    return () => window.clearInterval(timer);
  }, [reduce, slideCount]);

  const goToSlide = (index: number) => {
    setActiveSlide((index + slideCount) % slideCount);
  };

  return (
    <section id="home" className="relative overflow-hidden bg-white">
      <div className="relative min-h-[max(100svh,760px)] overflow-hidden sm:min-h-[max(100svh,880px)] lg:min-h-screen">
        <div className="relative min-h-[max(100svh,760px)] sm:min-h-[max(100svh,880px)] lg:min-h-screen">
          {slides.map((slide, index) => (
            <motion.article
              key={`${slide.accent}-${slide.image}`}
              initial={false}
              animate={{
                opacity: activeSlide === index ? 1 : 0,
                scale: activeSlide === index ? 1 : 1.015,
              }}
              transition={{ duration: reduce ? 0 : 1.15, ease: [0.45, 0, 0.15, 1] }}
              className={`absolute inset-0 min-h-[max(100svh,760px)] overflow-hidden sm:min-h-[max(100svh,880px)] lg:min-h-screen ${slide.background} ${
                activeSlide === index ? "pointer-events-auto z-10" : "pointer-events-none z-0"
              }`}
            >
              <div className="absolute inset-0 opacity-70 [background-image:radial-gradient(circle_at_12%_24%,rgba(255,255,255,0.7)_0_52px,transparent_54px),radial-gradient(circle_at_28%_18%,rgba(255,255,255,0.48)_0_42px,transparent_44px),radial-gradient(circle_at_86%_18%,rgba(255,255,255,0.54)_0_58px,transparent_60px)]" />
              <div className="absolute left-[37%] top-[34%] hidden h-56 w-56 rounded-full border-2 border-dashed border-white/80 opacity-75 lg:block" />
              <div className="banner-moon absolute right-[8%] top-[26%] hidden h-20 w-20 rotate-[-18deg] lg:block" />
              <div className="absolute right-[6%] top-[44%] hidden text-6xl font-black leading-none text-[var(--sun-yellow)] drop-shadow-[0_5px_0_rgba(255,255,255,0.35)] lg:block">★</div>
              <div className="absolute right-[15%] top-[33%] hidden text-4xl font-black leading-none text-[var(--sun-yellow)] drop-shadow-[0_4px_0_rgba(255,255,255,0.35)] lg:block">★</div>
              <div className="absolute left-[35%] top-[40%] hidden -rotate-12 text-5xl font-black leading-none text-white/85 lg:block">✈</div>
              <div
                className={`absolute bottom-0 right-0 h-[42%] w-[92%] rounded-tl-[68%] sm:h-[50%] sm:w-[82%] lg:h-[56%] lg:w-[72%] ${slide.decorClass}`}
              />
              <div className="cloud-bank absolute inset-x-0 bottom-0 z-10 h-32 opacity-95 sm:h-40 lg:h-44" />
              <img src="/assets/toy-bear.svg" alt="" aria-hidden="true" className="absolute left-[8%] top-[22%] hidden w-24 rotate-[-8deg] opacity-95 lg:block" />
              <img src="/assets/kite.svg" alt="" aria-hidden="true" className="absolute right-[10%] top-[9%] hidden w-24 rotate-12 opacity-75 lg:block" />
              <img src="/assets/blocks.svg" alt="" aria-hidden="true" className="absolute bottom-10 left-[8%] z-20 hidden w-36 opacity-95 lg:block" />

              <div className="relative mx-auto grid min-h-[max(100svh,760px)] max-w-7xl grid-rows-[auto_1fr] items-start gap-5 px-5 pb-24 pt-28 sm:min-h-[max(100svh,880px)] sm:gap-8 sm:px-10 sm:pb-28 sm:pt-32 lg:min-h-screen lg:grid-cols-[0.44fr_0.56fr] lg:grid-rows-1 lg:items-center lg:px-8 lg:py-24">
                <motion.div
                  initial={false}
                  animate={{
                    opacity: activeSlide === index ? 1 : 0.35,
                    x: activeSlide === index ? 0 : -24,
                  }}
                  transition={{ duration: 0.9, delay: activeSlide === index ? 0.18 : 0 }}
                  className="relative z-20 mx-auto w-full max-w-xl text-center lg:mx-0 lg:text-left"
                >
                  <div className="hero-sign px-5 py-6 sm:px-9 sm:py-9">
                    <p className="mb-3 font-serif text-lg italic text-[var(--sun-coral-strong)] drop-shadow-[0_2px_0_rgba(255,255,255,0.75)] sm:mb-4 sm:text-xl">
                      {slide.eyebrow}
                    </p>
                    <h1 className="text-[2.15rem] font-black leading-[1.02] text-[var(--sun-ink)] drop-shadow-[0_3px_0_rgba(255,255,255,0.75)] sm:text-5xl lg:text-6xl">
                      {slide.title}
                      <span className={`block ${slide.accentColor}`}>{slide.accent}</span>
                    </h1>
                    <p className="mx-auto mt-4 max-w-md text-sm font-bold leading-6 text-slate-700 drop-shadow-[0_1px_0_rgba(255,255,255,0.85)] sm:mt-5 sm:text-base sm:leading-7 lg:mx-0">
                      {slide.description}
                    </p>
                    <a
                      href={slide.ctaHref || "/products"}
                      className={`relative z-10 mt-5 inline-flex w-full justify-center rounded-full px-7 py-3.5 text-sm font-black text-white shadow-xl transition hover:-translate-y-1 sm:mt-6 sm:w-auto ${slide.ctaColor}`}
                    >
                      {slide.cta}
                    </a>
                  </div>
                </motion.div>

                <motion.div
                  initial={false}
                  animate={{
                    opacity: activeSlide === index ? 1 : 0.45,
                    scale: activeSlide === index ? 1 : 0.9,
                    x: activeSlide === index ? 0 : 54,
                  }}
                  transition={{ duration: 1, delay: activeSlide === index ? 0.22 : 0 }}
                  className={`relative z-20 flex min-h-0 items-center justify-center self-stretch pb-8 sm:pb-12 lg:self-center lg:pb-0 ${slide.toySide === "center" ? "lg:justify-center" : "lg:justify-end"}`}
                >
                  <div className="absolute bottom-2 left-1/2 h-20 w-[68%] -translate-x-1/2 rounded-[50%] bg-slate-900/14 blur-2xl" />
                  <motion.img
                    src={slide.image}
                    alt={slide.alt}
                    animate={{ y: reduce ? 0 : [0, -16, 0] }}
                    transition={{ duration: 4.2, repeat: reduce ? 0 : Infinity, ease: "easeInOut" }}
                    className={[
                      "relative drop-shadow-[0_34px_30px_rgba(40,141,176,0.23)]",
                      slide.customBanner
                        ? "h-[15rem] w-full max-w-[780px] rounded-[22px] object-cover sm:h-[24rem] sm:rounded-[28px] lg:h-[30rem]"
                        : `${slide.imageClass ?? "w-full max-w-[780px]"} hero-product-cutout h-[clamp(13rem,27svh,18rem)] object-contain sm:h-[clamp(20rem,34svh,28rem)] lg:h-auto`,
                    ].join(" ")}
                  />
                </motion.div>
              </div>
            </motion.article>
          ))}
        </div>

        <button
          type="button"
          aria-label="Previous banner"
          onClick={() => goToSlide(activeSlide - 1)}
          className="absolute bottom-5 left-5 z-30 grid size-10 place-items-center rounded-full bg-white/35 text-3xl font-light text-white shadow-lg backdrop-blur-sm transition hover:bg-white/50 sm:bottom-auto sm:left-0 sm:top-1/2 sm:h-16 sm:w-10 sm:-translate-y-1/2 sm:rounded-none"
        >
          ‹
        </button>
        <button
          type="button"
          aria-label="Next banner"
          onClick={() => goToSlide(activeSlide + 1)}
          className="absolute bottom-5 right-5 z-30 grid size-10 place-items-center rounded-full bg-white/35 text-3xl font-light text-white shadow-lg backdrop-blur-sm transition hover:bg-white/50 sm:bottom-auto sm:right-0 sm:top-1/2 sm:h-16 sm:w-10 sm:-translate-y-1/2 sm:rounded-none"
        >
          ›
        </button>

        <div className="absolute bottom-8 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2.5" aria-label="Hero banner slides">
          {slides.map((item, index) => (
            <button
              key={item.accent}
              type="button"
              aria-label={`Show banner ${index + 1}`}
              aria-current={activeSlide === index}
              onClick={() => goToSlide(index)}
              className={`h-3 rounded-full border-2 border-white transition-all ${
                activeSlide === index ? "w-7 bg-white" : "w-3 bg-transparent hover:bg-white/70"
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
    <section id="about" className="relative scroll-mt-24 overflow-hidden bg-white py-14 lg:py-16">
      <img src="/assets/kite.svg" alt="" aria-hidden="true" className="absolute left-4 top-20 hidden w-32 -rotate-12 opacity-80 lg:block" />
      <motion.p {...fadeUp()} className="relative mx-auto mb-6 w-fit rounded-full bg-[var(--sun-sky-soft)] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[var(--sun-sky-dark)]">
        About Us
      </motion.p>
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-2">
        <motion.div {...fadeUp()} className="relative mx-auto w-full max-w-[600px]">
          <div className="absolute -left-8 top-12 h-44 w-44 rounded-full bg-[var(--sun-sky-soft)]" />
          <div className="absolute -right-5 -top-5 h-28 w-28 rounded-full bg-[var(--sun-yellow-soft)]" />
          <div className="paper-shadow relative overflow-hidden rounded-[34px] border-[14px] border-white bg-[var(--sun-coral-soft)] p-6">
            <img
              src="/assets/catalog/playroom-tables.jpg"
              alt="Colorful indoor playroom table and chair setup from the Ankush Playways catalog"
              className="mx-auto h-80 w-full rounded-[20px] object-cover sm:h-[23rem]"
            />
          </div>
        </motion.div>

        <motion.div {...fadeUp(0.08)}>
          <h2 className="text-4xl font-black leading-tight text-[var(--sun-sky-dark)] sm:text-5xl">
            Creating Happy <span className="text-[var(--sun-coral-strong)]">Spaces for Little Learners</span>
          </h2>
          <div className="mt-5 h-1.5 w-24 rounded-full bg-gradient-to-r from-[var(--sun-coral)] via-[var(--sun-yellow)] to-[var(--sun-mint)]" />
          <div className="mt-8 border-l-4 border-[var(--sun-line)] pl-7 text-base font-medium leading-8 text-slate-700">
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

function OutdoorPlaygroundFeature() {
  const reduceMotion = useReducedMotion();
  const outdoorProductsHref = `/products?category=${encodeURIComponent("Outdoor Playground Equipment")}`;

  return (
    <section className="relative overflow-hidden bg-[var(--sun-mint-soft)] px-5 py-10 sm:px-8 lg:py-14">
      <div className="absolute -left-24 top-16 size-72 rounded-full bg-[var(--sun-yellow)]/25 blur-3xl" />
      <div className="absolute -right-24 bottom-8 size-80 rounded-full bg-[var(--sun-sky)]/25 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.08fr_0.92fr]">
        <motion.div {...fadeUp()} className="relative">
          <div className="absolute -inset-3 rotate-[-1.5deg] rounded-[36px] bg-[var(--sun-yellow)]/45" />
          <Link
            href={outdoorProductsHref}
            aria-label="View outdoor playground products"
            className="group relative block overflow-hidden rounded-[30px] border-[8px] border-white bg-slate-900 shadow-[0_28px_80px_rgba(40,141,176,0.28)]"
          >
            <video
              src="/uploads/banners/ankush-outdoor-playground.mp4"
              aria-hidden="true"
              autoPlay={!reduceMotion}
              className="aspect-video w-full object-cover transition duration-700 group-hover:scale-[1.025]"
              loop
              muted
              playsInline
              preload="metadata"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--sun-ink)]/55 via-transparent to-transparent" />
            <span className="absolute bottom-5 left-5 inline-flex items-center gap-2 rounded-full bg-white/95 px-5 py-3 text-sm font-black text-[var(--sun-sky-dark)] shadow-lg transition group-hover:-translate-y-1 sm:bottom-7 sm:left-7">
              Explore our outdoor products <span aria-hidden="true">→</span>
            </span>
          </Link>
        </motion.div>

        <motion.div {...fadeUp(0.1)}>
          <h2 className="text-[1.875rem] font-black leading-tight text-[var(--sun-sky-dark)] sm:text-5xl">
            <span className="block whitespace-nowrap">Turn open spaces into</span>
            <span className="block">joyful playgrounds</span>
          </h2>
          <p className="mt-6 text-base font-semibold leading-8 text-slate-700">
            Discover colourful multiplay stations designed for schools, parks, housing societies, resorts, and play zones. Our outdoor range brings climbing, sliding, and active play together in one inviting space.
          </p>

          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {["Bright, engaging designs", "Built for active play", "Multiple station options", "Ideal for large spaces"].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-2xl bg-white/80 px-4 py-3 text-sm font-bold text-[var(--sun-ink)] shadow-sm">
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[var(--sun-mint-strong)] text-xs text-white" aria-hidden="true">✓</span>
                {item}
              </div>
            ))}
          </div>

        </motion.div>
      </div>
    </section>
  );
}

function ProductCategories({ categories }: { categories: Category[] }) {
  const catalogueCategories = categories.filter((category) => category.name !== "Role Play Costumes");

  if (catalogueCategories.length === 0) {
    return null;
  }

  return (
    <section id="products" className="scroll-mt-24 bg-white pb-16 pt-12">
      <SectionHeading
        eyebrow="Browse by range"
        title="All Catalogue"
        accent="Categories"
        description="Discover every Ankush Playways catalogue range, grouped for schools, play zones, preschools, and family spaces."
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

function normalCode(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function RockerRange({ products }: { products: Product[] }) {
  const findProduct = (code: string) => products.find((product) => normalCode(product.code) === normalCode(code) || product.slug.startsWith(`${code}-`));
  const rockerRange = [
    {
      product: findProduct("ap-624"),
      label: "Riders",
      image: "/assets/catalog/cutouts/pony-rocking-rideon.png",
      accent: "bg-[var(--sun-yellow)]",
      badge: "bg-[var(--sun-sky)]",
    },
    {
      product: findProduct("ap-108b"),
      label: "Rock & Riders",
      image: "/assets/catalog/cutouts/crab-see-saw.png",
      accent: "bg-[var(--sun-mint)]",
      badge: "bg-[var(--sun-coral)]",
    },
    {
      product: findProduct("ap-925c"),
      label: "Rockers",
      image: "/assets/catalog/cutouts/elephant-rocker.png",
      accent: "bg-[var(--sun-coral)]",
      badge: "bg-[var(--sun-yellow)]",
    },
  ];

  if (!rockerRange.some((item) => item.product)) {
    return null;
  }

  return (
    <section className="relative overflow-hidden bg-white py-16">
      <div className="absolute inset-x-0 bottom-0 h-24 bg-white [background-image:radial-gradient(circle_at_24px_24px,rgba(126,202,225,0.16)_0_2px,transparent_3px)] [background-size:72px_72px]" />
      <div className="relative mx-auto max-w-7xl px-5 text-center sm:px-8">
        <h2 className="text-4xl font-black leading-tight text-[var(--sun-sky-dark)] sm:text-5xl">
          Find the <span className="text-[var(--sun-coral-strong)]">Rockers Range</span>
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
                  <span className={`absolute right-7 top-6 z-10 grid size-16 place-items-center rounded-full ${badge} text-3xl font-black text-white shadow-xl shadow-[#7ecae1]/20`}>
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
                    className="inline-flex rounded-full bg-[var(--sun-sky)] px-5 py-3 text-sm font-black text-white shadow-lg shadow-[#7ecae1]/20 transition hover:-translate-y-1 hover:bg-[var(--sun-sky-dark)]"
                  >
                    View Details
                  </Link>
                  <a
                    href={getWhatsAppUrl(product)}
                    className="inline-flex rounded-full bg-[var(--sun-mint-strong)] px-5 py-3 text-sm font-black text-white shadow-lg shadow-[#a6e5cd]/40 transition hover:-translate-y-1 hover:bg-[var(--sun-sky-dark)]"
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

function PopularProducts({ featuredProducts }: { featuredProducts: Product[] }) {
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
    <section className="bg-[var(--sun-sky-soft)] py-16">
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
          className="absolute left-2 top-1/2 z-20 hidden size-11 -translate-y-1/2 place-items-center rounded-full bg-white text-2xl font-black text-[var(--sun-ink)] shadow-xl shadow-[#7ecae1]/20 transition hover:-translate-x-0.5 hover:bg-[var(--sun-sky-soft)] lg:grid"
        >
          ‹
        </button>
        <div
          ref={sliderRef}
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.slug}
              {...fadeUp(index * 0.04)}
              className="flex w-[78vw] shrink-0 snap-start sm:w-[42vw] lg:w-[22vw] 2xl:w-[18vw]"
            >
              <FeaturedProductCard product={product} index={index} />
            </motion.div>
          ))}
        </div>
        <button
          type="button"
          aria-label="Next featured products"
          onClick={() => scrollProducts("right")}
          className="absolute right-2 top-1/2 z-20 hidden size-11 -translate-y-1/2 place-items-center rounded-full bg-white text-2xl font-black text-[var(--sun-ink)] shadow-xl shadow-[#7ecae1]/20 transition hover:translate-x-0.5 hover:bg-[var(--sun-sky-soft)] lg:grid"
        >
          ›
        </button>
      </div>
    </section>
  );
}

function FeaturedProductCard({ product, index }: { product: Product; index: number }) {
  const theme = featuredThemes[index % featuredThemes.length];

  return (
    <Link
      href={`/products/${product.slug}`}
      className={`group flex h-full w-full flex-col overflow-hidden rounded-[18px] border-[5px] ${theme.frame} bg-white shadow-xl shadow-[#7ecae1]/20 transition-shadow hover:shadow-2xl hover:shadow-[#7ecae1]/25 focus:outline-none focus:ring-4 focus:ring-[var(--sun-yellow-soft)]`}
    >
      <div className={`relative grid aspect-[1.08] place-items-center overflow-hidden ${theme.image} p-5`}>
        <div className="absolute -right-10 -top-12 size-32 rounded-full bg-white/55" />
        <div className="absolute -bottom-14 -left-12 size-36 rounded-full bg-white/45" />
        <span className={`absolute left-4 top-4 z-10 rounded-full ${theme.badge} px-3 py-1 text-xs font-black text-white shadow-sm`}>
          {product.code}
        </span>
        <img
          src={product.images[0]?.src}
          alt={product.images[0]?.alt ?? product.name}
          className="relative z-10 h-full max-h-64 w-full object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </div>
      <div className={`flex min-h-32 flex-1 flex-col p-5 text-white ${theme.footer}`}>
        <p className="text-xs font-black uppercase tracking-wide text-white/75">{product.category}</p>
        <h3 className="mt-2 line-clamp-2 text-xl font-black leading-tight text-white">{product.name}</h3>
        <span className="mt-auto inline-flex w-fit rounded-full bg-white/95 px-4 py-2 text-xs font-black text-[var(--sun-ink)] shadow-sm">
          View Details
        </span>
      </div>
    </Link>
  );
}

function RolePlayCostumes({ products }: { products: Product[] }) {
  const rolePlayHighlights = products.filter((product) => product.category === "Role Play Costumes").slice(0, 4);

  if (rolePlayHighlights.length === 0) {
    return null;
  }

  return (
    <section className="sky-kid-pattern relative overflow-hidden py-16">
      <img src="/assets/blocks.svg" alt="" aria-hidden="true" className="absolute right-10 top-6 hidden w-28 rotate-6 opacity-90 lg:block" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mx-auto mb-8 max-w-3xl text-center">
          <h2 className="text-4xl font-black leading-tight text-[var(--sun-sky-dark)] sm:text-5xl">
            Role Play <span className="text-[var(--sun-coral-strong)]">Costumes</span>
          </h2>
          <div className="mx-auto mt-4 h-1.5 w-24 rounded-full bg-gradient-to-r from-[var(--sun-coral)] via-[var(--sun-yellow)] to-[var(--sun-mint)]" />
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {rolePlayHighlights.map((product, index) => {
            const name = product.name.replace("Fireghter", "Firefighter");

            return (
              <motion.article key={product.slug} {...fadeUp(index * 0.05)} className="group">
                <Link
                  href={`/products/${product.slug}`}
                  className={`relative block h-full min-h-[360px] overflow-hidden rounded-[10px] ${rolePlayAccents[index % rolePlayAccents.length]} p-5 text-white shadow-xl shadow-[#fd9aa0]/25 transition hover:-translate-y-1 hover:shadow-2xl`}
                >
                  <h3 className="relative z-20 text-2xl font-black leading-tight">{name}</h3>
                  <div className="absolute bottom-0 left-0 right-0 h-[72%] bg-[var(--sun-yellow-pale)] [clip-path:polygon(0_12%,100%_0,100%_100%,0_100%)]" />
                  <div className="absolute right-0 top-[22%] h-20 w-20 rounded-bl-full bg-[var(--sun-sky-dark)]" />
                  <div className="absolute bottom-6 left-0 h-44 w-14 rounded-r-full bg-[var(--sun-yellow-soft)]" />
                  <img
                    src={product.images[0]?.src}
                    alt={product.images[0]?.alt ?? product.name}
                    className="absolute bottom-14 left-1/2 z-10 h-[62%] w-[82%] -translate-x-1/2 object-contain mix-blend-multiply transition duration-300 group-hover:scale-105"
                  />
                  <span className="absolute bottom-9 left-7 z-20 inline-flex rounded-full bg-white px-5 py-3 text-sm font-black text-[var(--sun-ink)] shadow-lg">
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
            className="inline-flex rounded-full bg-[var(--sun-sky)] px-7 py-3.5 text-sm font-black text-white shadow-lg shadow-[#7ecae1]/20 transition hover:-translate-y-1 hover:bg-[var(--sun-sky-dark)]"
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
      <div className="mx-auto grid max-w-7xl items-center gap-8 overflow-hidden rounded-[34px] bg-[var(--sun-sky-dark)] p-8 text-white shadow-2xl shadow-[#7ecae1]/20 sm:p-10 lg:grid-cols-[1fr_auto]">
        <div>
          <h2 className="text-3xl font-black leading-tight sm:text-5xl">Explore every product from the 2026 catalogue</h2>
          <p className="mt-4 max-w-2xl text-sm font-semibold leading-7 text-white/90">
            Search by product code, filter by category, compare MRP, and enquire instantly on WhatsApp.
          </p>
        </div>
        <Link
          href="/products"
          className="inline-flex justify-center rounded-full bg-white px-7 py-4 text-sm font-black text-[var(--sun-ink)] shadow-xl transition hover:-translate-y-1 hover:bg-[var(--sun-yellow-soft)]"
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
            className="rounded-[28px] bg-white p-7 shadow-xl shadow-[#fd9aa0]/25"
          >
            <div className="mb-6 grid size-16 place-items-center rounded-3xl text-2xl font-black text-white" style={{ backgroundColor: color }}>
              {index + 1}
            </div>
            <h3 className="text-2xl font-black text-[var(--sun-ink)]">{title}</h3>
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
    <section className="relative overflow-hidden bg-[var(--sun-coral)] py-16">
      <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.22)_0_24%,transparent_24%_100%)]" />
      <div className="absolute bottom-0 left-0 h-44 w-[42rem] rounded-tr-[80%] bg-white/20" />
      <div className="absolute bottom-0 right-0 h-60 w-[50rem] rounded-tl-[80%] bg-[var(--sun-yellow)]/45" />
      <img src="/assets/toy-duck.svg" alt="" aria-hidden="true" className="absolute right-[8%] top-10 hidden w-24 -rotate-12 opacity-90 lg:block" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2">
        <motion.div {...fadeUp()} className="relative order-2 lg:order-1">
          <div className="absolute bottom-0 left-1/2 h-20 w-[70%] -translate-x-1/2 rounded-[50%] bg-slate-950/20 blur-2xl" />
          <img
            src="/assets/catalog/cutouts/play-structure.png"
            alt="Indoor play structure from the Ankush Playways catalog"
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
  const sliderRef = useRef<HTMLDivElement>(null);

  const scrollTestimonials = (direction: "left" | "right") => {
    const slider = sliderRef.current;

    if (!slider) {
      return;
    }

    slider.scrollBy({
      left: direction === "left" ? -slider.clientWidth * 0.86 : slider.clientWidth * 0.86,
      behavior: "smooth",
    });
  };

  return (
    <section id="testimonials" className="kid-pattern relative overflow-hidden pb-28 pt-16">
      <img src="/assets/toy-bear.svg" alt="" aria-hidden="true" className="absolute right-10 top-10 hidden w-24 rotate-6 opacity-80 lg:block" />
      <img
        src="/assets/toy-tricycle.svg"
        alt=""
        aria-hidden="true"
        className="absolute left-10 bottom-10 hidden w-24 -rotate-12 rounded-full object-contain opacity-90 mix-blend-multiply lg:block"
      />

      <div className="relative">
        <SectionTitle eyebrow="Testimonial" title="Happy" accent="Clients" />
      </div>
      <div className="relative mx-auto max-w-7xl px-5 sm:px-16">
        <button
          type="button"
          aria-label="Previous client reviews"
          onClick={() => scrollTestimonials("left")}
          className="absolute left-1 top-1/2 z-20 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white text-2xl font-black text-[var(--sun-ink)] shadow-xl shadow-[#7ecae1]/25 transition hover:-translate-x-0.5 hover:bg-[var(--sun-sky-soft)] sm:left-3"
        >
          ‹
        </button>
        <div
          ref={sliderRef}
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-1 pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {testimonials.map((item, index) => (
            <motion.article
              key={item.name}
              {...fadeUp(index * 0.06)}
              className={`${item.tint} relative w-[82vw] shrink-0 snap-start overflow-hidden rounded-[24px] border border-white bg-white p-7 shadow-xl shadow-[#7ecae1]/20 sm:w-[calc(50%_-_12px)] lg:w-[calc(33.333%_-_16px)]`}
            >
              <div className="absolute -right-8 -top-8 size-24 rounded-full bg-white/50" />
              <div className={`mb-6 grid size-14 place-items-center rounded-2xl text-3xl font-black text-white ${
                index % 3 === 0 ? "bg-[var(--sun-coral)]" : index % 3 === 1 ? "bg-[var(--sun-sky)]" : "bg-[var(--sun-yellow)]"
              }`}>
                “
              </div>
              <p className="relative z-10 min-h-32 text-base font-bold leading-7 text-slate-700">"{item.quote}"</p>
              <div className="mt-6 flex items-center justify-between gap-4">
                <h3 className="text-lg font-black text-[var(--sun-ink)]">{item.name}</h3>
                <div className="flex gap-1 text-lg text-[var(--sun-yellow)]" aria-hidden="true">
                  <span>★</span>
                  <span>★</span>
                  <span>★</span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
        <button
          type="button"
          aria-label="Next client reviews"
          onClick={() => scrollTestimonials("right")}
          className="absolute right-1 top-1/2 z-20 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white text-2xl font-black text-[var(--sun-ink)] shadow-xl shadow-[#7ecae1]/25 transition hover:translate-x-0.5 hover:bg-[var(--sun-sky-soft)] sm:right-3"
        >
          ›
        </button>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="contact" className="relative -mt-24 overflow-hidden pt-0">
      <div className="wave-footer bg-[var(--sun-sky)] px-5 pb-10 pt-20 text-white sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-3">
          <div>
            <h3 className="text-3xl font-black">We Promise</h3>
            <p className="mt-6 max-w-md text-sm font-medium leading-8 text-white/90">
              We never compromise on the quality of our toy range and work to deliver durable, colourful, child-friendly products on time.
            </p>
          </div>
          <div>
            <h3 className="text-3xl font-black">Useful Links</h3>
            <div className="mt-6 grid gap-3 text-sm font-bold text-white/90">
              {navItems.slice(1).map(([label, href]) => (
                <a key={label} href={href} className="transition hover:text-[var(--sun-yellow-soft)]">
                  {label}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-black">Contact Us</h3>
            <div className="mt-6 grid gap-4 text-sm font-semibold leading-7 text-white/90">
              <p>Phone: 99150 00770</p>
              <p>Email: ankushplayways@gmail.com</p>
              <p>Address: E-110, Phase-7, Industrial Area, Mohali, Punjab, 160059, India</p>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-12 max-w-7xl border-t border-[#7ecae1]/40 pt-7 text-center text-sm font-semibold text-white/90">
          &copy; 2026 Ankush Playways. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}

function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/919915000770"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-5 z-50 grid size-16 place-items-center rounded-2xl bg-[#25d366] text-white shadow-2xl shadow-[#a6e5cd]/50 transition hover:-translate-y-1"
    >
      <svg viewBox="0 0 32 32" aria-hidden="true" className="size-9 fill-current">
        <path d="M16.04 3.2A12.68 12.68 0 0 0 5.18 22.4L3.6 28.8l6.55-1.52A12.72 12.72 0 1 0 16.04 3.2Zm0 2.42a10.3 10.3 0 0 1 8.7 15.82 10.34 10.34 0 0 1-12.94 3.6l-.45-.23-3.9.9.93-3.78-.28-.48a10.26 10.26 0 0 1 7.94-15.83Zm-4.5 5.47c-.22 0-.58.08-.88.42-.3.33-1.16 1.13-1.16 2.76s1.19 3.2 1.36 3.43c.17.22 2.3 3.68 5.67 5.02 2.8 1.1 3.37.88 3.98.82.6-.06 1.96-.8 2.24-1.57.27-.77.27-1.43.19-1.57-.08-.14-.3-.22-.63-.39-.33-.16-1.96-.96-2.26-1.07-.3-.11-.52-.16-.74.17-.22.33-.85 1.07-1.04 1.29-.2.22-.39.25-.72.08-.33-.16-1.4-.52-2.67-1.65-.99-.88-1.65-1.97-1.84-2.3-.2-.33-.02-.51.15-.67.15-.15.33-.39.5-.58.16-.2.22-.33.33-.55.11-.22.06-.41-.03-.58-.08-.16-.74-1.78-1.02-2.44-.27-.64-.54-.55-.74-.56h-.66Z" />
      </svg>
    </a>
  );
}

interface LandingPageProps {
  bannerCtaHrefs?: string[];
  bannerImageSrcs?: string[];
  categories: Category[];
  featuredProducts?: Product[];
  products: Product[];
}

export default function LandingPage({ bannerCtaHrefs, bannerImageSrcs, categories, featuredProducts = [], products }: LandingPageProps) {
  const homepageFeaturedProducts = featuredProducts.length ? featuredProducts : products.slice(0, 8);

  return (
    <main>
      <SiteHeader overlayUntilScroll />
      <FloatingDecor />
      <Hero bannerCtaHrefs={bannerCtaHrefs} bannerImageSrcs={bannerImageSrcs} />
      <About />
      <ProductCategories categories={categories} />
      <RockerRange products={products} />
      <OutdoorPlaygroundFeature />
      <PopularProducts featuredProducts={homepageFeaturedProducts} />
      <RolePlayCostumes products={products} />
      <Offer />
      <Promo />
      <Testimonials />
      <SiteFooter />
      <FloatingWhatsAppButton floating />
    </main>
  );
}
