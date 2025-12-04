import axios from "axios";

const axiosClient = axios.create({
   baseURL: "http://localhost:3000",
});

export const createInvoice = async (
   userId: string,
   products: { productId: string; quantity: number; price: number }[],
   clearCart: boolean = false
) => {
   try {
      const response = await axiosClient.post("/invoices", {
         userId,
         products,
         clearCart,
      });
      return response.data;
   } catch (error: any) {
      throw error;
   }
};

export const getInvoicesByUser = async (userId: string) => {
   try {
      const response = await axiosClient.get(`/invoices/user/${userId}`);
      return response.data;
   } catch (error: any) {
      throw error;
   }
};

export const getAllInvoices = async () => {
   try {
      const response = await axiosClient.get("/admin/invoices");
      return response.data;
   } catch (error: any) {
      throw error;
   }
};

export const updateInvoiceStatus = async (id: string, status: "pending" | "paid" | "cancelled") => {
   try {
      const response = await axiosClient.patch(`/admin/invoices/${id}/status`, { status });
      return response.data;
   } catch (error: any) {
      throw error;
   }
};
