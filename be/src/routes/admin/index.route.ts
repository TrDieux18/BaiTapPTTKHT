import { createProduct, deleteProduct, updateProduct } from "../../controllers/product.controller";
import express from "express";
const router = express.Router();

router.post("/products/new", createProduct)
router.patch("/products/edit", updateProduct)
router.delete("/products/delete/:id", deleteProduct);
export default router;
