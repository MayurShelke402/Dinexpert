import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      cartItems: [],

      addToCart: (product, quantity = 1) => {
        const currentCart = get().cartItems;
        const existingItem = currentCart.find(item => item._id === product._id);

        if (existingItem) {
          // Increase quantity if already in cart
          const updatedCart = currentCart.map(item =>
            item._id === product._id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
          set({ cartItems: updatedCart });
         
          
        } else {
          // Add new item with default quantity
          set({ cartItems: [...currentCart, { ...product, quantity }] });
        }
      },

      decreaseQuantity: (id) => {
        const currentCart = get().cartItems;
        const updatedCart = currentCart
          .map(item =>
            item._id === id
              ? { ...item, quantity: item.quantity - 1 }
              : item
          )
          .filter(item => item.quantity > 0);
        set({ cartItems: updatedCart });
      },

      removeFromCart: (id) => {
        const currentCart = get().cartItems;
        set({ cartItems: currentCart.filter(item => item._id !== id) });
      },

      clearCart: () => set({ cartItems: [] }),

      getQuantityById: (id) => {
        const item = get().cartItems.find(item => item._id === id);
        return item?.quantity || 0;
      }
    }),
    {
      name: 'cart-storage', // 🗂 localStorage key
      getStorage: () => localStorage,
    }
  )
);

export default useCartStore;
