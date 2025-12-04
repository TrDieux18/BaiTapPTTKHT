import { createProduct, deleteProduct, updateProduct } from "../../controllers/product.controller";
import { getAllInvoices, updateInvoiceStatus } from "../../controllers/invoice.controller";
import { getAllUsers, updateUser, deleteUser } from "../../controllers/user.controller";
import express from "express";
const router = express.Router();

router.post("/products/new", createProduct)
router.patch("/products/edit", updateProduct)
router.delete("/products/delete/:id", deleteProduct);

router.get("/invoices", getAllInvoices);
router.patch("/invoices/:id/status", updateInvoiceStatus);

router.get("/users", getAllUsers);
router.patch("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

export default router;
