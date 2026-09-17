import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product, CartItem, CoffeeWeight, GrindOption } from '../types';

interface CartState {
  cart: CartItem[];
  addToCart: (product: Product, selectedWeight?: CoffeeWeight, selectedGrind?: GrindOption) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      addToCart: (product, selectedWeight = 250, selectedGrind = 'In the grains') => {
        const { cart } = get();
        const priceMultiplier = selectedWeight === 1000 ? 3.6 : 1;
        const itemPrice = Math.round(product.price * priceMultiplier);
        const cartItemId = `${product.id}-${selectedWeight}-${selectedGrind}`;
        const existingItemIndex = cart.findIndex((item) => item.cartItemId === cartItemId);
        if (existingItemIndex > -1) {
          const updatedCart = [...cart];
          updatedCart[existingItemIndex].quantity += 1;
          set({ cart: updatedCart });
        } else {
          set({
            cart: [
              ...cart,
              {
                cartItemId,
                id: product.id,
                title: product.title,
                image: product.image,
                price: itemPrice,
                weight: selectedWeight,
                grind: selectedGrind,
                quantity: 1,
              },
            ],
          });
        }
      },
      updateQuantity: (cartItemId, delta) => {
        const { cart } = get();
        const updatedCart = cart
          .map((item) => {
            if (item.cartItemId === cartItemId) {
              const newQuantity = item.quantity + delta;
              return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
            }
            return item;
          })
          .filter((item): item is CartItem => item !== null);
        set({ cart: updatedCart });
      },
      removeFromCart: (cartItemId) => {
        set({ cart: get().cart.filter((item) => item.cartItemId !== cartItemId) });
      },
      clearCart: () => set({ cart: [] }),
      getTotalItems: () => {
        return get().cart.reduce((total, item) => total + item.quantity, 0);
      },
      getTotalPrice: () => {
        return get().cart.reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),
    {
      name: 'coffee-cart-storage',
    },
  ),
);
