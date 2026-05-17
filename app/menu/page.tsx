"use client";

import { Suspense, useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";
import { placeholderImage } from "./data";
import { useCart, CartItem } from "../context/cart-context";
import { useDb } from "../context/db-context";
import { useSearchParams } from "next/navigation";

const parsePrice = (priceStr: string) =>
  parseFloat(priceStr.replace(/[^0-9.]/g, "")) || 0;

const AddonItem = ({
  opt,
  qty,
  onChange,
}: {
  opt: any;
  qty: number;
  onChange: (qty: number) => void;
}) => {
  const active = qty > 0;
  const displayQty = qty > 0 ? qty : 1;

  return (
    <div className="flex flex-col gap-3 py-[var(--space-2)]">
      <div className="flex justify-between items-center text-sm">
        <label className="flex items-center gap-4 cursor-pointer group flex-1">
          <div
            className={`w-5 h-5 border-[length:var(--subtext-border-width)] flex items-center justify-center transition-colors ${active ? "bg-[var(--bg-inverted)] border-[var(--border-main)]" : "border-[var(--border-main)]/50 group-hover:border-[var(--border-main)]"}`}
          >
            {active && (
              <span className="text-[var(--text-inverted)] text-xs">✓</span>
            )}
          </div>
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => onChange(e.target.checked ? 1 : 0)}
            className="hidden"
          />
          <span
            className={`font-sans font-bold uppercase transition-colors ${active ? "text-[var(--text-main)]" : "text-[var(--text-main)]/70 group-hover:text-[var(--text-main)]"}`}
          >
            {opt.name}
          </span>
        </label>
        <span className="font-mono font-bold text-[var(--text-accent)]">
          {opt.price}
        </span>
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="flex items-center gap-4 pl-9 overflow-hidden"
          >
            <div className="flex border border-[var(--border-main)]">
              <button
                onClick={() => onChange(Math.max(1, displayQty - 1))}
                className="w-8 h-8 flex items-center justify-center hover:bg-[var(--bg-inverted)] hover:text-[var(--text-inverted)] transition-colors"
              >
                -
              </button>
              <div className="w-8 h-8 flex items-center justify-center font-mono text-sm border-x border-[var(--border-main)] bg-[var(--bg-surface)]">
                {displayQty}
              </div>
              <button
                onClick={() => onChange(displayQty + 1)}
                className="w-8 h-8 flex items-center justify-center hover:bg-[var(--bg-inverted)] hover:text-[var(--text-inverted)] transition-colors"
              >
                +
              </button>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-main)]/60">
              Quantity
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

function DraggableCartWidget() {
  const { cart, getCartTotal, updateQty, removeFromCart } = useCart();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted || cart.length === 0) return null;

  const total = getCartTotal();

  return (
    <motion.div
      drag
      dragMomentum={false}
      className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-[100] bg-[#F2ECE4] text-[var(--text-main)] p-4 md:p-6 shadow-2xl flex flex-col gap-2 md:gap-4 border-2 border-[var(--text-main)] cursor-grab active:cursor-grabbing w-[280px] md:w-[320px] shadow-obsession max-h-[60vh] md:max-h-[70vh] origin-bottom-right scale-[0.85] md:scale-100"
    >
      <div className="text-center border-b-2 border-dashed border-[var(--text-main)]/40 pb-4 mb-2 pointer-events-none">
        <h2 className="font-mono uppercase tracking-widest text-sm mb-1">
          The Daily Knead
        </h2>
        <p className="font-mono text-[10px] opacity-60">
          ORDER RECEIPT // SYSTEM_A
        </p>
      </div>

      <div
        className="flex-1 overflow-y-auto hidden-scrollbar font-mono text-base space-y-5 mb-2 cursor-auto"
        onPointerDown={(e) => e.stopPropagation()}
      >
        {cart.map((item, i) => (
          <div
            key={item.id}
            className="flex justify-between items-start group relative"
          >
            <div className="flex gap-3 w-[70%]">
              <span className="opacity-70 text-sm mt-0.5">
                {String((i + 1) * 10).padStart(3, "0")}
              </span>
              <div className="flex flex-col">
                <span className="uppercase font-bold break-words">
                  {item.name}
                </span>
                <span className="text-sm opacity-80 mt-1">Qty. {item.qty}</span>
                {item.addons.map((a, idx) => (
                  <span key={idx} className="text-sm italic opacity-80">
                    +{a.name} ({a.qty})
                  </span>
                ))}
                <div className="flex items-center gap-3 mt-3">
                  <button
                    onClick={() =>
                      updateQty(item.id, Math.max(1, item.qty - 1))
                    }
                    className="w-6 h-6 flex items-center justify-center border border-[var(--text-main)] hover:bg-[var(--text-main)] hover:text-[#F2ECE4] transition-colors"
                  >
                    -
                  </button>
                  <button
                    onClick={() => updateQty(item.id, item.qty + 1)}
                    className="w-6 h-6 flex items-center justify-center border border-[var(--text-main)] hover:bg-[var(--text-main)] hover:text-[#F2ECE4] transition-colors"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-xs ml-3 text-[var(--bg-accent)] uppercase hover:underline font-bold"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-start">
              <span className="font-bold">
                ₦{item.totalItemPrice.toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div
        className="border-t-2 border-dashed border-[var(--text-main)]/40 pt-4 cursor-auto"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 font-bold uppercase text-xl">
          <span>Total</span>
          <span>₦{total.toFixed(2)}</span>
        </div>

        <button
          onClick={() => router.push("/order")}
          className="btn btn-primary w-full shadow-dark hover:shadow-none translate-y-0 hover:translate-y-[4px]"
        >
          Checkout order &rarr;
        </button>
      </div>
    </motion.div>
  );
}

function MenuPageContent() {
  const [activeItem, setActiveItem] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [mainQty, setMainQty] = useState(1);
  const [addonState, setAddonState] = useState<Record<string, number>>({});
  const [isAllCollapsed, setIsAllCollapsed] = useState(false);
  const [isMobilePDPVisible, setIsMobilePDPVisible] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const [searchHeight, setSearchHeight] = useState(80);

  const { cart, addToCart, updateQty, removeFromCart } = useCart();
  const searchParams = useSearchParams();
  const { menu: menuSections } = useDb();

  useEffect(() => {
    const itemName = searchParams?.get("item");
    if (itemName) {
      const found = menuSections
        .flatMap((s) => s.items)
        .find((i) => i.name === itemName);
      if (found) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setActiveItem(found);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (searchContainerRef.current) {
      const observer = new ResizeObserver((entries) => {
        setSearchHeight(entries[0].contentRect.height);
      });
      observer.observe(searchContainerRef.current);
      return () => observer.disconnect();
    }
  }, []);

  const filteredSections = menuSections
    .map((section) => {
      return {
        ...section,
        items: section.items.filter(
          (item: any) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            section.title.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      };
    })
    .filter((section) => section.items.length > 0);

  const handleComboClick = (comboName: string) => {
    for (const sec of menuSections) {
      const found = sec.items.find(
        (i: any) => comboName.includes(i.name) || i.name.includes(comboName),
      );
      if (found) {
        setActiveItem(found);
        setMainQty(1);
        setAddonState({});
        if (window.innerWidth < 768) {
          setIsMobilePDPVisible(true);
        }
        return;
      }
    }
  };

  const handleItemSelect = (item: any) => {
    if (activeItem?.name === item?.name) {
      setActiveItem(null);
      setIsMobilePDPVisible(false);
    } else {
      setActiveItem(item);
      setMainQty(1);
      setAddonState({});
      if (window.innerWidth < 768) {
        setIsMobilePDPVisible(true);
      }
    }
  };

  const currentAddons = useMemo(() => {
    if (!activeItem) return [];
    return (activeItem.customization || [])
      .filter((opt: any) => (addonState[opt.name] || 0) > 0)
      .map((opt: any) => ({
        name: opt.name,
        price: parsePrice(opt.price),
        qty: addonState[opt.name],
      }));
  }, [activeItem, addonState]);

  const matchingCartItem = useMemo(() => {
    if (!activeItem) return null;
    return cart.find((i) => {
      if (i.itemId !== activeItem.name) return false;
      if (i.portionSize !== activeItem.portionSize) return false;
      if (i.addons.length !== currentAddons.length) return false;

      const sortedExisting = [...i.addons].sort((a, b) =>
        a.name.localeCompare(b.name),
      );
      const sortedNew = [...currentAddons].sort((a, b) =>
        a.name.localeCompare(b.name),
      );
      return sortedExisting.every(
        (addon, idx) =>
          addon.name === sortedNew[idx].name &&
          addon.price === sortedNew[idx].price &&
          addon.qty === sortedNew[idx].qty,
      );
    });
  }, [cart, activeItem, currentAddons]);

  const displayQty = matchingCartItem ? matchingCartItem.qty : mainQty;

  const handleDecrement = () => {
    if (matchingCartItem) {
      if (matchingCartItem.qty > 1) {
        updateQty(matchingCartItem.id, matchingCartItem.qty - 1);
      } else {
        removeFromCart(matchingCartItem.id);
        setMainQty(1); // Reset local draft when completely removed
      }
    } else {
      setMainQty(Math.max(1, mainQty - 1));
    }
  };

  const handleIncrement = () => {
    if (matchingCartItem) {
      updateQty(matchingCartItem.id, matchingCartItem.qty + 1);
    } else {
      setMainQty(mainQty + 1);
    }
  };

  const currentPrice = useMemo(() => {
    if (!activeItem) return 0;
    const base = parsePrice(activeItem.price);
    const addonsTotal = currentAddons.reduce(
      (sum: number, opt: any) => sum + opt.price * opt.qty,
      0,
    );
    return (base + addonsTotal) * displayQty;
  }, [activeItem, currentAddons, displayQty]);

  const handleAddToCart = () => {
    if (!activeItem) return;

    if (matchingCartItem) {
      updateQty(matchingCartItem.id, matchingCartItem.qty + 1);
    } else {
      const cartItem: CartItem = {
        id: Math.random().toString(36).substring(7),
        itemId: activeItem.name,
        name: activeItem.name,
        basePrice: parsePrice(activeItem.price),
        qty: mainQty,
        addons: currentAddons,
        totalItemPrice: currentPrice, // Computed for this quantity
        image: activeItem.image,
        portionSize: activeItem.portionSize,
      };

      addToCart(cartItem);
    }
  };

  return (
    <div className="min-h-[100dvh] pt-[var(--menu-nav-height)] w-full max-w-[3000px] mx-auto bg-[var(--bg-surface)] min-[1600px]:h-[100dvh] min-[1600px]:overflow-hidden pl-4 pr-4 md:pl-8 md:pr-8 min-[1600px]:pr-0 min-[1600px]:pl-12">
      <DraggableCartWidget />
      <div className="flex flex-col md:flex-row justify-between w-full min-[1600px]:h-full border-t border-[var(--border-main)]/10 md:border-none">
        {/* Left Side: Transformable Panel */}
        <div className={`
          ${isMobilePDPVisible ? 'fixed inset-0 z-50 bg-[var(--bg-surface)] px-4 py-8 overflow-y-auto block' : 'hidden'}
          md:flex
          w-full md:w-1/2 min-[1600px]:w-[40%] min-[2000px]:w-[34%] min-[2500px]:w-[30%]
          flex-col pt-[var(--menu-top-gap)] md:pr-8 md:border-r border-[var(--border-main)]/20
          md:sticky md:top-[calc(var(--menu-nav-height)+var(--menu-top-gap))] md:h-[calc(100vh-var(--menu-nav-height)-var(--menu-top-gap)-2rem)] 
          min-[1600px]:static min-[1600px]:h-full min-[1600px]:overflow-y-auto hidden-scrollbar min-[1600px]:px-12 min-[1600px]:pb-12 min-[1600px]:pr-12
        `}>
          <AnimatePresence mode="wait">
            {!activeItem ? (
              <motion.div
                key="default"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col w-full h-full"
              >
                {/* 1. Item Name Area -> Title */}
                <div className="shrink-0">
                  <h1 className="menu-title text-6xl md:text-8xl font-sans font-bold uppercase mb-16 tracking-tighter text-[var(--text-main)] leading-none">
                    The
                    <br />
                    Menu.
                  </h1>
                </div>

                {/* 2. Photo Area */}
                <div className="relative w-full flex-grow border border-[var(--border-main)] overflow-hidden group min-h-[300px]">
                  <Image
                    src={placeholderImage}
                    alt="Atmosphere"
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    unoptimized
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={activeItem.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col w-full h-full overflow-y-auto hidden-scrollbar"
              >
                {/* 1. Item Name and 6. Price */}
                <div className="flex flex-col shrink-0">
                  <h1 className="menu-title text-5xl md:text-6xl font-sans font-bold uppercase mb-2 tracking-tighter text-[var(--text-main)] leading-none max-w-full">
                    {activeItem.name}
                  </h1>
                  <span className="font-mono text-2xl text-[var(--text-accent)] font-bold mb-8">
                    {activeItem.price}
                  </span>
                </div>

                {/* 2. Photo Area */}
                <div className="relative w-full h-[40vh] shrink-0 border border-[var(--border-main)] overflow-hidden group mb-8">
                  <Image
                    src={activeItem.image}
                    alt={activeItem.name}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    unoptimized
                  />
                </div>

                {/* Content Container */}
                <div className="flex flex-col gap-10 shrink-0 pb-12">
                  {/* 3. Short description */}
                  <div>
                    <p className="font-serif text-xl leading-relaxed text-[var(--text-main)] italic border-l-4 border-[var(--border-main)] pl-4 py-1">
                      {activeItem.description}
                    </p>
                  </div>

                  {/* Top Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-b border-[var(--border-main)]/20 pb-8">
                    {/* 7. Portion size */}
                    <div>
                      <h3 className="font-sans font-[number:var(--subtext-weight)] opacity-[var(--subtext-opacity)] text-sm uppercase tracking-widest text-[var(--text-main)] mb-[var(--space-3)]">
                        Portion
                      </h3>
                      <p className="font-sans text-sm text-[var(--text-main)] font-semibold uppercase">
                        {activeItem.portionSize}
                      </p>
                    </div>
                    {/* 10. Prep time */}
                    <div>
                      <h3 className="font-sans font-[number:var(--subtext-weight)] opacity-[var(--subtext-opacity)] text-sm uppercase tracking-widest text-[var(--text-main)] mb-[var(--space-3)]">
                        Prep Time
                      </h3>
                      <p className="font-sans text-sm text-[var(--text-main)] font-semibold uppercase">
                        {activeItem.prepTime}
                      </p>
                    </div>
                    {/* 8. Spice level */}
                    <div>
                      <h3 className="font-sans font-[number:var(--subtext-weight)] opacity-[var(--subtext-opacity)] text-sm uppercase tracking-widest text-[var(--text-main)] mb-[var(--space-3)]">
                        Spice Level
                      </h3>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <span
                            key={i}
                            className={`w-2 h-2 rounded-full ${i < activeItem.spiceLevelIndex ? "bg-[var(--bg-accent)]" : "bg-[var(--bg-inverted)]/20"}`}
                          />
                        ))}
                      </div>
                      <span className="font-sans text-xs font-bold uppercase text-[var(--text-accent)] block mt-1">
                        {activeItem.spiceLevel}
                      </span>
                    </div>
                    {/* 11. Popularity */}
                    <div>
                      <h3 className="font-sans font-[number:var(--subtext-weight)] opacity-[var(--subtext-opacity)] text-sm uppercase tracking-widest text-[var(--text-main)] mb-[var(--space-3)]">
                        Popularity
                      </h3>
                      <p className="font-sans text-sm text-[var(--text-main)] font-semibold uppercase flex items-center gap-1">
                        <span className="text-[var(--text-accent)]">★</span>{" "}
                        {activeItem.popularity}
                      </p>
                    </div>
                  </div>

                  {/* 4. Ingredients & 9. Allergens */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-[var(--border-main)]/20 pb-8">
                    <div>
                      <h3 className="font-sans font-[number:var(--subtext-weight)] opacity-[var(--subtext-opacity)] text-base uppercase tracking-widest text-[var(--text-main)] mb-[var(--space-6)] border-b-[length:var(--subtext-border-width)] border-[var(--border-main)] pb-[var(--space-2)]">
                        What&apos;s Inside
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {activeItem.ingredients.map(
                          (ing: string, i: number) => (
                            <span
                              key={i}
                              className="font-sans text-[11px] font-bold text-[var(--text-inverted)] bg-[var(--bg-inverted)] uppercase tracking-wider px-3 py-1.5 rounded-sm"
                            >
                              {ing}
                            </span>
                          ),
                        )}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-sans font-[number:var(--subtext-weight)] opacity-[var(--subtext-opacity)] text-base uppercase tracking-widest text-[var(--text-main)] mb-[var(--space-6)] border-b-[length:var(--subtext-border-width)] border-[var(--border-main)] pb-[var(--space-2)]">
                        Dietary Notes
                      </h3>
                      <ul className="list-disc pl-5 font-sans justify-center flex flex-col gap-1 text-sm text-[var(--text-main)] font-bold">
                        {activeItem.allergens.map((alg: string, i: number) => (
                          <li key={i}>{alg}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* 5. Customization options */}
                  <div>
                    <h3 className="font-sans font-[number:var(--subtext-weight)] opacity-[var(--subtext-opacity)] text-base uppercase tracking-widest text-[var(--text-main)] mb-[var(--space-6)] border-b-[length:var(--subtext-border-width)] border-[var(--border-main)] pb-[var(--space-2)]">
                      Add-ons
                    </h3>
                    <div className="flex flex-col">
                      {activeItem.customization.map((opt: any, i: number) => (
                        <AddonItem
                          key={`${activeItem.name}-addon-${i}`}
                          opt={opt}
                          qty={addonState[opt.name] || 0}
                          onChange={(qty) =>
                            setAddonState((prev) => ({
                              ...prev,
                              [opt.name]: qty,
                            }))
                          }
                        />
                      ))}
                    </div>
                  </div>

                  {/* 14. Combo suggestions */}
                  {activeItem.comboLink && (
                    <div
                      className="bg-[var(--bg-inverted)] p-6 border-l-8 border-[var(--border-accent)] cursor-pointer group hover:bg-[var(--bg-accent)] transition-colors relative overflow-hidden"
                      onClick={() => handleComboClick(activeItem.comboLink)}
                    >
                      <h3 className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-inverted)]/70 mb-2 group-hover:text-[var(--text-inverted)] transition-colors relative z-10">
                        Pro Tip / Recommended Pairing
                      </h3>
                      <p className="font-sans font-bold text-sm md:text-base text-[var(--text-inverted)] uppercase leading-relaxed group-hover:text-[var(--text-main)] transition-colors flex items-center justify-between relative z-10">
                        <span>{activeItem.comboLink}</span>
                        <span className="text-2xl">&rarr;</span>
                      </p>
                    </div>
                  )}

                  {/* 12. Add to Order / Quantity Controls */}
                  <div className="flex gap-4 mt-6">
                    <div className="flex border border-[var(--border-main)]">
                      <button
                        onClick={handleDecrement}
                        className="px-5 font-sans font-black text-xl hover:bg-[var(--bg-inverted)] text-[var(--text-main)] hover:text-[var(--text-inverted)] transition-colors"
                      >
                        -
                      </button>
                      <div className="px-5 flex items-center justify-center font-mono text-lg border-x border-[var(--border-main)] bg-[var(--bg-surface)]">
                        {displayQty}
                      </div>
                      <button
                        onClick={handleIncrement}
                        className="px-5 font-sans font-black text-xl hover:bg-[var(--bg-inverted)] text-[var(--text-main)] hover:text-[var(--text-inverted)] transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 bg-[var(--bg-inverted)] text-[var(--text-inverted)] py-4 uppercase font-sans font-bold tracking-widest md:text-sm hover:bg-[var(--bg-accent)] transition-all shadow-dark hover:shadow-none translate-y-0 active:translate-y-1"
                    >
                      Add to Order &mdash; ₦{currentPrice.toFixed(2)}
                    </button>
                  </div>

                  {/* Back button */}
                  <button
                    onClick={() => { setActiveItem(null); setIsMobilePDPVisible(false); }}
                    className="mt-8 font-mono text-[10px] uppercase tracking-widest text-[var(--text-main)]/50 hover:text-[var(--text-main)] transition-colors self-start border-b border-transparent hover:border-[var(--border-main)] md:hidden"
                  >
                    &larr; Back to full menu
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Divider */}
        <div className="hidden min-[1600px]:block w-px bg-[var(--border-main)] shrink-0 h-full opacity-20" />

        {/* Right Side: The Items Map */}
        <div 
          className={`
            ${isMobilePDPVisible ? 'hidden' : 'flex'}
            md:flex md:pl-8
            w-full md:w-1/2 min-[1600px]:w-[60%] min-[2000px]:w-[64%] min-[2500px]:w-[70%] flex-col relative min-[1600px]:h-full min-[1600px]:overflow-y-auto hidden-scrollbar pb-24 min-[1600px]:pb-12 min-[1600px]:px-12
          `}
          style={{ '--search-height': `${searchHeight}px` } as React.CSSProperties}
        >
          {/* Sticky Search Bar */}
          <div 
            ref={searchContainerRef}
            className="sticky top-[var(--menu-search-top)] min-[1600px]:top-0 z-20 bg-[var(--bg-surface)] py-[var(--space-6)] min-[1600px]:pt-[var(--menu-top-gap)] min-[1600px]:pb-[var(--space-6)] border-b border-[var(--border-main)]"
          >
            <input
              type="text"
              placeholder="Search the menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent font-sans text-3xl xl:text-4xl font-bold uppercase tracking-tighter text-[var(--text-main)] placeholder:opacity-30 outline-none"
            />
          </div>

          <div className="flex flex-col relative">
            <AnimatePresence mode="wait">
              <motion.div 
                key="menu-list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`flex flex-col ${isAllCollapsed ? 'gap-0 mt-4' : 'gap-16 mt-8'}`}
              >
                {filteredSections.map((section, idx) => (
                  <div
                    id={`section-${section.title.replace(/\s+/g, '-')}`}
                    key={idx}
                    className="menu-section w-full pt-4 relative"
                    style={{ scrollMarginTop: 'calc(var(--menu-search-top, 0px) + var(--search-height, 100px) + 20px)' }}
                  >
                    {/* Section Header (Sticky & Accordion) */}
                    <div 
                      className={`sticky-section-header sticky z-10 bg-[var(--bg-surface)] py-4 flex items-center justify-between group cursor-pointer border-b border-[var(--border-main)]/10 transition-all ${isAllCollapsed ? 'mb-0' : 'mb-8'}`}
                      onClick={async () => {
                        const elId = `section-${section.title.replace(/\s+/g, '-')}`;
                        const el = document.getElementById(elId);
                        
                        if (!isAllCollapsed) {
                          setIsAllCollapsed(true);
                          // Give DOM time to collapse
                          setTimeout(() => {
                            if (el) {
                              const container = el.closest('.hidden-scrollbar');
                              if (container) {
                                container.scrollTo({ top: 0, behavior: 'smooth' });
                              } else {
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }
                            }
                          }, 50);
                        } else {
                          setIsAllCollapsed(false);
                          
                          // We wait for the sections to expand fully before calculating and scrolling to the new position
                          setTimeout(() => {
                            const newEl = document.getElementById(elId);
                            if (newEl) {
                              newEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }
                          }, 400);
                        }
                      }}
                    >
                      <h2 className="font-mono text-sm tracking-widest uppercase text-[var(--text-accent)] font-bold group-hover:opacity-70 transition-opacity">
                        {section.title}
                      </h2>
                    </div>
                    
                    <AnimatePresence>
                      {!isAllCollapsed && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="grid grid-cols-1 min-[1600px]:grid-cols-2 min-[2000px]:grid-cols-3 min-[2500px]:grid-cols-4 gap-x-12 gap-y-8 w-full pb-8">
                            {section.items.map((item: any, itemIdx: number) => {
                              const isActive = activeItem?.name === item.name;
                              return (
                                <div
                                  key={itemIdx}
                                  onClick={() => handleItemSelect(item)}
                                  className="flex items-baseline w-full group cursor-pointer"
                                >
                                  <div
                                    className={`font-sans font-bold text-[1.1rem] sm:text-[1.25rem] uppercase tracking-wide transition-colors shrink-0 pr-2 ${isActive ? "text-[var(--text-accent)]" : "group-hover:text-[var(--text-accent)] text-[var(--text-main)]"}`}
                                  >
                                    {item.name}
                                  </div>
                                  <div 
                                    className={`flex-grow border-b-2 border-dotted border-[var(--border-main)]/30 relative top-[-6px] mx-1 transition-colors ${isActive ? "border-[var(--text-accent)]" : "group-hover:border-[var(--border-accent)]"}`} 
                                  />
                                  <div
                                    className={`shrink-0 font-mono text-sm sm:text-base pl-2 font-medium ${isActive ? "text-[var(--text-accent)]" : "text-[var(--text-main)]"}`}
                                  >
                                    {item.price}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}

                {filteredSections.length === 0 && (
                  <div className="pt-12 text-[var(--text-main)]/50 font-sans font-semibold text-lg uppercase tracking-wide">
                    No items found matching &quot;{searchQuery}&quot;.
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        /* Hide scrollbar fully */
        .hidden-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hidden-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }

        /* Sticky header dynamic offset */
        .sticky-section-header {
          top: calc(var(--menu-search-top, 0px) + var(--search-height, 100px));
        }
        @media (min-width: 1600px) {
          .sticky-section-header {
            top: var(--search-height, 100px);
          }
        }
      `,
        }}
      />
    </div>
  );
}

export default function MenuPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen pt-[var(--menu-nav-height)] bg-[var(--bg-surface)] text-[var(--text-main)] flex items-center justify-center font-mono uppercase tracking-widest text-sm">
          Loading Menu...
        </div>
      }
    >
      <MenuPageContent />
    </Suspense>
  );
}
