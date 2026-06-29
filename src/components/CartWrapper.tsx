"use client";

import { CartProvider } from "@/context/CartContext";
import CartButton from "./CartButton";
import CartDrawer from "./CartDrawer";

interface CartWrapperProps {
  deliveryPrice: number;
  children: React.ReactNode;
}

export default function CartWrapper({ deliveryPrice, children }: CartWrapperProps) {
  return (
    <CartProvider>
      {children}
      <CartButton />
      <CartDrawer deliveryPrice={deliveryPrice} />
    </CartProvider>
  );
}
