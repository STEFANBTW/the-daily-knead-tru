"use client";

import { ReactNode } from "react";
import { CartProvider } from "./context/cart-context";
import { DbProvider } from "./context/db-context";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <DbProvider>
      <CartProvider>{children}</CartProvider>
    </DbProvider>
  );
}
