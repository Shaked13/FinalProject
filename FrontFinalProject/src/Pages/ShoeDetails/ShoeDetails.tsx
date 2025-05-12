import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../Store/CartSlice";
import { addToCartAPI } from "../../Services/cartService";
import Swal from "sweetalert2";

interface Shoe {
    _id: string;
    category: string;
    name: string;
    brand: string;
    image: string;
    price: number;
    sizes: Array<{ size: number; inStock: boolean }>;
}

const ShoeDetails = () => {
    const { id } = useParams<{ id: string }>();
    const [shoeDetails, setShoeDetails] = useState<Shoe | null>(null);
    const [error, setError] = useState<string>("");
    const [isAdmin, setIsAdmin] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchShoe = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/shoes/${id}`);
                setShoeDetails(response.data);
            } catch (error) {
                setError("שגיאה בטעינת פרטי הנעל");
            }
        };

        const userData = localStorage.getItem("user");
        if (userData) setIsAdmin(JSON.parse(userData)?.isAdmin || false);

        fetchShoe();
    }, [id]);

    const handleAddToCart = async (size: number) => {
        if (!shoeDetails) return;

        const item = {
            _id: `cart-item-${shoeDetails._id}-${size}`,
            shoeId: shoeDetails._id,
            name: shoeDetails.name,
            size,
            price: shoeDetails.price,
            quantity: 1,
            image: shoeDetails.image,
        };
        try {
            await addToCartAPI(item);
            dispatch(addToCart(item));
            Swal.fire("הפריט נוסף לסל!", "", "success");
        } catch (err) {
            console.error("שגיאה בהוספת פריט לסל:", err);
            Swal.fire("שגיאה", "לא ניתן להוסיף לסל", "error");
        }
    };

    const handleEditClick = () => navigate(`/edit-shoes/${id}`);

    const handleDeleteClick = async () => {
        const backgroundColor = document.documentElement.classList.contains("dark") ? "#333333" : "#ffffff";
        const textColor = document.documentElement.classList.contains("dark") ? "#ffffff" : "#000000";

        Swal.fire({
            title: "Are you sure you want to delete this shoe?",
            icon: "warning",
            showCancelButton: true,
            cancelButtonColor: "#3085d6",
            confirmButtonColor: "#d33",
            confirmButtonText: "Yes!, Delete",
            cancelButtonText: "Cancel",
            background: backgroundColor,
            color: textColor
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://localhost:8080/shoes/${id}`, {
                        headers: { "x-auth-token": localStorage.getItem("token") || "" }
                    });
                    Swal.fire("Deleted!", "The shoe was successfully deleted", "success");
                    navigate("/");
                } catch (err) {
                    console.error("שגיאה במחיקת נעל:", err);
                    Swal.fire("שגיאה", "לא ניתן למחוק את הנעל", "error");
                }
            }
        });
    };

    if (error) return <div className="p-5 text-center text-red-500">{error}</div>;
    if (!shoeDetails) return <div className="p-5 text-center">טוען...</div>;

    return (
        <>
            <section className="flex flex-col items-center bg-gray-200 dark:bg-gray-700">
                <h1 style={{ fontSize: "3rem" }}> Shoe Details Page </h1>
            </section>

            <div className="p-5 dark:bg-gray-600">
                <div className="max-w-xl p-6 mx-auto mt-3 mb-3 bg-gray-200 rounded-lg shadow-sm dark:bg-gray-700">
                    <div className="mb-6 text-center">
                        <h1 className="text-xl font-medium text-black dark:text-white">{shoeDetails.name}</h1>
                        <img src={shoeDetails.image} alt={shoeDetails.name} className="object-contain w-48 h-48 mx-auto mt-4" />
                        <p className="mt-4 text-black dark:text-white">{shoeDetails.brand}</p>
                        <h3 className="mt-3 text-lg font-semibold text-green-600">Price: ₪{shoeDetails.price}</h3>
                    </div>

                    <div className="mt-5">
                        <h4 className="mb-3 text-xl font-semibold text-center text-black dark:text-white">Sizes:</h4>
                        {shoeDetails.sizes.map((sizeObj) => (
                            <div
                                key={`${shoeDetails._id}-${sizeObj.size}`}
                                className={`flex justify-between items-center p-3 mb-2 rounded-md ${sizeObj.inStock ? "bg-green-100" : "bg-red-100"}`}
                            >
                                <span className="text-sm text-gray-700">Size: {sizeObj.size}</span>
                                {sizeObj.inStock ? (
                                    <button
                                        onClick={() => handleAddToCart(sizeObj.size)}
                                        className="px-3 py-1 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700"
                                    >
                                        Add to Cart
                                    </button>
                                ) : (
                                    <span className="text-sm font-semibold text-red-600">Out of Stock   </span>
                                )}
                            </div>
                        ))}
                    </div>

                    {isAdmin && (
                        <div className="flex justify-center gap-4 mt-6">
                            <button
                                onClick={handleDeleteClick}
                                className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600"
                            >
                                Delete Shoe
                            </button>
                            <button
                                onClick={handleEditClick}
                                className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                            >
                                Edit Shoe
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ShoeDetails;