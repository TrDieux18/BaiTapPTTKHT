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