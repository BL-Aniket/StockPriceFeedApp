import React, { Children } from "react";
import Navbar from "../components/Navbar/Navbar";
import GoogleIcon from "../assets/images/google.png"
import Input from "../components/Input/Input";
import Button from "../components/Button/Button";
import { useNavigate } from "react-router-dom";


const Login = () => {
    const navigate = useNavigate()

    return (
        <section className="min-h-screen w-full bg-gray-100">
            {/* <Navbar /> */}
            <div className="flex w-full min-h-full items-center">
                <div className="grid grid-cols-2 gap-24 max-w-4xl mx-auto items-center my-28">
                    <div className="">
                        <div className="text-4xl font-medium">
                            Welcome back!
                        </div>
                        <div className="text-base mt-7 text-gray-600 font-medium">
                            Login to your account using your email and password
                        </div>
                        <div className="text-[14px] mt-7 font-medium text-gray-600">
                            Don't have an account? <span className="text-blue-700 hover:underline cursor-pointer">Register for free</span>
                        </div>
                        <div className="text-md mt-20 text-gray-600 italic">
                            "I started investing at the age of 11. I was late!"
                        </div>
                        <div className="text-md mt-2 text-black font-semibold">
                            Warren Buffett
                        </div>
                    </div>

                    <div className="max-w-4xl bg-white px-10 py-5 rounded-xl">
                        <button type="submit" className="flex justify-center gap-2 items-center border border-gray-300 py-3 w-full text-[13px] rounded-lg font-semibold hover:bg-gray-50 cursor-pointer">
                            <img src={GoogleIcon} alt="google-icon" className="object-cover bg-center h-4 w-4" /> LOGIN USING GOOGLE
                        </button>
                        <div className="flex items-center gap-2 w-full mt-5">
                            <div className="h-px bg-gray-300 flex-1"></div>

                            <div className="text-gray-500 text-sm whitespace-nowrap">
                                or using email
                            </div>

                            <div className="h-px bg-gray-300 flex-1"></div>
                        </div>
                        <div className="mt-5">
                            <label htmlFor="email" className="font-semibold text-sm text-[#333]">Email</label>
                            <Input id="email" name="email" type="email" placeholder="Enter email" />
                        </div>
                        <div className="mt-5">
                            <label htmlFor="password" className="font-semibold text-sm text-[#333]">Password</label>
                            <Input id="password" name="password" type="password" placeholder="Enter password" />
                        </div>
                        <div className="grid grid-cols-3 gap-5 mt-5 items-center">
                            <div className="col-span-2">
                                <Button size="large" onClick={() => { navigate("/watchlist"); console.log("adadafaf") }}>Login</Button>
                            </div>
                            <div className="text-indigo-600 text-[13px] whitespace-nowrap font-medium hover:underline hover:cursor-pointer">Lost Password?</div>
                        </div>
                        <div className="text-sm text-center mt-7 text-gray-600">
                            Don't have an account? <span className="text-indigo-600 font-medium hover:underline hover:cursor-pointer">Register for free</span>
                        </div>
                    </div>
                </div>
            </div>

        </section >
    )
}

export default Login;