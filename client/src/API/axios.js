import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// REQUEST INTERCEPTOR
API.interceptors.request.use(
    (config) => {

        // Get userDetails from localStorage
        const userDetails = JSON.parse(
            localStorage.getItem("userDetails")
        );

        // If token exists
        if (userDetails?.token) {

            config.headers.Authorization =
                `Bearer ${userDetails.token}`;
        }

        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
);

export default API;