import { useDispatch, useSelector } from "react-redux"
import { TRootState } from "../../Store/BigPie"
import { Card } from "flowbite-react";
import { BsPencilSquare } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import Swal from "sweetalert2";
import { userActions } from "../../Store/UserSlice";

const Profile = () => {
  const user = useSelector((state: TRootState) => state.UserSlice.user);
  const nav = useNavigate();

  const dispatch = useDispatch();

  const getData = async () => {
    try {
      axios.defaults.headers.common['x-auth-token'] = localStorage.getItem("token") || "";
      const res = await axios.get("http://localhost:8080/users/" + user?._id);
      dispatch(userActions.login(res.data));
    } catch (error) {
      Swal.fire({
        title: "failed!",
        icon: "error",
        timerProgressBar: true,
        timer: 2000,
        showCloseButton: true
      });
    };
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <section className="flex flex-col items-center bg-gray-200 dark:bg-gray-700">
        <h1 style={{ fontSize: "3rem" }}> Profile Page </h1>
      </section>

      <div className="flex flex-col items-center justify-start gap-2 dark:bg-gray-800">

        <div className="flex flex-wrap items-center justify-center gap-10 p-5 m-auto bg-grey-800 max-md:flex-col max-md:gap-3 md:w-4/5">
          <Card className="max-w-sm bg-gray-200 dark:border-black dark:bg-gray-700"
            horizontal>
            <img src={user?.image.url} alt={user?.image.alt} className="object-fill w-[200px] h-[250px] m-auto" />
            <p className="text-lg font-semibold dark:text-white">
              Name: {user?.name.first + " " + user?.name.middle + " " + user?.name.last}</p>
            <p className="text-lg font-semibold dark:text-white"> Email: {user?.email}</p>
            <p className="text-lg font-semibold dark:text-white"> Phone: {user?.phone}</p>
            <p className="text-lg font-semibold dark:text-white">
              Address: {user?.address.country + ", " + user?.address.city + ", " + user?.address.street}</p>
            <BsPencilSquare
              size={20}
              className="m-auto text-black cursor-pointer"
              onClick={() => nav("/edit-profile/" + user?._id)}
            />
          </Card>
        </div>
      </div >
    </>
  )
};

export default Profile;