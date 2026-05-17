"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function OrderSuccessPage() {
  const router = useRouter();
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setOrderId(Math.random().toString(36).substring(2, 10).toUpperCase());
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16 px-8 flex flex-col items-center justify-center font-sans bg-secondary">
      <div className="max-w-md w-full p-12 text-center card-layer">
        <div className="w-20 h-20 border-2 border-obsession bg-obsession/10 rounded-full flex items-center justify-center mx-auto mb-8">
          <span className="text-4xl text-obsession">✓</span>
        </div>
        <h1 className="text-3xl font-bold uppercase mb-4 tracking-tight">
          Order Placed
        </h1>
        <p className="font-serif text-lg opacity-70 mb-8 italic">
          Your order has been received and sent to the kitchen.
        </p>
        <div className="p-4 border border-dashed border-primary font-mono text-sm mb-8 bg-white min-h-[55px] flex items-center justify-center">
          {orderId ? `Order # ${orderId}` : "Generating..."}
        </div>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => router.push("/dashboard/user")}
            className="btn btn-primary w-full"
          >
            Go to My Dashboard
          </button>
          <button
            onClick={() => router.push("/menu")}
            className="btn btn-secondary w-full"
          >
            Back to Menu
          </button>
        </div>
      </div>
    </div>
  );
}
