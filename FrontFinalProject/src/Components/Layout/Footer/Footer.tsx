import { Footer as FbFooter } from "flowbite-react";

const Footer = () => {
    return (
        <FbFooter container className="bottom-0 text-red-800 bg-gray-300 rounded-none dark:bg-gray-700">
            <div className="flex justify-center w-full">
                <FbFooter.Copyright
                    href="#"
                    by="Shaked"
                    year={2025}
                    className="text-black"
                />
            </div>
        </FbFooter>
    );
};

export default Footer;