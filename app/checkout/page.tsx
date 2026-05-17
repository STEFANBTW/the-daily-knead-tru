"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../context/cart-context";

export default function CheckoutPage() {
  const { cart, getCartTotal, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const total = getCartTotal();

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate order placement
    setTimeout(() => {
      clearCart();
      router.push("/order-success");
    }, 1500);
  };

  if (cart.length === 0 && !loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-8 flex flex-col items-center justify-center font-sans bg-secondary">
        <h2 className="text-2xl font-bold uppercase mb-4">
          Your cart is empty
        </h2>
        <button
          onClick={() => router.push("/menu")}
          className="btn btn-secondary"
        >
          Back to Menu
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-8 w-full font-sans bg-secondary">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-12">
        {/* Left column: Form */}
        <div className="w-full md:w-2/3">
          <h1 className="text-4xl font-bold uppercase mb-12 border-b border-primary pb-6">
            Secure Checkout
          </h1>

          <form
            id="checkout-form"
            onSubmit={handlePlaceOrder}
            className="flex flex-col gap-8"
          >
            <section>
              <h2 className="text-xl font-bold uppercase mb-4 font-mono tracking-widest">
                1. Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  required
                  type="text"
                  placeholder="First Name"
                  className="p-4 border border-primary bg-[#F2ECE4] outline-none focus:border-obsession"
                />
                <input
                  required
                  type="text"
                  placeholder="Last Name"
                  className="p-4 border border-primary bg-[#F2ECE4] outline-none focus:border-obsession"
                />
                <input
                  required
                  type="email"
                  placeholder="Email Address"
                  className="p-4 border border-primary bg-[#F2ECE4] outline-none focus:border-obsession md:col-span-2"
                />
                <input
                  required
                  type="tel"
                  placeholder="Phone Number"
                  className="p-4 border border-primary bg-[#F2ECE4] outline-none focus:border-obsession"
                />
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold uppercase mb-4 font-mono tracking-widest">
                2. Delivery Method
              </h2>
              <div className="flex gap-4 mb-4">
                <label className="flex-1 flex items-center justify-center p-4 border border-obsession bg-obsession/10 cursor-pointer">
                  <input
                    type="radio"
                    name="delivery"
                    checked
                    readOnly
                    className="mr-2"
                  />
                  <span className="font-bold uppercase tracking-widest text-sm text-obsession">
                    Delivery
                  </span>
                </label>
                <label className="flex-1 flex items-center justify-center p-4 border border-primary/20 opacity-50 cursor-not-allowed">
                  <input
                    type="radio"
                    name="delivery"
                    disabled
                    className="mr-2"
                  />
                  <span className="font-bold uppercase tracking-widest text-sm line-through">
                    Pickup
                  </span>
                </label>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <input
                  required
                  type="text"
                  placeholder="Delivery Address"
                  className="p-4 border border-primary bg-[#F2ECE4] outline-none focus:border-obsession"
                />
                <input
                  type="text"
                  placeholder="Apartment, suite, etc. (optional)"
                  className="p-4 border border-primary bg-[#F2ECE4] outline-none focus:border-obsession"
                />
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold uppercase mb-4 font-mono tracking-widest">
                3. Payment (Mock)
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <input
                  required
                  type="text"
                  placeholder="Card Number"
                  className="p-4 border border-primary bg-[#F2ECE4] outline-none focus:border-obsession"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    required
                    type="text"
                    placeholder="MM/YY"
                    className="p-4 border border-primary bg-[#F2ECE4] outline-none focus:border-obsession"
                  />
                  <input
                    required
                    type="text"
                    placeholder="CVC"
                    className="p-4 border border-primary bg-[#F2ECE4] outline-none focus:border-obsession"
                  />
                </div>
              </div>
            </section>
          </form>
        </div>

        {/* Right column: Summary */}
        <div className="w-full md:w-1/3">
          <div className="sticky top-24 border border-primary p-8 shadow-obsession bg-[#F2ECE4] flex flex-col mx-auto max-w-sm">
            <h2 className="font-mono uppercase tracking-widest text-sm mb-6 border-b border-primary pb-4">
              Order Summary
            </h2>

            <div className="flex flex-col gap-4 mb-6">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-start font-mono text-sm"
                >
                  <div className="flex flex-col">
                    <span className="font-bold">
                      {item.qty}x {item.name}
                    </span>
                    {item.addons.map((a, idx) => (
                      <span key={idx} className="text-[10px] italic opacity-60">
                        +{a.name}
                      </span>
                    ))}
                  </div>
                  <span>₦{item.totalItemPrice.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-primary pt-4 flex flex-col gap-2 font-mono text-sm mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₦{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes & Fees</span>
                <span>₦{(total * 0.1).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t border-primary/20">
                <span>Total</span>
                <span>₦{(total * 1.1).toFixed(2)}</span>
              </div>
            </div>

            <button
              form="checkout-form"
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full transition-all"
            >
              {loading ? "Processing..." : `Pay ₦${(total * 1.1).toFixed(2)}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
