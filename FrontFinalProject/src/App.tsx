import { Route, Routes } from "react-router-dom";
import Error from "./Pages/Error/Error";
import SignIn from "./Pages/SignIn/SignIn";
import Home from "./Pages/Home/Home";
import About from "./Pages/About/About";
import Register from "./Pages/Register/Register";
import Footer from "./Components/Layout/Footer/Footer";
import Header from "./Components/Layout/Header/Header";
import KidsShoes from "./Pages/Categories/KidsShoes/KidsShoes";
import MensShoes from "./Pages/Categories/MensShoes/MensShoes";
import WomensShoes from "./Pages/Categories/WomensShoes/WomensShoes";
import RouteGuard from "./Components/Shared/RouteGuard";
import Profile from "./Pages/Profile/Profile";
import EditProfile from "./Pages/EditProfile/EditProfile";
import Crm from "./Pages/Admin/Crm";
import CreateShoes from "./Pages/CreateShoes/CreateShoes";
import ShoeDetails from "./Pages/ShoeDetails/ShoeDetails";
import EditShoes from "./Pages/EditShoes/EditShoes";
import Cart from "./Pages/Cart/Cart";
import Confirmation from "./Pages/ConfirmationPage/ConfirmationPage";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setCart } from "./Store/CartSlice";
import { getCart } from "./Services/cartService";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const loadCart = async () => {
      try {
        const response = await getCart();
        dispatch(setCart(response.items));
      } catch (err) {
        console.error("Failed to load cart:", err);
      }
    };
    loadCart();
  }, [dispatch]);

  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/kids" element={<KidsShoes />} />
        <Route path="/mens" element={<MensShoes />} />
        <Route path="/womens" element={<WomensShoes />} />
        <Route path="/create-shoes" element={<CreateShoes />} />
        <Route path="/edit-profile/:id" element={<EditProfile />} />
        <Route path="/ShoeDetails/:id" element={<ShoeDetails />} />
        <Route path="/edit-shoes/:id" element={<EditShoes />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/*" element={<Error />} />

        <Route
          path="/cart"
          element={
            <RouteGuard>
              <Cart />
            </RouteGuard>
          }
        />

        <Route
          path="/crm"
          element={
            <RouteGuard adminOnly>
              <Crm />
            </RouteGuard>
          }
        />

        <Route
          path="/profile"
          element={
            <RouteGuard>
              <Profile />
            </RouteGuard>
          }
        />
      </Routes>

      <Footer />
    </>
  );
}

export default App;