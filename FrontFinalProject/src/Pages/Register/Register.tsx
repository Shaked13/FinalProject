import { joiResolver } from "@hookform/resolvers/joi";
import { useForm } from "react-hook-form";
import { RegisterSchema } from "../../Validations/RegisterSchema";
import { FloatingLabel, Button, Checkbox, Label } from "flowbite-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Register = () => {

    const nav = useNavigate();

    const initialData = {
        "name": {
            "first": "",
            "middle": "",
            "last": ""
        },
        "phone": "",
        "email": "",
        "password": "",
        "image": {
            "url": "",
            "alt": ""
        },
        "address": {
            "state": "",
            "country": "",
            "city": "",
            "street": "",
            "houseNumber": 0,
            "zip": 0
        },
        "isBusiness": false
    }
    const { register, handleSubmit, formState: { errors, isValid, isDirty } } = useForm({
        defaultValues: initialData,
        mode: "onChange",
        resolver: joiResolver(RegisterSchema)
    })

    const submit = async (form: any) => {
        try {
            await axios.post('http://localhost:8080/users/register', form)
            Swal.fire({
                background: '#6d6d6d',
                color: '#ffffff',
                icon: "success",
                title: "Register Succssful",
                showConfirmButton: false,
                timer: 2000
            });
            nav("/signin");
        } catch (error) {
            Swal.fire({
                title: "failed!",
                icon: "error",
                timerProgressBar: true,
                timer: 2000,
                toast: true,
                showCloseButton: true
            });
        };
    }

    return (
        <>
            <div className="flex items-center justify-center gap-2 dark:bg-gray-700">

                <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4 p-4 rounded-lg shadow-lg m-auto justify-center w-[400px] bg-gray-200 dark:bg-gray-800 mt-20 mb-20">

                    <h1 className="text-2xl font-bold dark:text-white">Register</h1>
                    <FloatingLabel
                        helperText="* requierd"
                        type="text"
                        variant="standard"
                        label="First Name"
                        {...register("name.first")}
                        color={!isDirty ? 'default' : errors.name?.first ? "error" : "success"}
                    />
                    <span className="text-sm text-red-500">{errors.name?.first?.message}</span>

                    <FloatingLabel
                        type="text"
                        variant="standard"
                        label="Middle Name"
                        {...register("name.middle")}
                        color={!isDirty ? 'default' : errors.name?.middle ? "error" : "success"}
                    />
                    <span className="text-sm text-red-500">{errors.name?.middle?.message}</span>

                    <FloatingLabel
                        helperText="* requierd"
                        type="text"
                        variant="standard"
                        label="Last Name"
                        {...register("name.last")}
                        color={!isDirty ? 'default' : errors.name?.last ? "error" : "success"}
                    />
                    <span className="text-sm text-red-500">{errors.name?.last?.message}</span>

                    <FloatingLabel
                        helperText="* requierd"
                        type="text"
                        variant="standard"
                        label="Phone"
                        {...register("phone")}
                        color={!isDirty ? 'default' : errors.phone ? "error" : "success"}
                    />
                    <span className="text-sm text-red-500">{errors.phone?.message}</span>

                    <FloatingLabel
                        helperText="* requierd"
                        type="text"
                        variant="standard"
                        label="Email"
                        {...register("email")}
                        color={!isDirty ? 'default' : errors.email ? "error" : "success"}
                    />
                    <span className="text-sm text-red-500">{errors.email?.message}</span>

                    <FloatingLabel
                        helperText="* requierd"
                        type="text"
                        variant="standard"
                        label="Password"
                        {...register("password")}
                        color={!isDirty ? 'default' : errors.password ? "error" : "success"}
                    />
                    <span className="text-sm text-red-500">{errors.password?.message}</span>

                    <FloatingLabel
                        type="text"
                        variant="standard"
                        label="Image Url"
                        {...register("image.url")}
                        color={!isDirty ? 'default' : errors.image?.url ? "error" : "success"}
                    />
                    <span className="text-sm text-red-500">{errors.image?.url?.message}</span>

                    <FloatingLabel
                        type="text"
                        variant="standard"
                        label="Image Alt"
                        {...register("image.alt")}
                        color={!isDirty ? 'default' : errors.image?.alt ? "error" : "success"}
                    />
                    <span className="text-sm text-red-500">{errors.image?.alt?.message}</span>

                    <FloatingLabel
                        type="text"
                        variant="standard"
                        label="State"
                        {...register("address.state")}
                        color={!isDirty ? 'default' : errors.address?.state ? "error" : "success"}
                    />
                    <span className="text-sm text-red-500">{errors.address?.state?.message}</span>

                    <FloatingLabel
                        helperText="* requierd"
                        type="text"
                        variant="standard"
                        label="Country"
                        {...register("address.country")}
                        color={!isDirty ? 'default' : errors.address?.country ? "error" : "success"}
                    />
                    <span className="text-sm text-red-500">{errors.address?.country?.message}</span>

                    <FloatingLabel
                        helperText="* requierd"
                        type="text"
                        variant="standard"
                        label="City"
                        {...register("address.city")}
                        color={!isDirty ? 'default' : errors.address?.city ? "error" : "success"}
                    />
                    <span className="text-sm text-red-500">{errors.address?.city?.message}</span>

                    <FloatingLabel
                        helperText="* requierd"
                        type="text"
                        variant="standard"
                        label="Street"
                        {...register("address.street")}
                        color={!isDirty ? 'default' : errors.address?.street ? "error" : "success"}
                    />
                    <span className="text-sm text-red-500">{errors.address?.street?.message}</span>

                    <FloatingLabel
                        helperText="* requierd"
                        type="text"
                        variant="standard"
                        label="HouseNumber"
                        {...register("address.houseNumber")}
                        color={!isDirty ? 'default' : errors.address?.houseNumber ? "error" : "success"}
                    />
                    <span className="text-sm text-red-500">{errors.address?.houseNumber?.message}</span>

                    <FloatingLabel
                        type="number"
                        variant="standard"
                        label="Zip"
                        {...register("address.zip")}
                        color={!isDirty ? 'default' : errors.address?.zip ? "error" : "success"}
                    />
                    <span className="text-sm text-red-500">{errors.address?.zip?.message}</span>

                    <Label htmlFor="isBusiness">Is Business</Label>
                    <Checkbox
                        {...register("isBusiness")}
                        color={!isDirty ? 'default' : errors.isBusiness ? "error" : "success"}
                    />
                    <span className="text-sm text-red-500">{errors.isBusiness?.message}</span>

                    <Button type="submit" disabled={!isValid}
                    >
                        Sign In
                    </Button>

                </form>
            </div>
        </>
    )
}
export default Register;