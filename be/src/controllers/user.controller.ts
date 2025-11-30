
import { User } from "../models/user.model";
import { Request, Response } from "express";
export const login = async (req: Request, res: Response) => {
   try {
      const { username, password } = req.body;


      const user = await User.findOne({ username: username, isActive: true });
      

      if (!user) {
         return res.status(404).json({ message: "User not found" });
      }
      if (user.password !== password) {
         return res.status(401).json({ message: "Invalid credentials" });
      }

      return res.status(200).json({ success: true, data: user });

   } catch (error: any) {
      res.status(500).json({ message: error.message });
   }
};