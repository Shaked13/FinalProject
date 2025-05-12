import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getCart,
    decreaseCartQty,
    increaseCartQty,
    removeFromCartAPI,
    clearCartAPI,
} from "../../Services/cartService";
import axios from "axios";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { setCart } from "../../Store/CartSlice";

interface CartItem {
    _id: string;
    shoeId: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    size: number;
}

const Cart = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [customerInfo, setCustomerInfo] = useState({
        name: "",
        address: "",
        phone: "",
    });
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();


    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const response = await getCart();
            setCartItems(response.items);
            dispatch(setCart(response.items));
        } catch (err) {
            console.error("Failed to fetch cart:", err);
        }
    };

    const handleRemove = async (shoeId: string, size: number) => {
        try {
            await removeFromCartAPI(shoeId, size);
            fetchCart();
        } catch (err) {
            console.error(err);
        }
    };

    const handleIncrease = async (shoeId: any, size: number) => {
        const item = cartItems.find(i => i.shoeId === shoeId && i.size === size);
        if (!item) return;
        try {
            await increaseCartQty(shoeId._id, size, item.quantity + 1);
            fetchCart();
        } catch (err) {
            console.error("Error increasing quantity:", err);
        }
    };

    const handleDecrease = async (shoeId: any, size: number) => {
        const item = cartItems.find(i => i.shoeId === shoeId && i.size === size);
        if (!item) return;
        try {
            if (item.quantity <= 1) {
                console.log("Cannot decrease quantity below 1");
                return;
            }
            await decreaseCartQty(shoeId._id, size, item.quantity - 1);
            fetchCart();
        } catch (err) {
            console.error("Error decreasing quantity:", err);
        }
    };

    const handleClearCart = async () => {
        try {
            await clearCartAPI();
            fetchCart();
        } catch (err) {
            console.error(err);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCustomerInfo(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCheckout = async () => {
        if (!customerInfo.name || !customerInfo.address || !customerInfo.phone) {
            alert("Please fill in all fields.");
            return;
        }
        setLoading(true);

        Swal.fire({
            title: "Are you sure?",
            text: "You are about to proceed to checkout.",
            icon: "warning",
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, proceed",
            cancelButtonText: "No, cancel",
            background: '#6d6d6d',
            color: '#ffffff',
        }).then((result) => {
            if (result.isConfirmed) {
                try {
                    localStorage.setItem("cartItems", JSON.stringify(cartItems));

                    navigate("/confirmation", {
                        state: {
                            orderData: {
                                customerInfo,
                                cartItems,
                                total: totalPrice,
                            },
                        },
                    });
                } catch (err: unknown) {
                    if (axios.isAxiosError(err)) {
                        console.error("Checkout failed:", err.response || err.message);
                    } else {
                        console.error("Checkout failed:", err);
                    }
                    alert("Something went wrong. Please try again.");
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        });
    };

    const totalPrice = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );

    return (
        <div className=" dark:bg-gray-500">
            <div className="max-w-3xl p-6 mx-auto bg-gray-400 rounded shadow dark:bg-gray-600">
                <h2 className="mb-6 text-2xl font-semibold">🛒 Your Cart</h2>
                {cartItems.length === 0 ? (
                    <p>Your cart is empty.</p>
                ) : (
                    <>
                        <div className="space-y-4">
                            {cartItems.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between gap-4 p-4 rounded-md shadow-sm bg-gray-50"
                                >
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="object-cover w-16 h-16 rounded"
                                    />
                                    <div className="flex-1">
                                        <h3 className="text-lg font-medium">{item.name}</h3>
                                        <p className="text-sm text-gray-600">Size: {item.size}</p>
                                        <p className="text-sm text-gray-600">
                                            Price: ₪{item.price.toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleDecrease(item.shoeId, item.size)}
                                            className="px-2 py-1 text-sm bg-gray-200 rounded"
                                        >
                                            -
                                        </button>
                                        <span className="w-6 text-center">{item.quantity}</span>
                                        <button
                                            onClick={() => handleIncrease(item.shoeId, item.size)}
                                            className="px-2 py-1 text-sm bg-gray-200 rounded"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => handleRemove(item.shoeId, item.size)}
                                        className="text-sm text-red-500 hover:underline"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 text-right">
                            <p className="text-xl font-semibold dark:text-green-500">Total: ₪{totalPrice.toFixed(2)}</p>
                        </div>
                    </>
                )}

                <div className="mt-8">
                    <h3 className="text-lg font-semibold">Customer Information</h3>
                    <div className="mt-4 space-y-4">
                        <input
                            type="text"
                            name="name"
                            placeholder="Your Name"
                            value={customerInfo.name}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                        />
                        <input
                            type="text"
                            name="address"
                            placeholder="Shipping Address"
                            value={customerInfo.address}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                        />
                        <input
                            type="text"
                            name="phone"
                            placeholder="Phone Number"
                            value={customerInfo.phone}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div className="mt-6 text-right">
                        <button
                            onClick={handleCheckout}
                            className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded hover:bg-green-600"
                            disabled={loading}
                        >
                            {loading ? "Processing..." : "Proceed to Checkout"}
                        </button>
                    </div>
                </div>

                <div className="mt-6">
                    <button
                        onClick={handleClearCart}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600"
                    >
                        Clear Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cart;