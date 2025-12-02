import type { Product } from "./Product";

export interface CartItem {
   productId: Product;
   quantity: number;
}

export interface Cart {
   _id: string;
   userId: string;
   products: CartItem[];
}

export interface LocalCartItem {
   _id: string;
   product: Product;
   quantity: number;
}