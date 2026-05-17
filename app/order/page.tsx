"use client";

import { useCart } from "../context/cart-context";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function OrderPage() {
  const { cart, removeFromCart, updateQty, getCartTotal } = useCart();
  const router = useRouter();

  const total = getCartTotal();

  return (
    <div className="min-h-screen pt-16 flex flex-col md:flex-row w-full font-sans bg-secondary">
      {/* Left Axis - Your Order */}
      <div className="w-full md:w-3/5 p-8 md:p-16 border-r border-primary min-h-[calc(100vh-4rem)]">
        <div className="flex justify-between items-end mb-12 border-b border-primary pb-6">
          <h1 className="text-4xl font-bold uppercase">Your Order</h1>
          <span className="font-mono text-sm">{cart.length} ITEMS</span>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-serif text-2xl italic opacity-50 mb-8">
              Your order is empty.
            </p>
            <button
              onClick={() => router.push("/menu")}
              className="btn btn-secondary shadow-dark hover:shadow-none translate-y-0 active:translate-y-1 transition-all"
            >
              Explore Menu
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {cart.map((item) => (
              <div
                key={item.id}
                className="group relative flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 border border-primary bg-[#F2ECE4] hover:border-obsession shadow-none hover:shadow-obsession transition-all duration-300"
              >
                <div className="flex gap-6 items-center">
                  {item.image && (
                    <div className="w-20 h-20 relative outline outline-1 outline-primary">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="font-bold text-lg uppercase tracking-wide">
                      {item.name}
                    </span>
                    <span className="font-mono text-sm opacity-70 mb-2">
                      ₦{item.basePrice.toFixed(2)} Base
                    </span>
                    {item.addons && item.addons.length > 0 && (
                      <div className="flex flex-col gap-1 mb-2">
                        {item.addons.map((a, idx) => (
                          <span
                            key={idx}
                            className="font-mono text-xs text-obsession bg-primary/5 px-2 py-0.5 w-fit uppercase"
                          >
                            + {a.name} (₦{a.price.toFixed(2)} x {a.qty})
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-6 mt-4 sm:mt-0 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="flex border border-primary">
                    <button
                      onClick={() =>
                        updateQty(item.id, Math.max(1, item.qty - 1))
                      }
                      className="w-8 h-8 flex items-center justify-center hover:bg-primary hover:text-secondary transition-colors"
                    >
                      -
                    </button>
                    <div className="w-10 h-8 flex items-center justify-center font-mono text-sm border-x border-primary bg-white">
                      {item.qty}
                    </div>
                    <button
                      onClick={() => updateQty(item.id, item.qty + 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-primary hover:text-secondary transition-colors"
                    >
                      +
                    </button>
                  </div>

                  <div className="flex flex-col items-end min-w-[80px]">
                    <span className="font-mono font-bold">
                      ₦{item.totalItemPrice.toFixed(2)}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-[10px] uppercase tracking-widest text-obsession hover:underline mt-1"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Axis - Sticky Receipt (Tactile Paper vibe) */}
      <div className="w-full md:w-2/5 p-8 md:p-16 relative bg-secondary">
        <div className="sticky top-24 border border-primary p-8 shadow-obsession bg-[#F2ECE4] min-h-[500px] flex flex-col mx-auto max-w-md">
          {/* Receipt Header */}
          <div className="text-center border-b-2 border-dashed border-primary/40 pb-6 mb-6">
            <h2 className="font-mono uppercase tracking-widest text-sm mb-2">
              The Daily Knead
            </h2>
            <p className="font-mono text-[10px] opacity-60">
              ORDER RECEIPT // SYSTEM_A
            </p>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto font-mono text-base space-y-5 mb-6">
            {cart.length === 0 ? (
              <p className="text-center opacity-40 italic py-8 font-serif text-lg">
                No items selected.
              </p>
            ) : (
              cart.map((item, i) => (
                <div
                  key={item.id}
                  className="flex justify-between items-start group"
                >
                  <div className="flex gap-4">
                    <span className="opacity-70 text-sm">
                      {String((i + 1) * 10).padStart(3, "0")}
                    </span>
                    <div className="flex flex-col">
                      <span className="uppercase font-bold">{item.name}</span>
                      <span className="text-sm opacity-80 mt-1">
                        Qty. {item.qty}
                      </span>
                      {item.addons.map((a, idx) => (
                        <span key={idx} className="text-sm italic opacity-80">
                          +{a.name} ({a.qty})
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold">
                      ₦{item.totalItemPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          <div className="border-t-2 border-dashed border-primary/40 pt-6 mt-auto">
            <div className="flex justify-between items-center mb-6 font-bold uppercase text-xl">
              <span>Total</span>
              <span>₦{total.toFixed(2)}</span>
            </div>

            <button
              onClick={() => router.push("/checkout")}
              disabled={cart.length === 0}
              className="btn btn-primary w-full shadow-dark hover:shadow-none translate-y-0 hover:translate-y-[4px]"
            >
              Checkout &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
