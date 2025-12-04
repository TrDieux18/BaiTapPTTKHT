import axios from "axios";

const axiosClient = axios.create({
   baseURL: "http://localhost:3000",

});

export const loginUser = async (username: string, password: string) => {
   try {
      const response = await axiosClient.post("/login", { username, password });
      return response.data;
   } catch (error: any) {
      throw error;
   }
};

export const registerUser = async (username: string, password: string) => {
   try {
      const response = await axiosClient.post("/register", { username, password });
      return response.data;
   } catch (error: any) {
      throw error;
   }
};

export const getAllUsers = async (params?: Record<string, string>) => {
   try {
      const response = await axiosClient.get("/admin/users", { params });
      return response.data;
   } catch (error: any) {
      throw error;
   }
};

export const getProfile = async (id: string) => {
   try {
      const response = await axiosClient.get(`/profile/${id}`);
      return response.data;
   } catch (error: any) {
      throw error;
   }
};

export const updateUser = async (id: string, data: any) => {
   try {
      const response = await axiosClient.patch(`/admin/users/${id}`, data);
      return response.data;
   } catch (error: any) {
      throw error;
   }
};

export const updateProfile = async (id: string, data: any) => {
   try {
      const response = await axiosClient.patch(`/profile/${id}`, data);
      return response.data;
   } catch (error: any) {
      throw error;
   }
};

export const deleteUser = async (id: string) => {
   try {
      const response = await axiosClient.delete(`/admin/users/${id}`);
      return response.data;
   } catch (error: any) {
      throw error;
   }
};