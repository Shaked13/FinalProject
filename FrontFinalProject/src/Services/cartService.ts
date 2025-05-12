import axios from 'axios';

interface CartItem {
    _id: string;
    shoeId: string;
    size: number;
    quantity: number;
    name: string;
    price: number;
    image: string;
}

interface CartResponse {
    items: CartItem[];
}

const BASE_URL = "http://localhost:8080/cart";

const getToken = () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token");
    return token;
};

const saveCartToLocalStorage = (cartItems: CartItem[]) => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
};

const loadCartFromLocalStorage = (): CartItem[] => {
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : [];
};

export const getCart = async (): Promise<CartResponse> => {
    try {
        const res = await axios.get(BASE_URL, {
            headers: { "x-auth-token": `${getToken()}` },
        });
        return res.data || { items: [] };
    } catch (err) {
        console.error("getCart error:", err);
        return { items: [] };
    }
};

export const addToCartAPI = async (item: CartItem) => {
    try {
        const res = await axios.post(`${BASE_URL}/${item.shoeId}/add`, item, {
            headers: { "x-auth-token": `${getToken()}` },
        });

        const updatedCart = loadCartFromLocalStorage();
        updatedCart.push(item);
        saveCartToLocalStorage(updatedCart);

        return res.data;
    } catch (err) {
        console.error("addToCartAPI error:", err);
        throw err;
    }
};

export const updateCartQty = async (shoeId: string | { id: string }, size: number, quantity: number) => {
    const shoeIdStr = typeof shoeId === "object" && shoeId?.id ? shoeId.id : String(shoeId);
    const url = `${BASE_URL}/${shoeIdStr}/${size}/increase`;

    try {
        const res = await axios.put(url, { quantity }, {
            headers: { "x-auth-token": `${getToken()}` },
        });
        return res.data;
    } catch (err) {
        console.error("updateCartQty error:", err);
        throw err;
    }
};

export const increaseCartQty = async (shoeId: string | { id: string }, size: number, quantity: number) => {
    const shoeIdStr = typeof shoeId === "object" && shoeId?.id ? shoeId.id : String(shoeId);
    try {
        const res = await axios.put(`${BASE_URL}/${shoeIdStr}/${size}/increase`, { quantity }, {
            headers: { "x-auth-token": `${getToken()}` },
        });
        return res.data;
    } catch (err) {
        console.error("increaseCartQty error:", err);
        throw err;
    }
};

export const decreaseCartQty = async (shoeId: string | { id: string }, size: number, quantity: number) => {
    const shoeIdStr = typeof shoeId === "object" && shoeId?.id ? shoeId.id : String(shoeId);
    try {
        const res = await axios.put(`${BASE_URL}/${shoeIdStr}/${size}/decrease`, { quantity }, {
            headers: { Authorization: `x-auth-token ${getToken()}` },
        });
        return res.data;
    } catch (err) {
        console.error("decreaseCartQty error:", err);
        throw err;
    }
};

export const removeFromCartAPI = async (shoeId: string | { _id: string }, size: number) => {
    const shoeIdStr = typeof shoeId === "object" && shoeId?._id ? shoeId._id : String(shoeId);
    try {
        await axios.delete(`${BASE_URL}/${shoeIdStr}/${size}/remove`, {
            headers: { "x-auth-token": `${getToken()}` },

        });
    } catch (err) {
        console.error("removeFromCartAPI error:", err);
        throw err;
    }
};

export const clearCartAPI = async () => {
    try {
        await axios.delete(`${BASE_URL}/clear`, {
            headers: { "x-auth-token": `${getToken()}` },

        });
    } catch (err) {
        console.error("clearCartAPI error:", err);
        throw err;
    }
};

export const checkoutAPI = async (
    customerInfo: { name: string; address: string; phone: string },
    cartItems: CartItem[]
) => {
    try {
        const { name, address, phone } = customerInfo;

        const res = await axios.post(
            `${BASE_URL}/checkout`,
            {
                name,
                address,
                phone,
                cartItems,
            },
            {
                headers: { "x-auth-token": `${getToken()}` },

            }
        );
        return res.data;
    } catch (err) {
        console.error("checkoutAPI error:", err);
        throw err;
    }
};