import React, { useState, useRef, useEffect } from "react";
import { FiUser } from "react-icons/fi";
import { FaChevronDown } from "react-icons/fa";
import { FaRegBell } from "react-icons/fa";
import { IoPower } from "react-icons/io5";
import { LuSlidersHorizontal } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

const NavbarDropdown = () => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>

            {/* BUTTON */}
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 border border-gray-200 rounded-lg px-2 sm:px-3 py-2 hover:bg-gray-50 transition"
            >
                <FiUser className="text-indigo-500 text-lg" />

                {/* SHOW NAME ONLY ON LARGE SCREENS */}
                <span className="hidden lg:block text-sm font-medium text-indigo-500">
                    ANIKET.PAWAR
                </span>

                <FaChevronDown className="text-xs text-gray-500" />
            </button>

            {/* DROPDOWN */}
            {open && (
                <div className="absolute right-0 mt-3 w-52 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50">

                    <div
                        className="px-4 py-3 hover:bg-gray-100 cursor-pointer flex items-center gap-3 text-sm"
                        onClick={() => {
                            navigate("/profile");
                            setOpen(false);
                        }}
                    >
                        <LuSlidersHorizontal className="text-indigo-500" />
                        Profile
                    </div>

                    <div
                        className="px-4 py-3 hover:bg-gray-100 cursor-pointer flex items-center gap-3 text-sm"
                        onClick={() => {
                            navigate("/alerts");
                            setOpen(false);
                        }}
                    >
                        <FaRegBell className="text-indigo-500" />
                        Alerts
                    </div>

                    <div
                        className="px-4 py-3 hover:bg-gray-100 cursor-pointer flex items-center gap-3 text-sm"
                        onClick={() => {
                            navigate("/login");
                            setOpen(false);
                        }}
                    >
                        <IoPower className="text-indigo-500" />
                        Logout
                    </div>
                </div>
            )}
        </div>
    );
};

export default NavbarDropdown;