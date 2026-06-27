"use client";

import { useState } from "react";
import { CartProvider } from "@/context/CartContext";
import CartButton from "./CartButton";
import CartDrawer from "./CartDrawer";

interface CartWrapperProps {
  deliveryPrice: number;
  children: React.ReactNode;
}

export default function CartWrapper({ deliveryPrice, children }: CartWrapperProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <CartProvider>
      {children}
      <CartButton onClick={() => setDrawerOpen(true)} />
      <CartDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        deliveryPrice={deliveryPrice}
      />
    </CartProvider>
  );
}
