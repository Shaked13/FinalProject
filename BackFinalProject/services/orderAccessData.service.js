import OrderModel from "../models/Order.model.js";

export const createOrder = async (userId, name, address, phone, items) => {
    const newOrder = new OrderModel({
        userId,
        name,
        address,
        phone,
        items,
        createdAt: new Date(),
    });
    return await newOrder.save();
};
