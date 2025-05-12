import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Swal from "sweetalert2";
import { clearCartAPI } from "../../Services/cartService";
import { useDispatch } from "react-redux";
import { clearCart } from "../../Store/CartSlice";

const Confirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const orderData = location.state?.orderData;

    useEffect(() => {
        if (!orderData) {
            navigate("/");
        }
    }, [orderData, navigate]);

    const handlePayment = async () => {
        Swal.fire({
            title: 'Are you sure you want to complete the purchase?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            reverseButtons: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await clearCartAPI();
                    dispatch(clearCart());
                    Swal.fire('Thank you for your purchase!', '', 'success');
                    navigate("/");
                } catch (error) {
                    console.error("Error during payment:", error);
                    Swal.fire('Something went wrong, please try again later.', '', 'error');
                }
            }
        });
    };

    if (!orderData) return null;

    const { customerInfo, cartItems, total } = orderData;

    return (
        <div className="flex dark:bg-gray-600">
            <div className="max-w-3xl p-8 mx-auto mt-3 mb-3 bg-gray-400 border border-gray-200 shadow-xl w-[45%] dark:bg-gray-700 rounded-xl">
                <div className="space-y-6 text-left">
                    <h2 className="text-3xl font-semibold text-green-600">✅ Thank you for your order!</h2>

                    <div className="p-4 rounded-lg shadow-inner bg-gray-50">
                        <h3 className="text-xl font-semibold text-gray-800">Customer Details</h3>
                        <p className="text-gray-700">Name: <span className="font-medium">{customerInfo.name}</span></p>
                        <p className="text-gray-700">Address: <span className="font-medium">{customerInfo.address}</span></p>
                        <p className="text-gray-700">Phone: <span className="font-medium">{customerInfo.phone}</span></p>
                    </div>

                    <div className="p-4 rounded-lg shadow-inner bg-gray-50">
                        <h3 className="text-xl font-semibold text-gray-800">Ordered Products</h3>
                        <ul className="space-y-4">
                            {cartItems.map((item: any, idx: number) => (
                                <li key={idx} className="p-4 transition-shadow duration-200 bg-white border border-gray-300 rounded-lg shadow-md hover:shadow-lg">
                                    <p className="text-lg font-semibold text-gray-800">👟 {item.name} (Size {item.size})</p>
                                    <p className="text-gray-600">Quantity: {item.quantity}</p>
                                    <p className="text-gray-600">Price: ₪{item.price}</p>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="p-4 text-right bg-gray-100 rounded-lg shadow-lg">
                        <p className="text-2xl font-bold text-gray-800">Total to Pay: <span className="text-green-600">₪{total.toFixed(2)}</span></p>
                    </div>

                    <div className="flex justify-center mt-8">
                        <button
                            onClick={handlePayment}
                            className="px-6 py-2 font-semibold text-white transition duration-200 bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none"
                        >
                            Pay
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Confirmation;