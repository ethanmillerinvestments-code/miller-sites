import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { SupportPlanId, WebsitePlanId } from "@/lib/offers";

export type CartOfferId = WebsitePlanId | SupportPlanId;

export type CartItem = {
  id: CartOfferId;
  name: string;
  priceCents: number;
  billing: "one-time" | "monthly";
  category: "website" | "support";
  description: string;
};

type CartStore = {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (id: CartOfferId) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  selectedIds: () => CartOfferId[];
  checkoutHref: () => string;
};

function sortCartItems(items: CartItem[]) {
  return [...items].sort((left, right) => {
    if (left.category === right.category) {
      return left.name.localeCompare(right.name);
    }

    return left.category === "website" ? -1 : 1;
  });
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) => {
        const otherItems = get().items.filter(
          (entry) =>
            entry.id !== item.id &&
            !(entry.category === item.category && entry.billing === item.billing)
        );

        set({
          items: sortCartItems([...otherItems, item]),
          isOpen: true,
        });
      },

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      selectedIds: () => get().items.map((item) => item.id),

      checkoutHref: () => {
        const ids = get().items.map((item) => item.id);

        if (ids.length === 0) {
          return "/#package-finder";
        }

        if (ids.length === 1) {
          return `/checkout/intake?item=${encodeURIComponent(ids[0])}`;
        }

        return `/checkout/intake?items=${encodeURIComponent(ids.join(","))}`;
      },
    }),
    {
      name: "leadcraft-cart",
      version: 2,
      storage: createJSONStorage(() => localStorage),
      migrate: () => ({
        items: [],
      }),
      partialize: (state) => ({
        items: state.items,
      }),
    }
  )
);
