import { getAllProducts, getProductById } from "../../controllers/product.controller";
import { login } from "../../controllers/user.controller";
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from "../../controllers/cart.controller";
import express from "express";
const router = express.Router();

router.post("/login", login);
router.get("/products", getAllProducts);
router.get("/products/:id", getProductById);


router.get("/cart/:userId", getCart);
router.post("/cart/add", addToCart);
router.patch("/cart/update", updateCartItem);
router.delete("/cart/remove", removeFromCart);
router.delete("/cart/clear/:userId", clearCart);

export default router;
