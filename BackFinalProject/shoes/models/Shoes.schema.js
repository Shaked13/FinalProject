import { Schema, model } from "mongoose";

const shoeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    sizes: [
        {
            size: {
                type: Number,
                required: true
            },
            inStock: {
                type: Boolean,
                required: true
            }
        }
    ],
    category: {
        type: String,
        enum: ["men", "women", "kids"],
        required: true
    },
    description: {
        type: String
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});

export default model("Shoe", shoeSchema);
