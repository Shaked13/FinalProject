import { useEffect, useState } from "react";
import axios from "axios";
import ShoeCard from "../ShoeCard/ShoeCard";

type ShoesByCategoryProps = {
    category: "men" | "women" | "kids";
};

const ShoesByCategory = ({ category }: ShoesByCategoryProps) => {
    const [shoes, setShoes] = useState<any[]>([]);

    const fetchShoes = async () => {
        try {
            axios.defaults.headers.common["x-auth-token"] = localStorage.getItem("token");
            const res = await axios.get("http://localhost:8080/shoes");
            setShoes(res.data);
        } catch (error) {
            console.error("Error fetching shoes:", error);
        }
    };

    useEffect(() => {
        fetchShoes();
    }, []);

    const filteredShoes = shoes.filter((shoe) => shoe.category === category);

    return (
        <div className="container p-6 mx-auto">
            <h1 className="mb-4 text-2xl font-semibold capitalize">{category} Shoes</h1>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredShoes.map((shoe) => (
                    <ShoeCard key={shoe._id} shoe={shoe} />
                ))}
            </div>
        </div>
    );
};

export default ShoesByCategory;
