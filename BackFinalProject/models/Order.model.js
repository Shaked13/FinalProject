import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    shoeId: { type: mongoose.Schema.Types.ObjectId, ref: "Shoe", required: true },
    size: { type: Number, required: true },
    quantity: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    items: [orderItemSchema],
    createdAt: { type: Date, default: Date.now },
});

const OrderModel = mongoose.model("Order", orderSchema);
export default OrderModel;