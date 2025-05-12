import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
    _id: string;
    shoeId: string;
    size: number;
    quantity: number;
    name: string;
    price: number;
    image: string;
}

interface CartState {
    cartItems: CartItem[];
}

const initialState: CartState = {
    cartItems: [],
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart(state, action: PayloadAction<CartItem>) {
            const item = action.payload;
            const existingItem = state.cartItems.find((cartItem) => cartItem._id === item._id);
            if (existingItem) {
                existingItem.quantity += item.quantity;
            } else {
                state.cartItems.push(item);
            }
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },
        removeFromCart(state, action: PayloadAction<string>) {
            state.cartItems = state.cartItems.filter((item) => item._id !== action.payload);
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },
        setCart(state, action: PayloadAction<CartItem[]>) {
            state.cartItems = action.payload;
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },
        loadCart(state) {
            const savedCartItems = localStorage.getItem('cartItems');
            if (savedCartItems) {
                try {
                    const parsedItems = JSON.parse(savedCartItems);
                    if (Array.isArray(parsedItems)) {
                        state.cartItems = parsedItems;
                    }
                } catch (error) {
                    console.error('Error parsing cart items from localStorage', error);
                }
            }
        },
        clearCart(state) {
            state.cartItems = [];
            localStorage.removeItem('cartItems');
        },
    },
});

export const { addToCart, removeFromCart, setCart, loadCart, clearCart } = cartSlice.actions;

export const selectCartItems = (state: any) => state.cart.cartItems;

export default cartSlice.reducer;