import mongoose from "mongoose";
import Cart from "../models/cart.js";

export const getCartByUserId = async (userId) => {
    return await Cart.findOne({ userId }).populate("items.shoeId");
};

export const createOrUpdateCart = async (userId, newItem) => {
    const { shoeId, size, quantity, name, price, image } = newItem;
    if (!shoeId || !size || !quantity) {
        throw new Error("חסרים נתונים עבור פריט בעגלה.");
    }
    const objectId = new mongoose.Types.ObjectId(shoeId);
    const numericSize = Number(size);
    const numericQuantity = Number(quantity);
    let cart = await Cart.findOne({ userId });
    if (!cart) {
        cart = new Cart({
            userId,
            items: [{
                shoeId: objectId,
                size: numericSize,
                quantity: numericQuantity,
                name,
                price,
                image,
            }],
        });
    } else {
        const existingItem = cart.items.find(
            (item) =>
                item.shoeId.toString() === objectId.toString() &&
                item.size === numericSize
        );
        if (existingItem) {
            existingItem.quantity += numericQuantity;
        } else {
            cart.items.push({
                shoeId: objectId,
                size: numericSize,
                quantity: numericQuantity,
                name,
                price,
                image,
            });
        }
    }
    return await cart.save();
};

export const updateCartItemQuantity = async (userId, shoeId, size, action) => {
    const objectId = new mongoose.Types.ObjectId(shoeId);
    const numericSize = Number(size);
    const cart = await Cart.findOne({ userId });
    if (!cart) throw new Error("עגלה לא נמצאה עבור המשתמש");
    const itemIndex = cart.items.findIndex(
        (item) =>
            item.shoeId.toString() === objectId.toString() &&
            item.size === numericSize
    );
    if (itemIndex === -1) {
        throw new Error("הפריט לא נמצא בעגלה");
    }
    let newQuantity = cart.items[itemIndex].quantity;
    if (action === 'increase') {
        newQuantity += 1;
    } else if (action === 'decrease') {
        newQuantity -= 1;
        if (newQuantity <= 0) {
            return await removeItemFromCart(userId, shoeId, size);
        }
    }
    cart.items[itemIndex].quantity = newQuantity;
    return await cart.save();
};

export const removeItemFromCart = async (userId, shoeId, size) => {
    const objectId = new mongoose.Types.ObjectId(shoeId);
    const numericSize = Number(size);
    const cart = await Cart.findOne({ userId });
    if (!cart) throw new Error("עגלה לא נמצאה עבור המשתמש");
    cart.items = cart.items.filter(
        (item) =>
            item.shoeId.toString() !== objectId.toString() ||
            item.size !== numericSize
    );
    return await cart.save();
};

export const clearCart = async (userId) => {
    return await Cart.findOneAndUpdate({ userId }, { items: [] }, { new: true });
};