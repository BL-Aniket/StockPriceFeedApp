import React, { useState, useEffect } from "react";
import GoogleIcon from "../assets/images/google.png";
import Input from "../components/Input/Input";
import Button from "../components/Button/Button";
import { useNavigate } from "react-router-dom";
import API from "../API/axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import validator from "validator";
import { useGoogleLogin } from "@react-oauth/google";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [touched, setTouched] = useState({
        email: false,
        password: false
    });
    const [errors, setErrors] = useState({
        email: "",
        password: "",
    });
    const [submitted, setSubmitted] = useState(false);

    const navigate = useNavigate();

    const googleLogin = useGoogleLogin({

    onSuccess: async (tokenResponse) => {

        try {

            // Get Google User Details
            const userInfo = await fetch(
                "https://www.googleapis.com/oauth2/v3/userinfo",
                {
                    headers: {
                        Authorization: `Bearer ${tokenResponse.access_token}`,
                    },
                }
            );

            const user = await userInfo.json();

            console.log("Google User", user);

            // Backend Login Payload
            const payload = {
                emailOrUsername: user.email,
                password: "Google@123"
            };

            // LOGIN API
            const response = await API.post(
                "/api/auth/login",
                payload
            );

            console.log("Google Login Response", response.data);

            // STORE USER DETAILS
            const userDetails = {
                email: response.data.data.email,
                userId: response.data.data.userId,
                username: response.data.data.username,
                token: response.data.data.token,
                tokenType: response.data.data.tokenType,
            };

            localStorage.setItem(
                "userDetails",
                JSON.stringify(userDetails)
            );

            toast.success("Google Login Successful");

            navigate("/watchlist");

        } catch (error) {

            console.log(error);

            toast.error(
                error?.response?.data?.message ||
                "Google Login Failed"
            );
        }
    },

    onError: () => {
        toast.error("Google Authentication Failed");
    }
});

    // =========================
    // DEBOUNCED EMAIL VALIDATION
    // =========================
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!email.trim()) {
                setErrors((prev) => ({
                    ...prev,
                    email: "Email is required",
                }));
            } else if (!validator.isEmail(email)) {
                setErrors((prev) => ({
                    ...prev,
                    email: "Please enter a valid email",
                }));
            } else {
                setErrors((prev) => ({
                    ...prev,
                    email: "",
                }));
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [email]);

    // =========================
    // DEBOUNCED PASSWORD VALIDATION
    // =========================
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!password.trim()) {
                setErrors((prev) => ({
                    ...prev,
                    password: "Password is required",
                }));
            } else if (
                !validator.isStrongPassword(password, {
                    minLength: 8,
                    minLowercase: 1,
                    minUppercase: 1,
                    minNumbers: 1,
                    minSymbols: 1,
                })
            ) {
                setErrors((prev) => ({
                    ...prev,
                    password:
                        "Password must contain 8 characters, uppercase, lowercase, number and symbol",
                }));
            } else {
                setErrors((prev) => ({
                    ...prev,
                    password: "",
                }));
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [password]);

    const handleLogin = async (e) => {
        try {
            e.preventDefault();

            setSubmitted(true);

            // Prevent login if validation errors exist
            if (errors.email !== "" || errors.password !== "") {
                toast.error("Please fix validation errors");
                return;
            }

            const formValues = {
                emailOrUsername: email,
                password: password,
            };

            console.log("formValues", formValues);

            const response = await API.post("/api/auth/login", formValues);

            console.log("Login Response", response.data);

            const userDetails = {
                email: response.data.data.email,
                userId: response.data.data.userId,
                token: response.data.data.token,
                username: response.data.data.username,
            };

            console.log("userDetails", userDetails)


            // localStorage only stores strings
            localStorage.setItem(
                "userDetails",
                JSON.stringify(userDetails)
            );

            toast.success("Login Successful");

            navigate("/watchlist");

            if (response.data.success) {
                setEmail("")
                setPassword("")
            }

        } catch (error) {
            console.log("Error logging into the system", error);

            toast.error(
                error?.response?.data?.message || "Login failed"
            );
        }
    };

    return (
        <section className="min-h-screen overflow-hidden w-full bg-gray-100 px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12 lg:py-16 xl:py-20">
            <div className="flex items-center justify-center h-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 xl:gap-20 w-full max-w-5xl items-center">

                    {/* LEFT SIDE */}
                    <div className="text-center lg:text-left">
                        <div className="text-3xl sm:text-4xl lg:text-5xl font-medium leading-tight">
                            Welcome back!
                        </div>

                        <div className="text-sm sm:text-base mt-4 text-gray-600 font-medium max-w-md mx-auto lg:mx-0">
                            Login to your account using your email and password
                        </div>

                        <div className="text-sm mt-4 font-medium text-gray-600">
                            Don't have an account?{" "}
                            <span
                                className="text-blue-700 hover:underline cursor-pointer"
                                onClick={() => navigate("/register")}
                            >
                                Register for free
                            </span>
                        </div>

                        <div className="mt-6 lg:mt-12">
                            <div className="text-sm sm:text-base text-gray-600 italic">
                                "I started investing at the age of 11. I was late!"
                            </div>

                            <div className="text-sm sm:text-base mt-2 text-black font-semibold">
                                Warren Buffett
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="w-full bg-white px-5 sm:px-8 lg:px-10 py-6 rounded-2xl shadow-sm">

                        {/* GOOGLE LOGIN */}
                            <button
                                type="button"
                                onClick={googleLogin}
                                className="flex justify-center gap-2 items-center border border-gray-300 py-3 w-full text-xs sm:text-sm rounded-lg font-semibold hover:bg-gray-50 cursor-pointer transition"
                            >
                            <img
                                src={GoogleIcon}
                                alt="google-icon"
                                className="object-cover bg-center h-4 w-4"
                            />

                            LOGIN USING GOOGLE
                        </button>

                        {/* DIVIDER */}
                        <div className="flex items-center gap-2 w-full mt-5">
                            <div className="h-px bg-gray-300 flex-1"></div>

                            <div className="text-gray-500 text-sm whitespace-nowrap">
                                or using email
                            </div>

                            <div className="h-px bg-gray-300 flex-1"></div>
                        </div>

                        {/* EMAIL */}
                        <div className="mt-5">
                            <label
                                htmlFor="email"
                                className="font-semibold text-sm text-[#333]"
                            >
                                Email
                            </label>

                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onBlur={() => {
                                    setTouched(prev => ({ ...prev, email: true }))
                                }}
                            />

                            {(touched.email || submitted) && errors.email && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* PASSWORD */}
                        <div className="mt-4">
                            <label
                                htmlFor="password"
                                className="font-semibold text-sm text-[#333]"
                            >
                                Password
                            </label>

                            <div className="relative">
                                <div
                                    className="absolute right-2 top-5"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                >
                                    {showPassword ? (
                                        <FaEye className="text-[#333] cursor-pointer" />
                                    ) : (
                                        <FaEyeSlash className="text-[#333] cursor-pointer" />
                                    )}
                                </div>

                                <Input
                                    id="password"
                                    name="password"
                                    type={
                                        !showPassword ? "password" : "text"
                                    }
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    onBlur={() => {
                                        setTouched(prev => ({ ...prev, password: true }))
                                    }}
                                />
                            </div>

                            {(touched.password || submitted) && errors.password && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* LOGIN + FORGOT PASSWORD */}
                        <div className="flex items-center gap-4 mt-6">
                            <div className="flex-1">
                                <Button
                                    style={{
                                        fontWeight: 600,
                                        fontSize: "16px",
                                        width: "100%",
                                    }}
                                    size="large"
                                    onClick={handleLogin}
                                >
                                    LOGIN
                                </Button>
                            </div>

                            <div className="text-indigo-600 text-sm whitespace-nowrap font-medium hover:underline hover:cursor-pointer">
                                Lost Password?
                            </div>
                        </div>

                        {/* REGISTER */}
                        <div className="text-sm text-center mt-6 text-gray-600">
                            Don't have an account?{" "}
                            <span
                                className="text-indigo-600 font-medium hover:underline hover:cursor-pointer"
                                onClick={() => navigate("/register")}
                            >
                                Register for free
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Login;