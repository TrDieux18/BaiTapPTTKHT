
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

export const getAllUsers = async (req: Request, res: Response) => {
   try {
      const { page = 1, limit = 10, search = "" } = req.query;

      const query: any = {};
      if (search) {
         query.username = { $regex: search, $options: "i" };
      }

      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;

      const users = await User.find(query)
         .select("-password")
         .sort({ createdAt: -1 })
         .skip(skip)
         .limit(limitNum);

      const total = await User.countDocuments(query);

      return res.status(200).json({
         success: true,
         data: users,
         total,
         totalPages: Math.ceil(total / limitNum),
         currentPage: pageNum,
      });

   } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
   }
};

export const getUserById = async (req: Request, res: Response) => {
   try {
      const { id } = req.params;

      const user = await User.findById(id).select("-password");

      if (!user) {
         return res.status(404).json({ success: false, message: "User not found" });
      }

      return res.status(200).json({ success: true, data: user });

   } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
   }
};

export const updateUser = async (req: Request, res: Response) => {
   try {
      const { id } = req.params;
      const { username, password, role, isActive } = req.body;

      const user = await User.findById(id);
      if (!user) {
         return res.status(404).json({ success: false, message: "User not found" });
      }

      if (username && username !== user.username) {
         const existingUser = await User.findOne({ username });
         if (existingUser) {
            return res.status(409).json({ success: false, message: "Username already exists" });
         }
         user.username = username;
      }

      if (password) user.password = password;
      if (role) user.role = role;
      if (typeof isActive === "boolean") user.isActive = isActive;

      await user.save();

      const updatedUser = await User.findById(id).select("-password");

      return res.status(200).json({
         success: true,
         message: "User updated successfully",
         data: updatedUser
      });

   } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
   }
};

export const deleteUser = async (req: Request, res: Response) => {
   try {
      const { id } = req.params;

      const user = await User.findByIdAndDelete(id);

      if (!user) {
         return res.status(404).json({ success: false, message: "User not found" });
      }

      return res.status(200).json({
         success: true,
         message: "User deleted successfully"
      });

   } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
   }
};