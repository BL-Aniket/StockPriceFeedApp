import React from "react";
import GoogleIcon from "../assets/images/google.png";
import Input from "../components/Input/Input";
import Button from "../components/Button/Button";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();

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
                            <span className="text-blue-700 hover:underline cursor-pointer">
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
                            type="submit"
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
                            />
                        </div>

                        {/* PASSWORD */}
                        <div className="mt-4">
                            <label
                                htmlFor="password"
                                className="font-semibold text-sm text-[#333]"
                            >
                                Password
                            </label>

                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Enter password"
                            />
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
                                    onClick={() => {
                                        navigate("/watchlist");
                                    }}
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
                            <span className="text-indigo-600 font-medium hover:underline hover:cursor-pointer">
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