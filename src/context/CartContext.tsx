"use client";

import { createContext, useContext, useReducer, useEffect, useCallback } from "react";
import type { CartItem } from "@/lib/types";

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string, type: "product" | "combo") => void;
  updateQuantity: (id: string, type: "product" | "combo", quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | null>(null);

type Action =
  | { type: "ADD_ITEM"; payload: Omit<CartItem, "quantity"> }
  | { type: "REMOVE_ITEM"; payload: { id: string; type: "product" | "combo" } }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; type: "product" | "combo"; quantity: number } }
  | { type: "CLEAR" }
  | { type: "HYDRATE"; payload: CartItem[] };

const STORAGE_KEY = "pasteleria-cart";

function cartReducer(state: CartItem[], action: Action): CartItem[] {
  switch (action.type) {
    case "ADD_ITEM": {
      const key = (i: CartItem) => `${i.id}-${i.type}`;
      const existing = state.find((i) => key(i) === key(action.payload as CartItem));
      if (existing) {
        return state.map((i) =>
          key(i) === key(existing)
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...state, { ...action.payload, quantity: 1 }];
    }
    case "REMOVE_ITEM":
      return state.filter(
        (i) => !(i.id === action.payload.id && i.type === action.payload.type)
      );
    case "UPDATE_QUANTITY": {
      if (action.payload.quantity <= 0) {
        return state.filter(
          (i) => !(i.id === action.payload.id && i.type === action.payload.type)
        );
      }
      return state.map((i) =>
        i.id === action.payload.id && i.type === action.payload.type
          ? { ...i, quantity: action.payload.quantity }
          : i
      );
    }
    case "CLEAR":
      return [];
    case "HYDRATE":
      return action.payload;
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) dispatch({ type: "HYDRATE", payload: JSON.parse(stored) });
    } catch { /* empty */ }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch { /* empty */ }
  }, [items]);

  const addItem = useCallback((item: Omit<CartItem, "quantity">) => {
    dispatch({ type: "ADD_ITEM", payload: item });
  }, []);

  const removeItem = useCallback((id: string, type: "product" | "combo") => {
    dispatch({ type: "REMOVE_ITEM", payload: { id, type } });
  }, []);

  const updateQuantity = useCallback(
    (id: string, type: "product" | "combo", quantity: number) => {
      dispatch({ type: "UPDATE_QUANTITY", payload: { id, type, quantity } });
    },
    []
  );

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR" });
  }, []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de CartProvider");
  return ctx;
}
