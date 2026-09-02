import { useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "@/context/AuthProvider";
import keycloak from "../auth/keycloak";

function LoginPage() {

    const { authenticated, loading, role } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {

        console.log("LOGIN PAGE");
        console.log("loading:", loading);
        console.log("authenticated:", authenticated);
        console.log("role:", role);

        if (loading) {
            return;
        }

        if (!authenticated) {
            keycloak.login({
                redirectUri: `${window.location.origin}/login`,
            });
return;
}

        if (role === "ATHLETE") {
            navigate("/athlete", { replace: true });
        }

        if (role === "COACH") {
            navigate("/coach", { replace: true });
        }

}, [authenticated, loading, role, navigate]);

return <div>Loading...</div>;
}

export default LoginPage;
