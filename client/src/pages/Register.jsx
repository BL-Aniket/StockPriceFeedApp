import React, { useEffect, useState } from "react";
import GoogleIcon from "../assets/images/google.png";
import Input from "../components/Input/Input";
import Button from "../components/Button/Button";
import { useNavigate } from "react-router-dom";
import API from "../API/axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import validator from "validator";
import { useGoogleLogin } from "@react-oauth/google";

const Register = () => {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [touched, setTouched] = useState({
        username: false,
        email: false,
        password: false
    });
    const [errors, setErrors] = useState({
        username: "",
        email: "",
        password: "",
    });
    const navigate = useNavigate();

    const googleSignup = useGoogleLogin({
    onSuccess: async (tokenResponse) => {

        try {

            // Get user details from Google
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

            // Payload for backend
            const payload = {
                username: user.name,
                email: user.email,
                password: "Google@123"
            };

            // Register API
           await API.post(
    "/api/auth/register",
    payload,
    {
        headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
        },
    }
);

            toast.success("Google Registration Successful");

            navigate("/login");

        } catch (error) {

            console.log(error);

            toast.error("Google Registration Failed");
        }
    },

    onError: () => {
        toast.error("Google Login Failed");
    }
});
    // =========================
    // DEBOUNCED USERNAME VALIDATION
    // =========================
   useEffect(() => {
    const timer = setTimeout(() => {
        if (!username.trim()) {
            setErrors((prev) => ({
                ...prev,
                username: "Username is required",
            }));
        } else if (username.length < 3) {
            setErrors((prev) => ({
                ...prev,
                username: "Username must be at least 3 characters",
            }));
        } else {
            setErrors((prev) => ({
                ...prev,
                username: "",
            }));
        }
    }, 500);

    return () => clearTimeout(timer);
}, [username]);

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


    const handleRegister = async (e) => {
        try {
            e.preventDefault()

            setSubmitted(true)

            // Prevent registration if validation errors exist
            if (errors.username !== "" || errors.email !== "" || errors.password !== "") {
                toast.error("Please fix validation errors");
                return;
            }

            const formValues = {
                username: username,
                email: email,
                password: password
            }

            console.log("formValues", formValues)

            const response = await API.post("/api/auth/register", formValues)

            console.log("Register Response", response.data)

            toast.success("Registration Successful. Redirecting to Login");

            navigate("/login");

        } catch (error) {
            console.log("Error registering into the system", error)

            toast.error(
                error?.response?.data?.message || "Registration failed"
            );
        }
    }

    return (
        <section className="min-h-screen overflow-hidden w-full bg-gray-100 px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12 lg:py-16 xl:py-20">

            <div className="flex items-center justify-center h-full">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 xl:gap-20 w-full max-w-5xl items-start">

                    {/* LEFT SIDE */}
                    <div className="text-center lg:text-left mt-6 lg:mt-20">

                        <div className="text-2xl sm:text-3xl lg:text-[40px] font-medium leading-tight">
                            Get a free account
                        </div>

                        <div className="text-base sm:text-lg mt-4 text-gray-600 font-medium max-w-md mx-auto lg:mx-0">
                            Over 50 lakh investors use this for finding and tracking stock ideas.
                        </div>

                        <div className="text-sm sm:text-base mt-4 font-medium text-gray-600">
                            Already registered?{" "}
                            <span className="text-blue-700 hover:underline cursor-pointer" onClick={() => {
                                navigate("/login")
                            }}>
                                Login here
                            </span>
                        </div>

                        <div className="mt-6 lg:mt-32">
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
                            onClick={googleSignup}
                            className="flex justify-center gap-2 items-center border border-gray-300 py-3 w-full text-xs sm:text-sm rounded-lg font-semibold hover:bg-gray-50 cursor-pointer transition"
                        >
                            <img
                                src={GoogleIcon}
                                alt="google-icon"
                                className="object-cover bg-center h-4 w-4"
                            />

                            REGISTER USING GOOGLE
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
                                htmlFor="username"
                                className="font-semibold text-sm text-[#333]"
                            >
                                Username
                            </label>

                            <Input
                                id="username"
                                name="username"
                                type="text"
                                placeholder="Enter username"
                                onChange={(e) => { setUsername(e.target.value) }}
                                onBlur={() => {
                                    setTouched((prev) => ({
                                        ...prev,
                                        username: true
                                    }))
                                }}
                            />

                            {(touched.username || submitted) && errors.username && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.username}
                                </p>
                            )}
                        </div>

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
                                onChange={(e) => { setEmail(e.target.value) }}
                                onBlur={() => {
                                    setTouched((prev) => ({
                                        ...prev,
                                        email: true
                                    }))
                                }}
                            />

                            {(touched.email || submitted) && errors.email && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.email}
                                </p>
                            )}

                            <div className="text-gray-500 mt-2 text-xs">We promise we won't spam</div>
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
                                <div className="absolute right-2 top-5" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <FaEye className="text-[#333] cursor-pointer" /> : <FaEyeSlash className="text-[#333] cursor-pointer" />}
                                </div>

                                <Input
                                    id="password"
                                    name="password"
                                    type={!showPassword ? "password" : "text"}
                                    placeholder="Enter password"
                                    onChange={(e) => { setPassword(e.target.value) }}
                                    onBlur={() => {
                                        setTouched((prev) => ({
                                            ...prev,
                                            password: true
                                        }))
                                    }}
                                />

                                {(touched.password || submitted) && errors.password && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.password}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="text-xs mt-4 text-gray-500">By registering you agree to the <span className="text-indigo-500 hover:underline cursor-pointer" onClick={() => toast("Terms of Use coming soon", { icon: "ℹ️" })}>Terms of Use</span> and have read the <span className="text-indigo-500 hover:underline cursor-pointer" onClick={() => toast("Privacy Policy coming soon", { icon: "ℹ️" })}>Privacy Policy</span>.</div>

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
                                    onClick={handleRegister}
                                >
                                    CREATE ACCOUNT
                                </Button>
                            </div>


                        </div>


                    </div>
                </div>
            </div>
        </section>
    );
};

export default Register;