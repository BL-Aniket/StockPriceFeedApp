import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import Input from "../Input/Input";
import { IoIosSearch } from "react-icons/io";
import NavbarDropdown from "./NavbarDropdown";

const Navbar = () => {
    const location = useLocation()

    console.log("location.pathname", location.pathname)

    const onThisPages = location.pathname.includes("/watchlist") || location.pathname.includes("/alerts") || location.pathname.includes("/profile")

    return (
        <section className="bg-white h-15 flex flex-column items-center">
            <div className="text=[#333] text-2xl font-bold indent-48">
                portfolio<span className="text-lime-400!">alert</span>
            </div>

            {onThisPages && <div className="flex justify-center items-center gap-3 ms-28">
                <NavLink to="/watchlist" className={({ isActive }) => isActive ? "text-indigo-500 underline-offset-8 hover:text-indigo-700 text-sm tracking-wider cursor-pointer font-medium underline" : "text-gray-500 hover:text-gray-600 text-sm tracking-wider cursor-pointer font-medium"}>
                    PORTFOLIOS
                </NavLink>
                <NavLink to="/alerts" className={({ isActive }) => isActive ? "text-indigo-500 underline-offset-8 hover:text-indigo-700 text-sm tracking-wider cursor-pointer font-medium underline" : "text-gray-500 hover:text-gray-600 text-sm tracking-wider cursor-pointer font-medium"}>
                    ALERTS
                </NavLink>
            </div>}

            {onThisPages && <div className="relative ms-56">
                <div className="absolute left-2 top-4">
                    <IoIosSearch />
                </div>
                <input className="border border-gray-300 rounded-lg focus:outline-0 focus:ring-0 focus:border-blue-700 placeholder:text-sm focus:shadow-md ps-8 py-1 w-full mt-2" placeholder="Search Portfolio..." />
            </div>}

            {onThisPages && <div className="relative ms-28">
                <NavbarDropdown />
            </div>}
        </section >
    )
}

export default Navbar