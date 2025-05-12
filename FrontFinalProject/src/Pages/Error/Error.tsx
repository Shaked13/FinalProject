import { Button } from "flowbite-react";
import { FaRegSadCry } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Error = () => {
    const nav = useNavigate();

    const navHome = () => {
        nav('/');
    }

    return (
        <>
            <div className="flex flex-col items-center justify-center h-screen gap-10 dark:bg-gray-800">
                <h1 className="text-3xl dark:text-white">404</h1>
                <p className="text-2xl dark:text-white">page not found!</p>
                <FaRegSadCry size={50} />
                <Button onClick={navHome} className="bg-gray-400 dark:bg-gray-600"> Go Back To Home Page </Button>
            </div>
        </>
    )
};

export default Error;