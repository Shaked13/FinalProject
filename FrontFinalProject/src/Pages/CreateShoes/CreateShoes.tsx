import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { shoeSchema } from "../../Validations/shoeSchema";
import Swal from "sweetalert2";
import React, { useEffect, useState } from "react";

type SizeAvailability = { size: number; inStock: boolean };

const SIZE_OPTIONS: Record<string, number[]> = {
    women: [35, 36, 37, 38, 39, 40, 41],
    men: [39, 40, 41, 42, 43, 44, 45],
    kids: [24, 25, 26, 27, 28, 29, 30],
};

const DEFAULT_IMAGE = "https://cdn-icons-png.flaticon.com/512/3764/3764516.png";

const CreateShoes = () => {
    const navigate = useNavigate();

    const initialData = {
        name: "",
        brand: "",
        price: "",
        image: "",
        category: "",
        sizes: [] as SizeAvailability[],
    };

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isValid },
    } = useForm({
        defaultValues: initialData,
        mode: "onChange",
        resolver: joiResolver(shoeSchema),
    });

    const [category, setCategory] = useState<string>("");

    useEffect(() => {
        if (category) {
            const sizesForCategory =
                SIZE_OPTIONS[category]?.map((size) => ({
                    size,
                    inStock: false,
                })) || [];
            setValue("sizes", sizesForCategory);
        }
    }, [category, setValue]);

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCategory = e.target.value;
        setCategory(selectedCategory);
        setValue("category", selectedCategory);
    };

    const toggleSizeInStock = (index: number) => {
        const sizes = watch("sizes");
        sizes[index].inStock = !sizes[index].inStock;
        setValue("sizes", [...sizes]);
    };

    const onSubmit = async (form: typeof initialData) => {
        try {
            const imageUrl = form.image?.trim();
            const finalForm = {
                ...form,
                image: imageUrl ? imageUrl : DEFAULT_IMAGE,
            };

            axios.defaults.headers.common["x-auth-token"] = localStorage.getItem("token");
            await axios.post("http://localhost:8080/shoes", finalForm);

            Swal.fire({
                icon: "success",
                title: "Your shoe was created!",
                showConfirmButton: false,
                timer: 1500,
            });
            navigate("/");
        } catch (error) {
            Swal.fire({
                title: "Failed!",
                icon: "error",
                text: "You must be logged in as a business user.",
                timerProgressBar: true,
                timer: 2000,
                showCloseButton: true,
            });
            console.error("Error creating shoe:", error);
        }
    };

    return (
        <>
            <div className="min-h-screen dark:bg-gray-500">
                <section className="flex flex-col items-center mb-10 bg-gray-200 dark:bg-gray-700">
                    <h1 style={{ fontSize: "3rem" }}>Create New Shoe</h1>
                </section>

                <div className="container max-w-lg p-6 mx-auto bg-gray-200 dark:text-gray-400 dark:bg-gray-600">
                    <div className="mb-3">
                        <label htmlFor="category" className="block mb-1 text-sm font-medium">Category</label>
                        <select
                            autoFocus
                            id="category"
                            name="category"
                            value={category}
                            onChange={handleCategoryChange}
                            className="w-full px-4 py-2 mb-2 border border-gray-300 rounded-md"
                        >
                            <option value="">Select Category</option>
                            <option value="women">Women</option>
                            <option value="men">Men</option>
                            <option value="kids">Kids</option>
                        </select>
                        {errors.category && <span className="text-xs text-red-500">{errors.category.message}</span>}
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block mb-1 text-sm font-medium">Shoe Name</label>
                            <input
                                type="text"
                                id="name"
                                {...register("name")}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                            />
                            {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
                        </div>

                        <div>
                            <label htmlFor="brand" className="block mb-1 text-sm font-medium">Brand</label>
                            <input
                                type="text"
                                id="brand"
                                {...register("brand")}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                            />
                            {errors.brand && <span className="text-xs text-red-500">{errors.brand.message}</span>}
                        </div>

                        <div>
                            <label htmlFor="price" className="block mb-1 text-sm font-medium">Price</label>
                            <input
                                type="number"
                                id="price"
                                step="0.01"
                                {...register("price")}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                            />
                            {errors.price && <span className="text-xs text-red-500">{errors.price.message}</span>}
                        </div>

                        <div>
                            <label htmlFor="image" className="block mb-1 text-sm font-medium">Image URL</label>
                            <input
                                type="text"
                                id="image"
                                {...register("image")}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                            />
                            {errors.image && <span className="text-xs text-red-500">{errors.image.message}</span>}
                        </div>

                        {category && watch("sizes").length > 0 && (
                            <div>
                                <label className="block mb-2 text-sm font-medium">Sizes In Stock</label>
                                <div className="flex flex-wrap gap-3">
                                    {watch("sizes").map((sizeObj, index) => (
                                        <label key={sizeObj.size} className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                checked={sizeObj.inStock}
                                                onChange={() => toggleSizeInStock(index)}
                                            />
                                            <span>{sizeObj.size}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            className={`w-full px-4 py-2 text-white rounded-md ${isValid ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-400 cursor-not-allowed"
                                }`}
                            disabled={Object.keys(errors).length > 0}
                        >
                            {isValid ? "Create Shoe" : "Please fill in all fields correctly"}
                        </button>

                    </form>
                </div>
            </div>
        </>
    );
};

export default CreateShoes;