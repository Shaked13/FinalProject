import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

interface Shoe {
    _id: string;
    name: string;
    brand: string;
    image: string;
    price: number;
    sizes: Array<{ size: number; inStock: boolean }>;
}

const EditShoes = () => {
    const { id } = useParams<{ id: string }>();
    const [shoeDetails, setShoeDetails] = useState<Shoe | null>(null);
    const [error, setError] = useState<string>("");
    const navigate = useNavigate();

    useEffect(() => {
        if (!id) {
            setError("ID של הנעל חסר");
            return;
        }

        const fetchShoe = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/shoes/${id}`);
                setShoeDetails(response.data);
            } catch (error) {
                setError("לא הצלחנו לטעון את פרטי הנעל");
                console.error(error);
            }
        };

        fetchShoe();
    }, [id]);

    const handleUpdateShoe = async () => {
        if (!shoeDetails) return;

        try {
            await axios.put(`http://localhost:8080/shoes/${id}`, shoeDetails);
            Swal.fire({
                icon: "success",
                title: "Shoe details updated successfully",
                showConfirmButton: false,
                timerProgressBar: true,
                timer: 2000,
                showCloseButton: true
            });
            navigate(`/shoeDetails/${id}`);
        } catch (error) {
            console.error("Error updating shoe:", error);
            Swal.fire({
                title: "We were unable to update the shoe!",
                icon: "error",
                timerProgressBar: true,
                timer: 2000,
                toast: true,
                showCloseButton: true
            });
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (shoeDetails) {
            setShoeDetails({
                ...shoeDetails,
                [e.target.name]: e.target.value,
            });
        }
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (shoeDetails) {
            setShoeDetails({
                ...shoeDetails,
                price: parseFloat(e.target.value),
            });
        }
    };

    const handleSizeChange = (index: number, size: number) => {
        if (shoeDetails) {
            const updatedSizes = shoeDetails.sizes.map((sizeObj, idx) => {
                if (idx === index) {
                    return { ...sizeObj, size };
                }
                return sizeObj;
            });
            setShoeDetails({ ...shoeDetails, sizes: updatedSizes });
        }
    };

    if (error) {
        return <div className="p-5 text-center text-red-500">{error}</div>;
    }

    if (!shoeDetails) {
        return <div className="p-5 text-center">טוען...</div>;
    }

    return (
        <>
            <div className="h-[80%] dark:bg-gray-500">
                <section className="flex flex-col items-center mb-10 bg-gray-200 dark:bg-gray-700">
                    <h1 style={{ fontSize: "3rem" }}> Edit Shoe Page </h1>
                </section>

                <div className="container max-w-lg p-6 mx-auto bg-gray-200 dark:bg-gray-600">
                    <div className="mb-6">
                        <label className="block text-sm ">Shoe Name</label>
                        <input
                            type="text"
                            name="name"
                            value={shoeDetails.name}
                            onChange={handleChange}
                            className="w-full p-2 mt-2 border rounded-md"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm">Brand</label>
                        <input
                            type="text"
                            name="brand"
                            value={shoeDetails.brand}
                            onChange={handleChange}
                            className="w-full p-2 mt-2 border rounded-md"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm">Price</label>
                        <input
                            type="number"
                            name="price"
                            value={shoeDetails.price}
                            onChange={handlePriceChange}
                            className="w-full p-2 mt-2 border rounded-md"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm">Picture</label>
                        <input
                            type="text"
                            name="image"
                            value={shoeDetails.image}
                            onChange={handleChange}
                            className="w-full p-2 mt-2 border rounded-md"
                        />
                    </div>
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold">Sizes:</h3>
                        {shoeDetails.sizes.map((sizeObj, index) => (
                            <div key={index} className="flex items-center justify-between mb-3">
                                <input
                                    type="number"
                                    value={sizeObj.size}
                                    onChange={(e) => handleSizeChange(index, parseInt(e.target.value))}
                                    className="w-16 p-2 mt-2 border rounded-md"
                                />
                                <input
                                    type="checkbox"
                                    checked={sizeObj.inStock}
                                    onChange={() => {
                                        const updatedSizes = shoeDetails.sizes.map((size, idx) => {
                                            if (idx === index) {
                                                return { ...size, inStock: !size.inStock };
                                            }
                                            return size;
                                        });
                                        setShoeDetails({ ...shoeDetails, sizes: updatedSizes });
                                    }}
                                    className="ml-2"
                                />
                                <span className="ml-2">In Stock</span>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={handleUpdateShoe}
                        className="px-6 py-2 mt-4 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                    >
                        Update Shoe
                    </button>
                </div>
            </div>
        </>
    );
};

export default EditShoes;