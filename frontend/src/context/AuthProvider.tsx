import {createContext, useEffect, useState} from "react";
import keycloak from "../auth/keycloak";

type AuthContextType = {
    authenticated: boolean;
    loading: boolean;
    username: string | undefined;
    role: string | undefined;
};

export const AuthContext = createContext<AuthContextType>({
    authenticated: false,
    loading: true,
    username: undefined,
    role: undefined,
});

let keycloakInitPromise: Promise<boolean> | null = null;

const initKeycloak = () => {
    if (!keycloakInitPromise) {
        keycloakInitPromise = keycloak.init({
            onLoad: "login-required",
        });
    }

    return keycloakInitPromise;
};

function AuthProvider({ children }: { children: React.ReactNode }) {

    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState<string>();
    const [role, setRole] = useState<string>();

    useEffect(() => {
        initKeycloak()
            .then((authenticated) => {

                setAuthenticated(authenticated);

                if (authenticated) {

                    const username =
                        keycloak.tokenParsed?.preferred_username;

                    const roles =
                        keycloak.tokenParsed?.realm_access?.roles ?? [];

                    setUsername(username);

                    if (roles.includes("SUPERADMIN")) {
                        setRole("SUPERADMIN");
                    } else if (roles.includes("COACH")) {
                        setRole("COACH");
                    } else if (roles.includes("ATHLETE")) {
                        setRole("ATHLETE");
                    }

                    console.log("Authenticated:", authenticated);
                    console.log("Username:", username);
                    console.log("Roles:", roles);
                }

                setLoading(false);
            })
            .catch((error) => {
                console.error("Keycloak initialization failed:", error);
                setLoading(false);
            });
    }, []);

    return (
        <AuthContext.Provider
            value={{
                authenticated,
                loading,
                username,
                role,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;