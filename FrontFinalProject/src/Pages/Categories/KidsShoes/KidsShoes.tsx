import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const KidsShoes = () => {
    const [shoes, setShoes] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const fetchShoes = async () => {
        try {
            axios.defaults.headers.common['x-auth-token'] = localStorage.getItem("token");
            const res = await axios.get("http://localhost:8080/shoes");

            const kidsShoes = res.data.filter((shoe: any) => shoe.category === "kids");
            setShoes(kidsShoes);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching shoes:", error);
            setError("לא הצלחנו לטעון את הנעליים, נסה שוב מאוחר יותר.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchShoes();
    }, []);

    const handleNavigateCreate = () => {
        navigate("/create-shoes");
    };

    const handleCardClick = (id: string) => {
        navigate(`/ShoeDetails/${id}`);
    };

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const isAdmin = user?.isAdmin;

    if (loading) {
        return <div className="p-5 text-center text-gray-700">טעינת נתונים...</div>;
    }
    if (error) {
        return <div className="p-5 text-center text-red-500">{error}</div>;
    }

    return (
        <>
            <section className="flex flex-col items-center bg-gray-200 dark:bg-gray-700">
                <h1 style={{ fontSize: "3rem" }}> Kids Shoes Page </h1>
            </section>

            <div className="p-6 dark:bg-gray-600">
                {isAdmin && (
                    <div className="flex justify-center mb-6">
                        <button
                            onClick={handleNavigateCreate}
                            className="px-6 py-2 text-white transition-all duration-300 bg-blue-600 rounded-lg shadow-md hover:bg-blue-700"
                        >
                            Add New Shoe
                        </button>
                    </div>
                )}

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {shoes.map((shoe) => (
                        <div
                            key={shoe._id}
                            onClick={() => handleCardClick(shoe._id)}
                            className="text-center transition-all duration-300 bg-gray-300 rounded-lg shadow-lg cursor-pointer dark:bg-gray-700 hover:shadow-2xl"
                        >
                            <img
                                src={typeof shoe.image === 'string' ? shoe.image : shoe.image.url}
                                alt={shoe.title}
                                className="object-cover w-full h-48 bg-white rounded-t-lg"
                            />
                            <div className="p-4">
                                <h2 className="text-xl font-semibold dark:text-white">{shoe.name}</h2>
                                <p className="text-lg dark:text-white">{shoe.title}</p>
                                <p className="font-medium dark:text-white">{shoe.brand}</p>
                                <p className="text-lg font-semibold dark:text-white">₪ {shoe.price.toFixed(2)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default KidsShoes;