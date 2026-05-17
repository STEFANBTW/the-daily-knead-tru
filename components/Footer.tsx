"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  if (pathname === "/checkout" || pathname === "/order-success" || pathname.startsWith("/dashboard/admin")) return null;

  // Top-down plate images for the infinite footer slider
  const plates = [
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800",
    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800",
    "https://images.unsplash.com/photo-1574484284002-952d92456975?q=80&w=800",
    "https://images.unsplash.com/photo-1481931098730-318b6f776db0?q=80&w=800",
  ];

  return (
    <footer className="relative h-screen w-full bg-[#161513] overflow-hidden flex items-center justify-center selection:bg-[#EBE6DF] selection:text-[#252422]">
      {/* The Sliding Plates Track */}
      <div className="absolute inset-0 flex items-center pointer-events-none z-0">
        <div className="flex animate-slide-left w-max">
          <div className="flex gap-16 px-8 items-center">
            {plates.map((src, i) => (
              <div
                key={i}
                className="relative w-[20vw] h-[20vw] min-w-[250px] min-h-[250px] rounded-full overflow-hidden shadow-2xl shrink-0"
              >
                <Image
                  src={src}
                  alt="Plate top down"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ))}
          </div>
          <div className="flex gap-16 px-8 items-center">
            {plates.map((src, i) => (
              <div
                key={`loop-${i}`}
                className="relative w-[20vw] h-[20vw] min-w-[250px] min-h-[250px] rounded-full overflow-hidden shadow-2xl shrink-0"
              >
                <Image
                  src={src}
                  alt="Plate top down loop"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Center Monolithic Text Overwriting Plates */}
      <h1 className="relative z-10 font-sans font-black text-[12vw] uppercase text-[#EBE6DF] whitespace-nowrap drop-shadow-[0_0_40px_rgba(0,0,0,0.8)] mix-blend-difference mb-20 md:mb-0">
        The Daily Knead
      </h1>

      {/* BAUHAUS STYLE DOCKED BOTTOM FOOTER */}
      <div className="absolute bottom-0 left-0 w-full z-30 grid grid-cols-1 md:grid-cols-4 font-mono text-[10px] uppercase tracking-widest text-[#EBE6DF] border-t border-[#EBE6DF]/10 bg-[#161513]/80 backdrop-blur-sm">
        <div className="p-6 flex flex-col justify-between">
          <span className="opacity-50 mb-8 hidden md:block">Headquarters</span>
          <span className="font-sans font-bold text-lg md:text-xl leading-tight">
            404 Carbs Lane
            <br />
            Central District
          </span>
        </div>
        <div className="p-6 flex flex-col justify-between hidden md:flex">
          <span className="opacity-50 mb-8">Navigation</span>
          <div className="flex flex-col gap-2 font-sans font-bold text-xl">
            <Link
              href="/about"
              className="hover:text-obsession hover:translate-x-1 transition-transform w-fit"
            >
              About
            </Link>
            <Link
              href="/menu"
              className="hover:text-obsession hover:translate-x-1 transition-transform w-fit"
            >
              Our Menu
            </Link>
            <Link
              href="/order"
              className="hover:text-obsession hover:translate-x-1 transition-transform w-fit"
            >
              Order Menu
            </Link>
          </div>
        </div>
        <div className="p-6 flex flex-col justify-between hidden md:flex">
          <span className="opacity-50 mb-8">Social Matrix</span>
          <div className="flex flex-col gap-2 font-sans font-bold text-xl">
            <a
              href="#"
              className="hover:text-obsession hover:translate-x-1 transition-transform w-fit"
            >
              Instagram (Photos)
            </a>
            <a
              href="#"
              className="hover:text-obsession hover:translate-x-1 transition-transform w-fit"
            >
              Twitter (Thoughts)
            </a>
            <a
              href="#"
              className="hover:text-obsession hover:translate-x-1 transition-transform w-fit"
            >
              TikTok (Motion)
            </a>
          </div>
        </div>
        <div className="p-6 flex flex-col justify-between relative overflow-hidden group cursor-pointer hover:bg-white/5 transition-colors border-l border-secondary/10">
          <span className="opacity-80 mb-4 md:mb-8 relative z-10">
            Legal / Disclaimer
          </span>
          <span className="font-sans font-bold text-base md:text-lg leading-tight relative z-10">
            We Are Not
            <br />
            Responsible For
            <br />
            Food Comas.
          </span>
        </div>
      </div>
    </footer>
  );
}
