type ShoeCardProps = {
    shoe: {
        _id: string;
        name: string;
        brand: string;
        price: number;
        image: string;
    };
};

const ShoeCard = ({ shoe }: ShoeCardProps) => {
    return (
        <div className="p-4 transition-shadow border rounded-md shadow-sm hover:shadow-md">
            <img
                src={shoe.image}
                alt={shoe.name}
                className="object-cover w-full h-48 mb-4 rounded-md"
            />
            <h2 className="text-xl font-semibold">{shoe.name}</h2>
            <p className="text-gray-600">{shoe.brand}</p>
            <p className="text-gray-600">${shoe.price}</p>
        </div>
    );
};

export default ShoeCard;
