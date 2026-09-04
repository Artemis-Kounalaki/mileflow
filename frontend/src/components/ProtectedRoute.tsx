import {Navigate, Outlet, useLocation} from "react-router";
import {AuthContext} from "@/context/AuthProvider.tsx";
import {useContext} from "react";

type ProtectedRouteProps = {
    allowedRoles?: string[];
};

const ProtectedRoute = ({allowedRoles}: ProtectedRouteProps) => {

    const {authenticated, loading, role} = useContext(AuthContext);
    const location = useLocation();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!authenticated) {
        return <Navigate to="/login" state={{from: location}} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(role ?? "")) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;