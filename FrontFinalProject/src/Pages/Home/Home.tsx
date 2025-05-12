import ImageCarousel from "../../Components/Shared/ImageCarousel.tsx";

const Kids = [
    "/KidsGirlsShoes1.png",
    "/KidsBoysShoes1.png",
    "/KidsGirlsShoes2.png",
    "/KidsBoysShoes2.png",
    "/KidsGirlsShoes3.png",
];

const Mens = [
    "/MensShoes1.png",
    "/MensShoes2.png",
    "/MensShoes3.png",
    "/MensShoes4.png",
    "/MensShoes5.png",
];

const Womens = [
    "/WomensShoes1.png",
    "/WomensShoes2.png",
    "/WomensShoes3.png",
    "/WomensShoes4.png",
    "/WomensShoes5.png",
];

const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-10 dark:bg-gray-600">
            <h1 className="text-3xl font-bold text-center">Welcome to My Website</h1>

            <div className="w-full text-center">
                <h2 className="mb-4 text-2xl font-semibold">Kids</h2>
                <ImageCarousel images={Kids} />
            </div>

            <div className="w-full text-center">
                <h2 className="mb-4 text-2xl font-semibold">Mens</h2>
                <ImageCarousel images={Mens} />
            </div>

            <div className="w-full text-center">
                <h2 className="mb-4 text-2xl font-semibold">Womens</h2>
                <ImageCarousel images={Womens} />
            </div>
        </div>
    );
};

export default Home;