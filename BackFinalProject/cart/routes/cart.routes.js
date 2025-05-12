import { Router } from "express";
import {
    getCartByUserId,
    createOrUpdateCart,
    removeItemFromCart,
    clearCart,
    updateCartItemQuantity,
} from "../services/cartAccessData.service.js";
import { auth } from "../../middlewares/token.js";
import { createOrder } from "../../services/orderAccessData.service.js";
import mongoose from 'mongoose';

const cartRouter = Router();

cartRouter.get("/", auth, async (req, res) => {
    try {
        const cart = await getCartByUserId(req.user._id);
        res.json(cart || { items: [] });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch cart", error: err.message });
    }
});


cartRouter.post("/:shoeId/add", auth, async (req, res) => {
    try {
        const shoeId = req.params.shoeId;
        if (!mongoose.Types.ObjectId.isValid(shoeId)) {
            return res.status(400).json({ message: "shoeId לא תקני" });
        }
        const newItem = { ...req.body, shoeId };
        const cart = await createOrUpdateCart(req.user._id, newItem);
        res.json({ message: "הנעל נוספה בהצלחה", cart: cart });
    } catch (err) {
        res.status(500).json({ message: "Failed to add to cart", error: err.message });
    }
});

cartRouter.put("/:shoeId/:size/increase", auth, async (req, res) => {
    try {
        const { shoeId, size } = req.params;
        if (!mongoose.Types.ObjectId.isValid(shoeId)) {
            return res.status(400).json({ message: "shoeId לא תקני" });
        }
        const updatedCart = await updateCartItemQuantity(req.user._id, shoeId, size, "increase");
        res.json({ message: "הכמות הוגדלה", cart: updatedCart });
    } catch (err) {
        console.error("Error while increasing quantity:", err);
        res.status(500).json({ message: "שגיאה בהגדלת הכמות", error: err.message });
    }
});

cartRouter.put("/:shoeId/:size/decrease", auth, async (req, res) => {
    try {
        const { shoeId, size } = req.params;
        if (!mongoose.Types.ObjectId.isValid(shoeId)) {
            return res.status(400).json({ message: "shoeId לא תקני" });
        }
        const updatedCart = await updateCartItemQuantity(req.user._id, shoeId, size, "decrease");
        res.json({ message: "הכמות הופחתה", cart: updatedCart });
    } catch (err) {
        console.error("Error while decreasing quantity:", err);
        res.status(500).json({ message: "שגיאה בהפחתת הכמות", error: err.message });
    }
});

cartRouter.delete("/:shoeId/:size/remove", auth, async (req, res) => {
    try {
        const { shoeId, size } = req.params;
        if (!mongoose.Types.ObjectId.isValid(shoeId)) {
            return res.status(400).json({ message: "shoeId לא תקני" });
        }
        const updatedCart = await removeItemFromCart(req.user._id, shoeId, size);
        res.json({ message: "המידה הוסרה בהצלחה", cart: updatedCart });
    } catch (err) {
        res.status(500).json({ message: "Failed to remove item", error: err.message });
    }
});

cartRouter.delete("/clear", auth, async (req, res) => {
    try {
        const clearedCart = await clearCart(req.user._id);
        res.json({ message: "העגלה נמחקה בהצלחה", cart: clearedCart });
    } catch (err) {
        res.status(500).json({ message: "Failed to clear cart", error: err.message });
    }
});

cartRouter.post("/checkout", auth, async (req, res) => {
    try {
        const { name, address, phone } = req.body;
        const userId = req.user._id;

        const cart = await getCartByUserId(userId);
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Your cart is empty" });
        }

        console.log("Cart items:", cart.items);

        const order = await createOrder(userId, name, address, phone, cart.items);

        await clearCart(userId);

        res.status(200).json({ message: "Checkout successful", order });
    } catch (err) {
        console.error("Error during checkout:", err);
        res.status(500).json({ message: "Failed to process checkout", error: err.message });
    }
});

export default cartRouter;