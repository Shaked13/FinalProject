import axios from "axios";
import { AppDispatch } from "../../Store/Store";
import { setCart } from "../../Store/CartSlice";

interface CartItem {
    _id: string;
    shoeId: string;
    size: number;
    quantity: number;
    name: string;
    price: number;
    image: string;
}

// שליפת עגלה מהשרת
export const fetchCart = () => async (dispatch: AppDispatch) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const { data } = await axios.get("/api/cart", {
            headers: { "x-auth-token": `${token}` },
        });
        dispatch(setCart(data.items));
    } catch (err) {
        console.error("Error loading cart:", err);
    }
};

// הוספת מוצר לשרת
export const addToCartServer = (item: CartItem) => async (dispatch: AppDispatch) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const { data } = await axios.post(
            `/api/cart/${item.shoeId}/add`,
            {
                size: item.size,
                quantity: item.quantity,
            },
            {
                headers: { "x-auth-token": `${token}` },
            }
        );
        dispatch(setCart(data.items));
    } catch (err) {
        console.error("Error adding item to cart:", err);
    }
};

// הסרת מוצר מהשרת
export const removeFromCartServer = (id: string, size: number) => async (dispatch: AppDispatch) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const { data } = await axios.delete(`/api/cart/${id}/${size}`, {
            headers: { "x-auth-token": `${token}` },
        });
        dispatch(setCart(data.items));
    } catch (err) {
        console.error("Error removing item from cart:", err);
    }
};