import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Cart, CartItem } from "@/types/Cart";
import type { Product } from "@/types/Product";

interface LocalCartItem {
   _id: string;
   product: Product;
   quantity: number;
}

type CartState = LocalCartItem[];

const initialState: CartState = [];

const cartSlice = createSlice({
   name: "cart",
   initialState,
   reducers: {
      setCart: (_state, action: PayloadAction<Cart>) => {
         const cartData = action.payload;
         const localCart: LocalCartItem[] = cartData.products.map((item: CartItem) => ({
            _id: item.productId._id,
            product: item.productId,
            quantity: item.quantity,
         }));
         return localCart;
      },
      removeFromCart: (state, action: PayloadAction<{ productId: string }>) => {
         return state.filter(item => item._id !== action.payload.productId);
      },
      clearCart: () => {
         return [];
      },
      updateQuantity: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
         const item = state.find(i => i._id === action.payload.productId);
         if (item) {
            item.quantity = action.payload.quantity;
         }
      },
   },
});

export const { setCart, removeFromCart, clearCart, updateQuantity } = cartSlice.actions;
export default cartSlice.reducer;
