"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Clock } from "lucide-react";
import MenuSlider from "@/components/MenuSlider";
import CustomSelect from "@/components/CustomSelect";
import CustomDatePicker from "@/components/CustomDatePicker";
import { menuSections } from "@/app/menu/data";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Page() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Top-down plate images for the infinite footer slider
  const plates = [
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800",
    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800",
    "https://images.unsplash.com/photo-1574484284002-952d92456975?q=80&w=800",
    "https://images.unsplash.com/photo-1481931098730-318b6f776db0?q=80&w=800",
  ];

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Initial Load Sequence: Sophisticated Blur & Skew Reveal
      gsap.fromTo(
        ".hero-layer .hero-animate",
        { opacity: 0, y: 40, filter: "blur(15px)", skewY: 5 },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          skewY: 0,
          duration: 1.8,
          stagger: 0.15,
          ease: "expo.out",
        },
      );

      // 1000vh scroll container for longer reading time
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.5,
        },
      });

      // ============================================
      // ACT 1: THE SHUTTER EXPANSION (0 - 20)
      // ============================================
      tl.to(
        ".hero-layer",
        {
          clipPath: "inset(0% 50% 0% 50%)",
          opacity: 0,
          duration: 15,
          ease: "power4.inOut",
        },
        5,
      ).to(
        ".hero-bg",
        {
          scale: 1.2,
          opacity: 0,
          duration: 20,
          ease: "power2.inOut",
        },
        0,
      );

      // ============================================
      // ACT 2: THE PITCH MORPH
      // ============================================
      tl.set(".pitch-layer", { display: "flex" }, 18);

      tl.fromTo(
        ".pitch-problem",
        { opacity: 0, y: 60, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 5 },
        18,
      ).to(
        ".pitch-problem",
        { opacity: 0, filter: "blur(20px)", scale: 1.05, duration: 5 },
        36,
      );

      tl.fromTo(
        ".pitch-image",
        { opacity: 0, scale: 1.1, filter: "grayscale(100%)" },
        {
          opacity: 1,
          scale: 1,
          filter: "grayscale(0%)",
          duration: 15,
          ease: "power1.inOut",
        },
        20,
      ).fromTo(
        "#morph-distort-scale",
        { attr: { scale: 80 } },
        {
          attr: { scale: 0 },
          duration: 5,
          yoyo: true,
          repeat: 1,
          ease: "power2.inOut",
        },
        30,
      );

      // Parallax Grid Reveal (Delayed to allow reading time)
      tl.fromTo(".sol-header", { opacity: 0 }, { opacity: 1, duration: 4 }, 40)
        .fromTo(
          ".sol-col-1",
          { opacity: 0, y: 100 },
          { opacity: 1, y: 0, duration: 6, ease: "power3.out" },
          40,
        )
        .fromTo(
          ".sol-col-2",
          { opacity: 0, y: 150 },
          { opacity: 1, y: 0, duration: 6, ease: "power3.out" },
          41,
        )
        .fromTo(
          ".sol-col-3",
          { opacity: 0, y: 200 },
          { opacity: 1, y: 0, duration: 6, ease: "power3.out" },
          42,
        );

      // ============================================
      // ACT 3: THE STRUCTURED GALLERY
      // ============================================
      tl.to(
        [
          ".sol-col-1",
          ".sol-col-2",
          ".sol-col-3",
          ".sol-header",
          ".pitch-image",
        ],
        { opacity: 0, y: -50, stagger: 0.1, duration: 4 },
        52,
      );

      tl.set(".gallery-layer", { display: "flex" }, 55);
      tl.fromTo(
        ".gallery-label-top",
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 4 },
        56,
      );

      tl.fromTo(
        ".gallery-item-1",
        { opacity: 0, scale: 0.95, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 10, ease: "power2.out" },
        56,
      )
        .fromTo(
          ".gallery-item-2",
          { opacity: 0, scale: 0.95, y: 30 },
          { opacity: 1, scale: 1, y: 0, duration: 10, ease: "power2.out" },
          58,
        )
        .fromTo(
          ".gallery-item-3",
          { opacity: 0, scale: 0.95, y: 30 },
          { opacity: 1, scale: 1, y: 0, duration: 10, ease: "power2.out" },
          60,
        );

      tl.to(
        ".gallery-layer",
        { opacity: 0, scale: 1.05, duration: 6, ease: "power2.in" },
        70,
      );

      // ============================================
      // ACT 4: THE IMPLOSION FORM
      // ============================================
      // Suspenseful build up
      tl.to(
        ".world-container",
        {
          scale: 0.85,
          rotateX: -15,
          opacity: 0,
          filter: "blur(20px) brightness(0.2)",
          duration: 8,
          ease: "power4.inOut",
        },
        76,
      );

      tl.set(".world-container", { pointerEvents: "none" }, 76);

      // Form rises dynamically with character
      tl.fromTo(
        ".cta-form-container",
        { scale: 0.8, opacity: 0, y: 150, rotateX: 15 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 8,
          ease: "back.out(1.4)",
        },
        80,
      );

      // Stagger animate form elements for character
      tl.fromTo(
        ".cta-form-element",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 4,
          stagger: 0.5,
          ease: "power2.out",
          clearProps: "all",
        },
        84,
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <main className="relative bg-[#161513] text-[#252422]">
      {/* SVG Filters */}
      <svg
        className="fixed w-0 h-0 pointer-events-none"
        style={{ visibility: "hidden" }}
      >
        <defs>
          <filter id="hero-distort">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.015"
              numOctaves="3"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="0"
              xChannelSelector="R"
              yChannelSelector="G"
              id="hero-distort-scale"
            />
          </filter>
          <filter id="morph-distort">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.02"
              numOctaves="2"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="0"
              xChannelSelector="R"
              yChannelSelector="G"
              id="morph-distort-scale"
            />
          </filter>
        </defs>
      </svg>

      {/* =======================
          1000VH TIMELINE SECTION
          ======================= */}
      <div
        ref={containerRef}
        className="relative h-[1000vh] w-full bg-[#161513]"
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden perspective-[1000px] bg-[#EBE6DF]">
          {/* WORLD CONTAINER */}
          <div className="absolute inset-0 world-container bg-[#EBE6DF] origin-center z-10 w-full h-full object-cover">
            {/* ACT 1: THE DEEP FRAME */}
            <div
              className="absolute inset-0 hero-layer flex items-center justify-center overflow-hidden z-10"
              style={{ clipPath: "inset(0% 0% 0% 0%)" }}
            >
              <div className="absolute inset-0 opacity-20 hero-bg">
                <Image
                  src="https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=2500"
                  alt="Flour texture"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="relative z-10 text-center flex flex-col items-center justify-center w-full px-8 leading-[0.9] tracking-tighter uppercase mt-20 md:mt-0">
                <div className="hero-animate font-mono text-sm md:text-base tracking-widest uppercase mb-8 border border-[#252422] px-6 py-2 bg-[#EBE6DF] text-[#161513] shadow-[4px_4px_0_0_#9F4F3B]">
                  The Daily Knead
                </div>
                <h1 className="hero-animate font-sans font-black text-[10vw] whitespace-nowrap text-[#161513]">
                  Bred for
                </h1>
                <h1 className="hero-animate font-serif italic font-semibold text-[14vw] whitespace-nowrap text-[#9F4F3B]">
                  Obsession.
                </h1>
              </div>
            </div>

            {/* ACT 2 & 3: PITCH MORPH & PORTAL */}
            <div className="absolute inset-0 pitch-layer hidden z-20">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div
                  className="relative w-[50vw] h-[60vh] pitch-image will-change-transform"
                  style={{ filter: "url(#morph-distort)" }}
                >
                  <Image
                    src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2000"
                    alt="Feature Feast"
                    fill
                    className="object-cover rounded-none"
                    unoptimized
                  />
                </div>
              </div>

              <div className="absolute inset-0 flex items-center justify-center pitch-problem pointer-events-none mix-blend-multiply">
                <h2 className="font-sans font-bold text-[6vw] uppercase text-center max-w-[80vw] leading-none text-[#252422]">
                  Tired of pretentious
                  <br />
                  tiny portions.
                </h2>
              </div>

              <div className="absolute inset-0 p-12 pitch-solution pointer-events-none flex flex-col justify-between pt-24">
                <div className="w-full flex justify-between uppercase font-mono text-xs tracking-widest border-b border-[#252422]/20 pb-4 sol-header bg-[#EBE6DF]/80">
                  <span>The Daily Knead</span>
                  <span>Declaration of Intent</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full border-t border-[#252422]/20 pt-8 mt-auto bg-[#EBE6DF]/90 z-10">
                  <div className="sol-col-1">
                    <h3 className="font-bold font-sans text-xl mb-4 uppercase">
                      1 / Massive Plates
                    </h3>
                    <p className="font-serif text-lg leading-relaxed mix-blend-multiply">
                      We serve food meant to be eaten, not stared at through a
                      magnifying glass. Real appetites only.
                    </p>
                  </div>
                  <div className="sol-col-2">
                    <h3 className="font-bold font-sans text-xl mb-4 uppercase">
                      2 / Butter-Heavy
                    </h3>
                    <p className="font-serif text-lg leading-relaxed mix-blend-multiply">
                      A commitment to the holy trinity of culinary satisfaction:
                      butter, salt, and heat.
                    </p>
                  </div>
                  <div className="sol-col-3">
                    <h3 className="font-bold font-sans text-xl mb-4 uppercase">
                      3 / Judgment-Free
                    </h3>
                    <p className="font-serif text-lg leading-relaxed mix-blend-multiply">
                      No dress code. No snobbery. Just aggressive hospitality
                      and uncompromising flavor.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ACT 3: STRUCTURED GALLERY */}
            <div className="absolute inset-0 gallery-layer hidden z-20 p-12 pt-24 flex flex-col justify-center bg-secondary">
              <div className="w-full flex justify-between uppercase font-mono text-xs tracking-widest border-b border-primary/20 pb-4 mb-8 gallery-label-top items-end">
                <span>Menu Overview</span>
                <Link
                  href="/menu"
                  className="btn btn-secondary btn-sm shadow-dark hover:shadow-none translate-y-0 active:translate-y-1 transition-all bg-[var(--bg-surface)]"
                >
                  Explore Menu
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 w-full h-[65vh]">
                {/* Large Image (Auto Slider) */}
                <div
                  className="col-span-1 md:col-span-7 relative h-full group overflow-hidden border border-primary gallery-item-1 bg-primary cursor-pointer"
                  onClick={() => (window.location.href = "/menu")}
                >
                  <MenuSlider />
                </div>
                {/* Two Stacked Images */}
                <div className="col-span-1 md:col-span-5 flex flex-col gap-8 h-full">
                  <div className="relative flex-1 group overflow-hidden border border-primary gallery-item-2 bg-primary">
                    <Image
                      src={menuSections[1].items[3].image}
                      alt={menuSections[1].items[3].name || "Menu item"}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-105"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700"></div>
                    <div className="absolute bottom-6 left-6 text-secondary font-sans z-10 drop-shadow-md">
                      <p className="font-mono text-[10px] tracking-widest uppercase mb-2 opacity-90">
                        {menuSections[1].title}
                      </p>
                      <h3 className="font-bold text-xl uppercase">
                        {menuSections[1].items[3].name}
                      </h3>
                    </div>
                  </div>
                  <div className="relative flex-1 group overflow-hidden border border-primary gallery-item-3 bg-primary">
                    <Image
                      src={menuSections[2].items[0].image}
                      alt={menuSections[2].items[0].name || "Menu item"}
                      fill
                      className="object-cover transition-all duration-1000 group-hover:scale-105"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors duration-700"></div>
                    <div className="absolute bottom-6 left-6 text-secondary font-sans z-10 drop-shadow-md">
                      <p className="font-mono text-[10px] tracking-widest uppercase mb-2 opacity-90">
                        {menuSections[2].title}
                      </p>
                      <h3 className="font-bold text-xl uppercase">
                        {menuSections[2].items[0].name}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ACT 4: THE IMPLOSION FORM */}
          {/* This sits immediately behind the world container, and is revealed as the world implodes using clip-path circle(0%) */}
          <div className="absolute inset-0 flex items-center justify-center z-0 bg-[#161513]">
            <div className="relative cta-form-container pointer-events-auto bg-[#EBE6DF] p-6 md:p-10 border border-[#484542] w-[95%] max-w-[800px] shadow-obsession-lg mx-auto overflow-visible">
              <h2 className="cta-form-element font-sans font-bold uppercase text-2xl md:text-3xl mb-8 border-b border-primary pb-4 flex justify-between items-end">
                <span>Secure a Table</span>
                <span className="font-mono text-xs tracking-widest hidden md:block opacity-60 text-right">
                  WE DON&apos;T DO SUBTLE
                  <br />
                  RESERVATIONS
                </span>
              </h2>

              <form
                className="flex flex-col gap-6"
                onSubmit={(e) => e.preventDefault()}
              >
                {/* 1. Human Details */}
                <div className="cta-form-element grid grid-cols-1 md:grid-cols-2 gap-8 mt-2">
                  <div className="flex flex-col relative group">
                    <label className="font-mono text-[10px] uppercase tracking-widest text-primary/60 absolute -top-5">
                      The Instigator (Name)
                    </label>
                    <input
                      type="text"
                      className="bg-transparent border-b border-primary py-2 font-serif text-xl focus:outline-none focus:border-obsession transition-colors rounded-none w-full"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="flex flex-col relative group">
                    <label className="font-mono text-[10px] uppercase tracking-widest text-primary/60 absolute -top-5">
                      Comms Line (Email / Phone)
                    </label>
                    <input
                      type="text"
                      className="bg-transparent border-b border-primary py-2 font-serif text-xl focus:outline-none focus:border-obsession transition-colors rounded-none w-full"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                {/* 2. Logistics */}
                <div className="cta-form-element grid grid-cols-1 md:grid-cols-3 gap-8 mt-2">
                  <CustomDatePicker
                    label="Date of Impact"
                    placeholder="DD / MM / YYYY"
                  />
                  <CustomSelect
                    label="Hour of Need"
                    icon={<Clock size={18} />}
                    options={[
                      "17:00 (Pre-War)",
                      "18:00 (Early Fire)",
                      "19:00 (Prime Chaos)",
                      "20:00 (Full Impact)",
                      "21:00 (Late Devour)",
                      "22:00 (The Aftermath)",
                    ]}
                    placeholder="--:--"
                  />
                  <CustomSelect
                    label="Body Count"
                    options={[
                      "2 Mouths",
                      "4 Mouths",
                      "6 Mouths",
                      "Full War Room (8+)",
                    ]}
                  />
                </div>

                {/* 3. Experiences */}
                <div className="cta-form-element grid grid-cols-1 md:grid-cols-2 gap-8 mt-2">
                  <CustomSelect
                    label="Dining Zone Restriction"
                    options={[
                      "The Chaos (Main Floor)",
                      "The Fire Pit (Counter)",
                      "The Shadows (Booth)",
                    ]}
                  />
                  <CustomSelect
                    label="Dietary Stance"
                    options={[
                      "Unrestricted (Carnivore)",
                      "Tactical (Omnivore)",
                      "Plant-Based (We'll Try)",
                    ]}
                  />
                </div>

                {/* 4. Memos */}
                <div className="cta-form-element flex flex-col relative group mt-2">
                  <label className="font-mono text-[10px] uppercase tracking-widest text-primary/60 absolute -top-5">
                    Final Demands
                  </label>
                  <textarea
                    rows={1}
                    className="bg-transparent border-b border-primary py-2 font-serif text-xl focus:outline-none focus:border-obsession transition-colors rounded-none w-full resize-none"
                    placeholder="Allergies, threats, or demands..."
                  />
                </div>

                <div className="cta-form-element mt-4">
                  <button className="btn btn-primary w-full shadow-dark hover:shadow-none translate-y-0 active:translate-y-1 transition-all">
                    Commit to the Fire
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
