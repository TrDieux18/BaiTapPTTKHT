import { Types } from "mongoose";
import { Product } from "../models/product.model";
import { Request, Response } from "express";

export const getAllProducts = async (req: Request, res: Response) => {
   try {
      const { page = '1', limit = '10', search = '', category = '' } = req.query;

      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;

      const query: any = {};

      if (search) {
         query.title = { $regex: search, $options: 'i' };
      }

      if (category && category !== 'all') {
         query.slug = { $regex: category, $options: 'i' };
      }

      const products = await Product.find(query)
         .skip(skip)
         .limit(limitNum)
         .sort({ createdAt: -1 });

      const total = await Product.countDocuments(query);
      const totalPages = Math.ceil(total / limitNum);

      res.status(200).json({
         success: true,
         data: products,
         totalPages,
         currentPage: pageNum,
         total
      });
   } catch (error: any) {
      res.status(500).json({ message: (error as Error).message });
   }
}

export const createProduct = async (req: Request, res: Response) => {
   try {
      const { title, description, price, discountPercentage, rating, stock, thumbnail, slug } = req.body;
      const newProduct = new Product({
         title,
         description,
         price,
         discountPercentage,
         rating,
         stock,
         thumbnail,
         slug
      });
      const savedProduct = await newProduct.save();
      res.status(201).json({ success: true, data: savedProduct });
   }
   catch (error: any) {
      res.status(500).json({ message: error.message });
   }
};

export const updateProduct = async (req: Request, res: Response) => {
   try {

      const { _id, title, description, price, discountPercentage, rating, stock, thumbnail, slug } = req.body;
      const updatedProduct = await Product.findByIdAndUpdate(
         _id,
         {
            title,
            description,
            price,
            discountPercentage,
            rating,
            stock,
            thumbnail,
            slug
         },
         { new: true }
      );

      if (!updatedProduct) {
         return res.status(404).json({ message: "Product not found" });
      }

      res.status(200).json({ success: true, data: updatedProduct });

   } catch (error: any) {
      res.status(500).json({ message: error.message });
   }
};


export const getProductById = async (req: Request, res: Response) => {
   try {
      const { id } = req.params;
      const product = await Product.findById({
         _id: new Types.ObjectId(id)
      });
      if (!product) {
         return res.status(404).json({ message: "Product not found" });
      }
      res.status(200).json({ success: true, data: product });
   } catch (error: any) {
      res.status(500).json({ message: error.message });
   }
};


export const deleteProduct = async (req: Request, res: Response) => {
   try {
      const { id } = req.params;
      const deletedProduct = await Product.findByIdAndDelete({
         _id: new Types.ObjectId(id)
      });
      if (!deletedProduct) {
         return res.status(404).json({ message: "Product not found" });
      }
      res.status(200).json({ success: true, message: "Product deleted successfully" });
   } catch (error: any) {
      res.status(500).json({ message: error.message });
   }
}