import { useEffect, useState } from "react";
import { TUser } from "../../Types/TUser";
import { TShoe } from "../../Types/TShoe";
import axios from "axios";
import Swal from "sweetalert2";
import { Card, Button, Pagination, Spinner } from "flowbite-react";
import { useSelector } from "react-redux";
import { TRootState } from "../../Store/BigPie";
import UsePaginationCrm from "../../Hooks/UsePaginationCrm";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrashAlt, FaCheckCircle } from 'react-icons/fa';

const Crm = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<TUser[]>([]);
    const [shoes, setShoes] = useState<TShoe[]>([]);
    const [selectedUser, setSelectedUser] = useState<TUser | null>(null);
    const searchWord = useSelector((state: TRootState) => state.SearchSlice.search);
    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const searchUsers = () => {
        const searchParts = searchWord.toLowerCase().split(" ");
        return users.filter((item: TUser) => {
            const fullName = `${item.name.first} ${item.name.middle} ${item.name.last}`.toLowerCase();
            return searchParts.every((part) => fullName.includes(part)) ||
                item.phone.includes(searchWord) ||
                item.email.includes(searchWord);
        });
    };

    const { onPageChange, currentCards, totalPages, currentPage } = UsePaginationCrm(searchUsers);

    const getAllUsers = async () => {
        try {
            setLoading(true);
            axios.defaults.headers.common['x-auth-token'] = localStorage.getItem("token");
            const res = await axios.get("http://localhost:8080/users/");
            setUsers(res.data);
        } catch (error) {
            Swal.fire({
                title: "failed!",
                icon: "error",
                timerProgressBar: true,
                timer: 2000,
                showCloseButton: true
            });
        } finally {
            setLoading(false);
        }
    };

    const getAllShoes = async () => {
        try {
            const res = await axios.get("http://localhost:8080/shoes/");
            setShoes(res.data);
        } catch (error) {
            Swal.fire({
                title: "Failed to load shoes!",
                icon: "error",
                timerProgressBar: true,
                timer: 2000,
                showCloseButton: true
            });
        }
    };

    const editAuthLevel = async (user: TUser) => {
        try {
            const result = await Swal.fire({
                title: "Are you sure you want to edit the auth level?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                background: '#6d6d6d',
                color: '#ffffff',
                confirmButtonText: "Yes, i'm sure!"
            });

            if (result.isConfirmed) {
                axios.defaults.headers.common['x-auth-token'] = localStorage.getItem("token");
                const response = await axios.patch("http://localhost:8080/users/" + user._id,
                    { isBusiness: !user.isBusiness });

                if (response.status === 200) {
                    const usersIndex = users.indexOf(user);
                    const newUsersArray = [...users];
                    newUsersArray[usersIndex].isBusiness = !user.isBusiness;
                    setUsers(newUsersArray);

                    Swal.fire({
                        title: "You changed the authorization level successfully",
                        icon: "success",
                        timerProgressBar: true,
                        timer: 2000,
                        background: '#6d6d6d',
                        color: '#ffffff',
                        showConfirmButton: false,
                        showCloseButton: true,
                    });
                }
            }
        } catch (error) {
            Swal.fire({
                title: "failed!",
                icon: "error",
                timerProgressBar: true,
                timer: 2000,
                showCloseButton: true
            });
        }
    };

    const deleteUser = async (user: TUser) => {
        try {
            const result = await Swal.fire({
                title: "Are you sure you want to delete this user?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                background: '#6d6d6d',
                color: '#ffffff',
                confirmButtonText: "Yes, delete it!"
            });
            if (result.isConfirmed) {
                axios.defaults.headers.common['x-auth-token'] = localStorage.getItem("token");
                await axios.delete("http://localhost:8080/users/" + user._id);
                const newUsersArr = users.filter((item) => item._id !== user._id);
                setUsers(newUsersArr);
                setSelectedUser(null);
                Swal.fire({
                    title: "User Is Deleted!",
                    icon: "success",
                    showConfirmButton: false,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    background: '#6d6d6d',
                    color: '#ffffff',
                    timerProgressBar: true,
                    timer: 2000,
                });
            }
        } catch (error) {
            Swal.fire({
                title: "failed!",
                icon: "error",
                timerProgressBar: true,
                timer: 2000,
                toast: true,
                showCloseButton: true
            });
        }
    };

    const handleViewShoeDetails = (shoeId: string) => {
        navigate(`/shoeDetails/${shoeId}`);
    };

    const handleSelectUser = (user: TUser) => {
        setSelectedUser(user);
    };

    useEffect(() => {
        getAllUsers();
        getAllShoes();
    }, []);

    return (
        <div className="min-h-screen bg-white dark:bg-gray-800">
            <section className="flex flex-col items-center bg-gray-200 dark:bg-gray-700">
                <h1 style={{ fontSize: "3rem" }}>Client Relations/Content Management</h1>
            </section>

            <main className="flex justify-center gap-3 bg-white dark:bg-gray-800">
                <div className="mt-20 overflow-x-auto text-center max-w-[90vw]">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center min-h-screen">
                            <Spinner size="xl" className="mb-4" />
                            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Loading...</p>
                        </div>
                    ) : (
                        <>
                            <div className="mb-10 overflow-x-auto shadow-md sm:rounded-lg">
                                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-400 dark:bg-gray-700 dark:text-gray-400">
                                        <tr>
                                            <th scope="col" className="px-6 py-3">Name</th>
                                            <th scope="col" className="px-6 py-3">Email</th>
                                            <th scope="col" className="px-6 py-3">Phone</th>
                                            <th scope="col" className="px-6 py-3">Auth Level</th>
                                            <th scope="col" className="px-6 py-3">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentCards.map((user: TUser) => (
                                            <tr key={user._id} className="bg-gray-200 border-b dark:bg-gray-600 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                                <td className="px-6 py-4">{user.name.first} {user.name.middle} {user.name.last}</td>
                                                <td className="px-6 py-4">{user.email}</td>
                                                <td className="px-6 py-4">{user.phone}</td>
                                                <td className="px-6 py-4">{user.isAdmin ? "Admin" : user.isBusiness ? "Business" : "Personal"}</td>
                                                <td className="flex justify-start px-6 py-4 space-x-2">
                                                    <Button
                                                        onClick={() => handleSelectUser(user)}
                                                        className="flex items-center px-4 py-2 space-x-1 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                                                    >
                                                        <FaCheckCircle />
                                                        <span>Select</span>
                                                    </Button>
                                                    <Button
                                                        onClick={() => editAuthLevel(user)}
                                                        className="flex items-center px-4 py-2 space-x-1 text-white bg-yellow-500 rounded-md hover:bg-yellow-600"
                                                    >
                                                        <FaEdit />
                                                        <span>Edit</span>
                                                    </Button>
                                                    <Button
                                                        onClick={() => deleteUser(user)}
                                                        className="flex items-center px-4 py-2 space-x-1 text-white bg-red-500 rounded-md hover:bg-red-600"
                                                    >
                                                        <FaTrashAlt />
                                                        <span>Delete</span>
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {selectedUser && (
                                <Card className="mb-4 bg-gray-200 dark:bg-gray-400">
                                    <h3 className="text-xl font-bold">{selectedUser.name.first} {selectedUser.name.middle} {selectedUser.name.last}</h3>
                                    <p>Email: {selectedUser.email}</p>
                                    <p>Phone: {selectedUser.phone}</p>
                                    <p>Auth Level: {selectedUser.isAdmin ? "Admin" : selectedUser.isBusiness ? "Business" : "Personal"}</p>
                                </Card>
                            )}

                            <div className="overflow-x-auto shadow-md sm:rounded-lg">
                                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-400 dark:bg-gray-700 dark:text-gray-500">
                                        <tr>
                                            <th scope="col" className="px-6 py-3">Shoe Name</th>
                                            <th scope="col" className="px-6 py-3">Image</th>
                                            <th scope="col" className="px-6 py-3">Price </th>
                                            <th scope="col" className="px-6 py-3">Category</th>
                                            <th scope="col" className="px-6 py-3">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {shoes.map((shoe: TShoe) => (
                                            <tr key={shoe._id} className="bg-gray-200 border-b dark:bg-gray-600 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                                <td className="px-6 py-4">{shoe.name}</td>
                                                <td className="w-16 h-16 px-6 py-4"><img src={shoe.image} alt={shoe.name}></img></td>
                                                <td className="px-6 py-4">₪ {shoe.price.toFixed(2)}</td>
                                                <td className="px-6 py-4">{shoe.category}</td>
                                                <td className="px-6 py-4">
                                                    <Button
                                                        onClick={() => handleViewShoeDetails(shoe._id)}
                                                        className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                                                    >
                                                        View Details
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            </main>

            <div className="flex justify-center mt-4">
                {isMobile ? (
                    <div className="flex">
                        <Button
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </Button>
                        <Button
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </Button>
                    </div>
                ) : (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={onPageChange}
                    />
                )}
            </div>
        </div>
    );
};

export default Crm;