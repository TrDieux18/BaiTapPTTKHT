import axios from "axios";

const axiosClient = axios.create({
   baseURL: "http://localhost:3000",
});

const getUserId = (): string => {
   const userStr = localStorage.getItem('user');
   if (userStr) {
      const user = JSON.parse(userStr);
      return user._id || user.id || '';
   }
   return '';
};

export const getCart = async () => {
   try {
      const userId = getUserId();
      if (!userId) {
         throw new Error("User not logged in");
      }
      const response = await axiosClient.get(`/cart/${userId}`);
      return response.data;
   } catch (error: any) {
      throw error;
   }
};

export const addToCart = async (productId: string, quantity: number = 1) => {
   try {
      const userId = getUserId();
      if (!userId) {
         throw new Error("User not logged in");
      }
      const response = await axiosClient.post("/cart/add", {
         userId,
         productId,
         quantity,
      });
      return response.data;
   } catch (error: any) {
      throw error;
   }
};

export const updateCartItem = async (productId: string, quantity: number) => {
   try {
      const userId = getUserId();
      if (!userId) {
         throw new Error("User not logged in");
      }
      const response = await axiosClient.patch("/cart/update", {
         userId,
         productId,
         quantity,
      });
      return response.data;
   } catch (error: any) {
      throw error;
   }
};

export const removeFromCart = async (productId: string) => {
   try {
      const userId = getUserId();
      if (!userId) {
         throw new Error("User not logged in");
      }
      const response = await axiosClient.delete("/cart/remove", {
         data: { userId, productId },
      });
      return response.data;
   } catch (error: any) {
      throw error;
   }
};

export const clearCart = async () => {
   try {
      const userId = getUserId();
      if (!userId) {
         throw new Error("User not logged in");
      }
      const response = await axiosClient.delete(`/cart/clear/${userId}`);
      return response.data;
   } catch (error: any) {
      throw error;
   }
};
