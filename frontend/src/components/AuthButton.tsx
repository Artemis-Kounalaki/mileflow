import { useContext } from "react";
import { AuthContext } from "@/context/AuthProvider";
import keycloak from "../auth/keycloak";

import UserMenu from "@/components/UserMenu.tsx";

function AuthButton() {

    const { authenticated, role } = useContext(AuthContext);

    const handleLogin = () => {
        keycloak.login({
            redirectUri: `${window.location.origin}/login`,
        });
    };

    if (authenticated) {
        return (<UserMenu role={role} />);
    }
    else {
        return (
            <button onClick={handleLogin}>
                Login
            </button>
        );
    }
}

export default AuthButton;