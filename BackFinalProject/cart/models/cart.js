import { Schema, model } from "mongoose";

const cartItemSchema = new Schema(
    {
        shoeId: {
            type: Schema.Types.ObjectId,
            ref: "Shoe",
            required: true,
        },
        size: {
            type: Number,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
        name: {
            type: String,
        },
        price: {
            type: Number,
        },
        image: {
            type: String,
        },
    },
    { _id: false }
);

const cartSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        items: [cartItemSchema],
    },
    { timestamps: true }
);

export default model("Cart", cartSchema);