import { joiResolver } from "@hookform/resolvers/joi";
import { Button, FloatingLabel } from "flowbite-react";
import { useForm } from "react-hook-form";
import { SignInJoiSchema } from "../../Validations/SigninSchema";
import axios from "axios";
import { useDispatch } from "react-redux";
import { userActions } from "../../Store/UserSlice";
import { useNavigate } from "react-router-dom";
import { decode } from "../../Services/tokenService";
import Swal from "sweetalert2";

function SignIn() {
    const dispatch = useDispatch();
    const nav = useNavigate();

    const initialFormData = {
        email: "",
        password: "",
    };

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm({
        defaultValues: initialFormData,
        mode: "onChange",
        resolver: joiResolver(SignInJoiSchema),
    });

    const submit = async (form: typeof initialFormData) => {
        try {
            const token = await axios.post("http://localhost:8080/users/login", form);

            localStorage.setItem("token", token.data);
            const id = decode(token.data)._id;
            axios.defaults.headers.common["x-auth-token"] = token.data;
            const user = await axios.get("http://localhost:8080/users/" + id);

            dispatch(userActions.login(user.data));

            const backgroundColor = document.documentElement.classList.contains("dark") ? "#333333" : "#ffffff";
            const textColor = document.documentElement.classList.contains("dark") ? "#ffffff" : "#000000";

            Swal.fire({
                icon: "success",
                title: "Sign In Successful",
                showConfirmButton: false,
                background: backgroundColor,
                color: textColor,
                timerProgressBar: true,
                timer: 2000,
                showCloseButton: true,
            });
            nav("/");
        } catch (error: any) {
            const message =
                error?.response?.data?.message ||
                error?.response?.data ||
                error?.message ||
                "Sign in failed. Please try again.";

            const isLocked = message.toLowerCase().includes("temporarily locked");

            Swal.fire({
                title: isLocked ? "Account Locked" : "Sign In Failed",
                text: message,
                icon: isLocked ? "warning" : "error",
                timerProgressBar: true,
                timer: 4000,
                background: document.documentElement.classList.contains("dark") ? "#333333" : "#ffffff",
                color: document.documentElement.classList.contains("dark") ? "#ffffff" : "#000000",
                toast: false,
                showCloseButton: true,
            });
        }
    };


    return (
        <>
            <div className="flex items-center justify-center min-h-screen gap-2 dark:bg-gray-700">

                <form className="flex flex-col gap-4 p-4 m-auto mb-48 rounded-lg shadow-lg justify-center w-[400px] mt-[100px] dark:bg-gray-800" onSubmit={handleSubmit(submit)} >

                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Sign In</h1>
                    <FloatingLabel
                        type="email"
                        variant="standard"
                        label="Email"
                        {...register("email")}
                        color={errors["email"] ? "error" : "success"}
                    />
                    <span className="text-sm text-red-500">{errors["email"]?.message}</span>

                    <FloatingLabel
                        type="password"
                        variant="standard"
                        label="Password"
                        {...register("password")}
                        color={errors["password"] ? "error" : "success"}
                    />
                    <span className="text-sm text-red-500">
                        {errors["password"]?.message}
                    </span>

                    <Button type="submit" disabled={!isValid}>
                        Sign In
                    </Button>
                </form>
            </div>
        </>
    );
}

export default SignIn;