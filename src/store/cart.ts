import { create } from "zustand";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  type: "one-time" | "monthly";
  description: string;
};

type CartStore = {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  openCart: () => void;
  closeCart: () => void;
  total: () => number;
};

export const useCart = create<CartStore>((set, get) => ({
  items: [],
  isOpen: false,

  addItem: (item) => {
    const existing = get().items.find((i) => i.id === item.id);
    if (existing) {
      // Already in cart, just open it
      set({ isOpen: true });
      return;
    }
    set((state) => ({ items: [...state.items, item], isOpen: true }));
  },

  removeItem: (id) =>
    set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),

  total: () =>
    get().items.reduce((sum, item) => sum + item.price, 0),
}));
