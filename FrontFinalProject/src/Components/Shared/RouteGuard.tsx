import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { TRootState } from "../../Store/BigPie";
import { TUserState } from "../../Store/UserSlice";


type TRouteGuard = {
    children: React.ReactNode,
    bizOnly?: boolean,
    adminOnly?: boolean,
};

const RouteGuard = (props: TRouteGuard) => {
    const { children, bizOnly, adminOnly } = props;
    const userState = useSelector((state: TRootState) => state.UserSlice) as TUserState;
    const user = userState.user!;

    if (!userState.isLoggedIn) {
        return <Navigate to="/signin" />
    };

    if (bizOnly && !user.isBusiness) {
        return <Navigate to="/" />
    };

    if (adminOnly && !user.isAdmin) {
        return <Navigate to="/" />
    };

    return <>{children}</>;
};

export default RouteGuard;