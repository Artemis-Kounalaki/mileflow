import {Navigate, Outlet, useLocation} from "react-router";
import {AuthContext} from "@/context/AuthProvider.tsx";
import {useContext} from "react";

const ProtectedRoute = () => {

    const {authenticated} = useContext(AuthContext);
    const location = useLocation();

    if(!authenticated){
        return <Navigate to="/login" state={{from: location}} />;
    }

    return <Outlet />
}
export default ProtectedRoute;