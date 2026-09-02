import axios from "axios";
import keycloak from "@/auth/keycloak";

const api = axios.create({
    baseURL: "http://localhost:8080/api/v1",
});

api.interceptors.request.use(async (config) => {

    if (keycloak.authenticated) {

        await keycloak.updateToken(30);

        console.log("authenticated:", keycloak.authenticated);
        console.log("token:", keycloak.token);

        config.headers.Authorization =
            `Bearer ${keycloak.token}`;
    }

    return config;
});

export default api;