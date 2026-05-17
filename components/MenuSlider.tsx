"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { menuSections } from "@/app/menu/data";
import { useRouter } from "next/navigation";

export default function MenuSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const filmstripRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Flatten a few featured items from our menu
  const featuredItems = menuSections
    .flatMap((section) =>
      section.items.map((item) => ({ ...item, category: section.title })),
    )
    .slice(0, 20)
    .filter(Boolean);

  /* Auto-slide and center thumbnail */
  useEffect(() => {
    if (featuredItems.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((p) => (p >= featuredItems.length - 1 ? 0 : p + 1));
    }, 2500); // changes every 2.5 seconds

    // Automatically make sure the active thumbnail is somewhat centered in the filmstrip
    if (filmstripRef.current) {
      const activeThumb = filmstripRef.current.children[currentIndex] as
        | HTMLElement
        | undefined;
      if (activeThumb) {
        // center it
        const scrollLeft =
          activeThumb.offsetLeft -
          filmstripRef.current.offsetWidth / 2 +
          activeThumb.offsetWidth / 2;
        filmstripRef.current.scrollTo({ left: scrollLeft, behavior: "smooth" });
      }
    }

    return () => clearInterval(interval);
  }, [currentIndex, featuredItems.length]);

  if (featuredItems.length === 0) return null;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((p) => (p <= 0 ? featuredItems.length - 1 : p - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((p) => (p >= featuredItems.length - 1 ? 0 : p + 1));
  };

  const handleSlideClick = () => {
    const item = featuredItems[currentIndex];
    router.push(`/menu?item=${encodeURIComponent(item.name)}`);
  };

  return (
    <div className="absolute inset-0 group">
      {featuredItems.map((item, index) => (
        <div
          key={index}
          onClick={handleSlideClick}
          className={`absolute inset-0 transition-opacity duration-1000 cursor-pointer ${index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"}`}
        >
          <Image
            src={item.image}
            alt={item.name || "Menu Item"}
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-black/40"></div>
          {/* Main Content info placed higher so film strip has space */}
          <div className="absolute bottom-[20%] left-8 text-secondary font-sans z-10 drop-shadow-md">
            <p className="font-mono text-xs tracking-widest uppercase mb-2 opacity-90">
              {item.category} / Featured
            </p>
            <h3 className="font-bold text-3xl uppercase">{item.name}</h3>
            <p className="font-serif italic mt-2 opacity-80 max-w-sm">
              {item.description || "Authentic flavors, built on instinct."}
            </p>
          </div>
        </div>
      ))}

      {/* Film strip / Indicators - Touching Edges entirely */}
      <div className="absolute bottom-0 left-0 right-0 z-30 bg-black/60 backdrop-blur-sm">
        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          className="absolute left-0 top-0 bottom-0 z-40 px-2 bg-gradient-to-r from-black/80 to-transparent text-white hover:text-obsession transition-colors flex items-center justify-center"
        >
          <ChevronLeft size={24} />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-0 top-0 bottom-0 z-40 px-2 bg-gradient-to-l from-black/80 to-transparent text-white hover:text-obsession transition-colors flex items-center justify-center"
        >
          <ChevronRight size={24} />
        </button>

        {/* Thumbnails Container */}
        <div
          ref={filmstripRef}
          className="flex w-full overflow-x-auto hide-scrollbar gap-1 px-0 py-2 scroll-smooth"
        >
          {featuredItems.map((item, index) => (
            <div
              key={`indicator-${index}`}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(index);
              }}
              className={`relative h-16 shrink-0 transition-all duration-300 cursor-pointer overflow-hidden ${
                index === currentIndex
                  ? "ring-2 ring-obsession opacity-100 w-[14%]"
                  : "opacity-50 hover:opacity-80 w-[11.5%]"
              }`}
              style={{ minWidth: "60px" }}
            >
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
