import { Request, Response } from "express";
import { Cart } from "../models/cart.model";
import { Types } from "mongoose";


export const getCart = async (req: Request, res: Response) => {
   try {
      const { userId } = req.params;

      if (!userId) {
         return res.status(400).json({ message: "User ID is required" });
      }

      let cart = await Cart.findOne({ userId: new Types.ObjectId(userId) }).populate("products.productId");

      if (!cart) {

         cart = new Cart({
            userId: new Types.ObjectId(userId),
            products: []
         });
         await cart.save();
      }

      res.status(200).json({ success: true, data: cart });
   } catch (error: any) {
      res.status(500).json({ message: error.message });
   }
};


export const addToCart = async (req: Request, res: Response) => {
   try {
      const { userId, productId, quantity = 1 } = req.body;

      if (!userId || !productId) {
         return res.status(400).json({ message: "User ID and Product ID are required" });
      }

      let cart = await Cart.findOne({ userId: new Types.ObjectId(userId) });

      if (!cart) {
         cart = new Cart({
            userId: new Types.ObjectId(userId),
            products: [{ productId: new Types.ObjectId(productId), quantity }]
         });
      } else {
         const productIndex = cart.products.findIndex(
            (p) => p.productId.toString() === productId
         );

         if (productIndex > -1) {
            cart.products[productIndex].quantity += quantity;
         } else {
            cart.products.push({ productId: new Types.ObjectId(productId), quantity });
         }
      }

      await cart.save();
      await cart.populate("products.productId");

      res.status(200).json({ success: true, data: cart });
   } catch (error: any) {
      res.status(500).json({ message: error.message });
   }
};

export const updateCartItem = async (req: Request, res: Response) => {
   try {
      const { userId, productId, quantity } = req.body;

      if (!userId || !productId || quantity === undefined) {
         return res.status(400).json({ message: "User ID, Product ID and Quantity are required" });
      }

      const cart = await Cart.findOne({ userId: new Types.ObjectId(userId) });

      if (!cart) {
         return res.status(404).json({ message: "Cart not found" });
      }

      const productIndex = cart.products.findIndex(
         (p) => p.productId.toString() === productId
      );

      if (productIndex === -1) {
         return res.status(404).json({ message: "Product not found in cart" });
      }

      if (quantity <= 0) {
         cart.products.splice(productIndex, 1);
      } else {
         cart.products[productIndex].quantity = quantity;
      }

      await cart.save();
      await cart.populate("products.productId");

      res.status(200).json({ success: true, data: cart });
   } catch (error: any) {
      res.status(500).json({ message: error.message });
   }
};

export const removeFromCart = async (req: Request, res: Response) => {
   try {
      const { userId, productId } = req.body;

      if (!userId || !productId) {
         return res.status(400).json({ message: "User ID and Product ID are required" });
      }

      const cart = await Cart.findOne({ userId: new Types.ObjectId(userId) });

      if (!cart) {
         return res.status(404).json({ message: "Cart not found" });
      }

      const filteredProducts = cart.products.filter(
         (p) => p.productId.toString() !== productId
      );
      cart.products.splice(0, cart.products.length, ...filteredProducts);

      await cart.save();
      await cart.populate("products.productId");

      res.status(200).json({ success: true, data: cart });
   } catch (error: any) {
      res.status(500).json({ message: error.message });
   }
};

export const clearCart = async (req: Request, res: Response) => {
   try {
      const { userId } = req.params;

      if (!userId) {
         return res.status(400).json({ message: "User ID is required" });
      }

      const cart = await Cart.findOne({ userId: new Types.ObjectId(userId) });

      if (!cart) {
         return res.status(404).json({ message: "Cart not found" });
      }

      cart.products.splice(0, cart.products.length);
      await cart.save();

      res.status(200).json({ success: true, data: cart });
   } catch (error: any) {
      res.status(500).json({ message: error.message });
   }
};
