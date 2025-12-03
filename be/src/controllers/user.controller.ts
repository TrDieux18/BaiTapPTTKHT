
import { User } from "../models/user.model";
import { Request, Response } from "express";

export const login = async (req: Request, res: Response) => {
   try {
      const { username, password } = req.body;

      const user = await User.findOne({ username: username, isActive: true });

      if (!user) {
         return res.status(404).json({ success: false, message: "User not found" });
      }
      if (user.password !== password) {
         return res.status(401).json({ success: false, message: "Invalid credentials" });
      }

      return res.status(200).json({ success: true, data: user });

   } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
   }
};

export const register = async (req: Request, res: Response) => {
   try {
      const { username, password } = req.body;

      if (!username || !password) {
         return res.status(400).json({ success: false, message: "Username and password are required" });
      }

      const existingUser = await User.findOne({ username });
      if (existingUser) {
         return res.status(409).json({ success: false, message: "Username already exists" });
      }

      const newUser = new User({
         username,
         password,
         role: "user",
         isActive: true,
      });

      await newUser.save();

      return res.status(201).json({
         success: true,
         message: "User registered successfully",
         data: newUser
      });

   } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
   }
};