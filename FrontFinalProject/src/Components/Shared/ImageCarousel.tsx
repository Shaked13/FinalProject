import { FC, useState } from "react";
import { motion } from "framer-motion";

interface ImageCarouselProps {
    images: string[];
}

const ImageCarousel: FC<ImageCarouselProps> = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(2);

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    const goToNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    return (
        <div className="relative w-full h-40 overflow-hidden">
            <button
                onClick={goToPrevious}
                className="absolute left-0 z-10 p-4 text-white transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full top-1/2"
            >
                ←
            </button>

            <div className="flex items-center justify-center w-full h-full">
                <div className="relative flex items-center justify-center w-full">
                    <div className="flex items-center justify-center">
                        {images.map((src, index) => {
                            const distance = (index - currentIndex + images.length) % images.length;
                            const scale = distance === 0 ? 1.8 : 1;
                            const opacity = distance === 0 ? 1 : 0.2;
                            const zIndex = distance === 0 ? 10 : 5;
                            const borderStyle = distance === 0 ? "border-4 border-black shadow-xl" : "shadow-md";

                            const translateX =
                                distance === 0
                                    ? 0
                                    : distance === 1 || distance === -4
                                        ? 200
                                        : distance === -1 || distance === 4
                                            ? -200
                                            : distance === 2 || distance === -3
                                                ? 350
                                                : -350;

                            return (
                                <motion.img
                                    key={index}
                                    src={src}
                                    alt={`Slide ${index}`}
                                    className={`absolute transition-all duration-500 rounded-lg w-24 h-20 ${borderStyle}`}
                                    style={{ zIndex }}
                                    animate={{
                                        x: translateX,
                                        scale,
                                        opacity,
                                    }}
                                    transition={{ duration: 0.6 }}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>

            <button
                onClick={goToNext}
                className="absolute right-0 z-10 p-4 text-white transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full top-1/2"
            >
                →
            </button>
        </div>
    );
};

export default ImageCarousel;