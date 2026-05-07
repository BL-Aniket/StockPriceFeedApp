import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Home, RefreshCcw } from "lucide-react";
import Button from "../components/Button/Button";
import { useRouteError, isRouteErrorResponse, Link, useNavigate } from "react-router-dom";

// Status code messages
const statusConfig = {
    400: {
        title: "400 - Bad Request",
        message: "The request could not be understood by the server."
    },
    401: {
        title: "401 - Unauthorized",
        message: "You are not authorized to view this page."
    },
    403: {
        title: "403 - Forbidden",
        message: "Access to this resource is forbidden."
    },
    404: {
        title: "404 - Page Not Found",
        message: "The page you are looking for does not exist."
    },
    500: {
        title: "500 - Server Error",
        message: "Something went wrong on the server."
    },
    default: {
        title: "Unexpected Error",
        message: "Something went wrong. Please try again later."
    }
};

export default function ErrorPage() {
    const error = useRouteError();

    const navigate = useNavigate()

    let status = 500;
    let title = statusConfig.default.title;
    let message = statusConfig.default.message;

    if (isRouteErrorResponse(error)) {
        status = error.status;
        const config = statusConfig[status] || statusConfig.default;
        title = config.title;
        message = config.message;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-200 p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="bg-white shadow-2xl rounded-2xl p-10 max-w-lg w-full text-center"
            >
                {/* Icon */}
                <motion.div
                    initial={{ rotate: -10 }}
                    animate={{ rotate: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex justify-center mb-6"
                >
                    <AlertTriangle className="w-16 h-16 text-red-500" />
                </motion.div>

                {/* Status Code */}
                <h1 className="text-4xl font-bold text-gray-800 mb-3">
                    {title}
                </h1>

                {/* Message */}
                <p className="text-gray-600 mb-8 text-base">
                    {message}
                </p>

                {/* Buttons */}
                <div className="grid grid-cols-2 gap-4 justify-center">
                    <Link to="/login">
                        <Button type="submit" className="flex items-center gap-2 rounded-xl">
                            <div>Go Home</div>
                        </Button>
                    </Link>

                    <Button
                        variant="outline"
                        className="flex items-center gap-2 rounded-xl"
                        onClick={() => navigate(0)}
                    >
                        Retry
                    </Button>
                </div>

                {/* Status Badge */}
                <div className="mt-8">
                    <span className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-full">
                        Status Code: {status}
                    </span>
                </div>
            </motion.div>
        </div>
    );
}

