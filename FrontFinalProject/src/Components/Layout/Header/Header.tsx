import { DarkThemeToggle, Navbar, TextInput, Dropdown } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TRootState } from "../../../Store/BigPie";
import { userActions } from "../../../Store/UserSlice";
import { CiSearch } from "react-icons/ci";
import { searchActions } from "../../../Store/SearchSlice";
import Swal from "sweetalert2";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import React from "react";
import { HiChevronDown } from "react-icons/hi";
import { FaShoppingCart } from "react-icons/fa";
import { clearCart, setCart } from "../../../Store/CartSlice";

interface CartItem {
    _id: string;
    shoeId: string;
    size: number;
    quantity: number;
    name: string;
    price: number;
    image: string;
}

const Header = () => {
    const user = useSelector((state: TRootState) => state.UserSlice.user);
    const cartItems = useSelector((state: TRootState) => state.CartSlice.cartItems);
    const dispatch = useDispatch();
    const nav = useNavigate();
    const location = useLocation().pathname;

    const Profile = () => {
        if (user?.isAdmin || user?.isBusiness || user) {
            nav("/profile");
        } else {
            nav("/*");
        }
    };

    const SignOut = () => {
        const backgroundColor = document.documentElement.classList.contains('dark') ? '#333333' : '#ffffff';
        const textColor = document.documentElement.classList.contains('dark') ? '#ffffff' : '#000000';
        Swal.fire({
            title: "Are you sure?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            background: backgroundColor,
            color: textColor,
            confirmButtonText: "Yes, sign out!"
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem("token");
                localStorage.removeItem("cartItems");
                dispatch(userActions.Signout());
                dispatch(clearCart());
                Swal.fire({
                    showConfirmButton: false,
                    title: "You Signed Out!",
                    background: backgroundColor,
                    color: textColor,
                    icon: "success",
                    timerProgressBar: true,
                    timer: 2000,
                    showCloseButton: true
                });
                nav("/");
            }
        });
    };

    const search = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        dispatch(searchActions.searchWord(value));
    };

    useEffect(() => {
        let token = localStorage.getItem("token");
        if (token) {
            (async () => {
                axios.defaults.headers.common['x-auth-token'] = token;
                const user = await axios.get("http://localhost:8080/users/" +
                    (jwtDecode(token) as { _id: string })._id);
                dispatch(userActions.login(user.data));

                const storedCart = localStorage.getItem("cartItems");
                if (storedCart) {
                    dispatch(setCart(JSON.parse(storedCart)));
                }
            })();
        } else {
            const storedCart = localStorage.getItem("cartItems");
            if (storedCart) {
                dispatch(setCart(JSON.parse(storedCart)));
            }
        }
    }, [dispatch]);

    useEffect(() => {
        if (Array.isArray(cartItems) && cartItems.length > 0) {
            localStorage.setItem("cartItems", JSON.stringify(cartItems));
        }
    }, [cartItems]);

    const totalItemsInCart = Array.isArray(cartItems)
        ? cartItems.reduce((total: number, item: CartItem) => total + item.quantity, 0)
        : 0;

    return (
        <Navbar fluid className="bg-slate-800">
            <div className="flex flex-wrap items-center justify-between w-full mx-auto">
                <Navbar.Brand as={Link} href="/" to="/">
                    <img src="/Logo.png" alt="Logo pic" style={{ width: "50px", height: "40px", borderRadius: "50%", marginRight: "10px" }} />
                    <span className="self-center text-xl font-semibold text-white whitespace-nowrap">S-Shoes</span>
                </Navbar.Brand>

                <div className="flex items-center order-2 md:order-3">
                    <Link to="/cart" className="relative flex items-center mr-4 text-white hover:text-gray-400">
                        <FaShoppingCart className="text-2xl" />
                        {totalItemsInCart > 0 && (
                            <span className="absolute flex items-center justify-center w-5 h-5 text-xs text-white bg-red-600 rounded-full -top-2 -right-2">
                                {totalItemsInCart}
                            </span>
                        )}
                    </Link>
                    <TextInput rightIcon={CiSearch} onChange={search} placeholder="Search..." className="hidden md:block" />
                    <DarkThemeToggle className="mr-4" />
                    <Navbar.Toggle />
                </div>

                <Navbar.Collapse className="order-3 w-full md:order-2 md:w-auto">
                    <div className="flex flex-col items-center justify-center mx-auto md:flex-row md:space-x-8">
                        <Navbar.Link as={Link} to="/" href="/" className="text-white" active={location === "/"}>Home</Navbar.Link>
                        <Navbar.Link as={Link} to="/about" href="/about" className="text-white" active={location === "/about"}>About</Navbar.Link>

                        {(user && (user.isAdmin || user.isBusiness || !user.isAdmin && !user.isBusiness)) && (
                            <Navbar.Brand onClick={Profile} className="flex items-center">
                                <img src={user.image.url}
                                    style={{ width: "30px", height: "30px", borderRadius: "50%" }}
                                    className="cursor-pointer"
                                />
                            </Navbar.Brand>
                        )}

                        {user?.isAdmin && (
                            <Navbar.Link as={Link} href="/crm" to="/crm" className="text-white" active={location === "/crm"}>CRM</Navbar.Link>
                        )}

                        <Dropdown
                            label="Categories"
                            inline
                            className="text-white"
                            renderTrigger={() => (
                                <button className={`flex items-center cursor-pointer hover:text-white ${location.includes("/kids") || location.includes("/mens") || location.includes("/womens") ? "text-white" : "text-gray-400"}`}>
                                    Categories
                                    <HiChevronDown className="ml-1 text-lg" />
                                </button>
                            )}
                        >
                            <Dropdown.Item as={Link} to="/kids" className={location === "/kids" ? "text-white bg-blue-500" : ""}>Kids</Dropdown.Item>
                            <Dropdown.Item as={Link} to="/mens" className={location === "/mens" ? "text-white bg-blue-500" : ""}>Mens</Dropdown.Item>
                            <Dropdown.Item as={Link} to="/womens" className={location === "/womens" ? "text-white bg-blue-500" : ""}>Womens</Dropdown.Item>
                        </Dropdown>

                        {!user && <Navbar.Link as={Link} to="/signin" href="/signin" className="text-white" active={location === "/signin"}>Sign In</Navbar.Link>}
                        {!user && <Navbar.Link as={Link} to="/register" href="/register" className="text-white" active={location === "/register"}>Register</Navbar.Link>}
                        {user && <Navbar.Link className="text-white cursor-pointer" onClick={SignOut}>Sign Out</Navbar.Link>}
                    </div>

                    {/* Mobile search */}
                    <div className="mt-4 md:hidden">
                        <TextInput rightIcon={CiSearch} onChange={search} placeholder="Search..." />
                    </div>
                </Navbar.Collapse>
            </div>
        </Navbar>
    );
};

export default Header;