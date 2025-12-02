import axios from "axios";

const axiosClient = axios.create({
   baseURL: "http://localhost:3000",
});

export const getAllProducts = async (params?: Record<string, string>) => {
   try {
      const response = await axiosClient.get("/products", { params });
      return response.data;
   } catch (error: any) {
      throw error;
   }
};

export const getProductById = async (id: string) => {
   try {
      const response = await axiosClient.get(`/products/${id}`);
      return response.data;
   } catch (error: any) {
      throw error;
   }
};



export const updateProduct = async (productData: any) => {
   try {
      const response = await axiosClient.patch(
         `/admin/products/edit`,
         productData
      );
      return response.data;
   } catch (error: any) {
      throw error;
   }
}

export const createProduct = async (productData: any) => {
   try {
      const response = await axiosClient.post("/admin/products/new", productData);
      return response.data;
   } catch (error: any) {
      throw error;
   }
};

export const deleteProduct = async (id: string) => {
   try {
      const response = await axiosClient.delete(`/admin/products/delete/${id}`);
      return response.data;
   } catch (error: any) {
      throw error;
   }
}