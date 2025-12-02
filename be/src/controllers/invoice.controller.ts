import { Request, Response } from "express";
import Invoice from "../models/invoice.model";
import { Cart } from "../models/cart.model";


export const createInvoice = async (req: Request, res: Response) => {
   try {
      const { userId, products } = req.body;

      if (!userId || !products || products.length === 0) {
         return res.status(400).json({
            success: false,
            message: "Missing required fields",
         });
      }

      const totalAmount = products.reduce(
         (sum: number, item: any) => sum + item.price * item.quantity,
         0
      );

      const invoice = new Invoice({
         userId,
         products,
         totalAmount,
      });

      await invoice.save();

      if (req.body.clearCart) {
         await Cart.findOneAndUpdate({ userId }, { products: [] });
      }

      res.status(201).json({
         success: true,
         message: "Đặt hàng thành công",
         data: invoice,
      });
   } catch (error: any) {
      res.status(500).json({
         success: false,
         message: error.message,
      });
   }
};

export const getInvoicesByUser = async (req: Request, res: Response) => {
   try {
      const { userId } = req.params;

      const invoices = await Invoice.find({ userId })
         .populate("products.productId")
         .sort({ createdAt: -1 });

      res.status(200).json({
         success: true,
         data: invoices,
      });
   } catch (error: any) {
      res.status(500).json({
         success: false,
         message: error.message,
      });
   }
};

export const getAllInvoices = async (req: Request, res: Response) => {
   try {
      const invoices = await Invoice.find()
         .populate("userId", "username email")
         .populate("products.productId")
         .sort({ createdAt: -1 });

      res.status(200).json({
         success: true,
         data: invoices,
      });
   } catch (error: any) {
      res.status(500).json({
         success: false,
         message: error.message,
      });
   }
};
