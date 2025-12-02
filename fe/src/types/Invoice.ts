import type { Product } from "./Product";
import type { User } from "./User";

export interface Invoice {
   _id: string;
   userId: string | Pick<User, "_id" | "username">;
   products: {
      productId: string | Product;
      quantity: number;
      price: number;
   }[];
   totalAmount: number;
   createdAt: string;
}
