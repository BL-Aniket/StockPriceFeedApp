import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { IoIosSearch } from "react-icons/io";
import NavbarDropdown from "./NavbarDropdown";

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const onThisPages =
        location.pathname.includes("/watchlist") ||
        location.pathname.includes("/alerts") ||
        location.pathname.includes("/profile");

    return (
        <section className="bg-white border-b border-gray-200 sticky top-0 z-50 w-full">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="h-16 flex items-center justify-between">

                    {/* LEFT SECTION */}
                    <div className="flex items-center gap-6 lg:gap-10">

                        {/* LOGO */}
                        <div
                            className="text-[#111] text-2xl font-bold cursor-pointer whitespace-nowrap"
                            onClick={() => navigate("/")}
                        >
                            portfolio
                            <span className="text-lime-400">alert</span>
                        </div>

                        {/* NAV LINKS */}
                        {onThisPages && (
                            <div className="flex items-center gap-4 sm:gap-6">

                                <NavLink
                                    to="/watchlist"
                                    className={({ isActive }) =>
                                        isActive
                                            ? "text-indigo-500 text-xs sm:text-sm tracking-wider font-medium underline underline-offset-8"
                                            : "text-gray-500 hover:text-gray-700 text-xs sm:text-sm tracking-wider font-medium transition"
                                    }
                                >
                                    PORTFOLIOS
                                </NavLink>

                                <NavLink
                                    to="/alerts"
                                    className={({ isActive }) =>
                                        isActive
                                            ? "text-indigo-500 text-xs sm:text-sm tracking-wider font-medium underline underline-offset-8"
                                            : "text-gray-500 hover:text-gray-700 text-xs sm:text-sm tracking-wider font-medium transition"
                                    }
                                >
                                    ALERTS
                                </NavLink>
                            </div>
                        )}
                    </div>

                    {/* RIGHT SECTION */}
                    {onThisPages && (
                        <div className="flex items-center gap-3 lg:gap-5">

                            {/* SEARCH - ONLY LARGE SCREENS */}
                            <div className="hidden lg:block relative">

                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                    <IoIosSearch size={18} />
                                </div>

                                <input
                                    className="border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 placeholder:text-sm focus:shadow-sm pl-10 py-2 w-72 xl:w-80 transition"
                                    placeholder="Search Portfolio..."
                                />
                            </div>

                            {/* USER DROPDOWN */}
                            <NavbarDropdown />
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Navbar;