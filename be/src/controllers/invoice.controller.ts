import { Request, Response } from "express";
import Invoice from "../models/invoice.model";
import { Cart } from "../models/cart.model";
import { Product } from "../models/product.model";


export const createInvoice = async (req: Request, res: Response) => {
   try {
      const { userId, products } = req.body;

      if (!userId || !products || products.length === 0) {
         return res.status(400).json({
            success: false,
            message: "Missing required fields",
         });
      }

      for (const item of products) {
         const product = await Product.findById(item.productId);

         if (!product) {
            return res.status(404).json({
               success: false,
               message: `Product ${item.productId} not found`,
            });
         }

         if (product.stock < item.quantity) {
            return res.status(400).json({
               success: false,
               message: `Insufficient stock for product ${product.title}. Available: ${product.stock}, Requested: ${item.quantity}`,
            });
         }
      }

      for (const item of products) {
         await Product.findByIdAndUpdate(
            item.productId,
            { $inc: { stock: -item.quantity } }
         );
      }

      const totalAmount = products.reduce(
         (sum: number, item: any) => sum + item.price * item.quantity,
         0
      );

      const invoice = new Invoice({
         userId,
         products,
         totalAmount,
         status: "pending",
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

export const updateInvoiceStatus = async (req: Request, res: Response) => {
   try {
      const { id } = req.params;
      const { status } = req.body;

      if (!["pending", "paid", "cancelled"].includes(status)) {
         return res.status(400).json({
            success: false,
            message: "Invalid status value",
         });
      }

      const currentInvoice = await Invoice.findById(id);

      if (!currentInvoice) {
         return res.status(404).json({
            success: false,
            message: "Invoice not found",
         });
      }

      if (currentInvoice.status === "pending" && status === "cancelled") {
         for (const item of currentInvoice.products) {
            await Product.findByIdAndUpdate(
               item.productId,
               { $inc: { stock: item.quantity } }
            );
         }
      }

      const invoice = await Invoice.findByIdAndUpdate(
         id,
         { status },
         { new: true }
      )
         .populate("userId", "username")
         .populate("products.productId");

      res.status(200).json({
         success: true,
         message: "Invoice status updated successfully",
         data: invoice,
      });
   } catch (error: any) {
      res.status(500).json({
         success: false,
         message: error.message,
      });
   }
};
