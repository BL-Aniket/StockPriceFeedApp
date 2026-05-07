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

    const navigate = useNavigate()

    // Close dropdown when clicking outside
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
        <nav className="bg-white shadow px-3 py-1 flex justify-between gap-1 items-center">
            <FiUser className="text-indigo-500" />
            <div className="relative" ref={dropdownRef}>
                {/* Name */}
                <button
                    onClick={() => setOpen(!open)}
                    className="font-medium text-indigo-500 hover:text-indigo-700 cursor-pointer"
                >
                    ANIKET.PAWAR
                </button>

                {/* Dropdown */}
                {open && (
                    <div className="absolute -right-8 mt-3 w-48 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50">
                        <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2" onClick={() => {
                            navigate("/profile")
                        }}>
                            <LuSlidersHorizontal className="text-indigo-500" />
                            Profile
                        </div>

                        <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2" onClick={() => {
                            navigate("/alerts")
                        }}>
                            <FaRegBell className="text-indigo-500" />
                            Alerts
                        </div>

                        <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2" onClick={() => {
                            navigate("/login")
                        }}>
                            <IoPower className="text-indigo-500" />
                            Logout
                        </div>
                    </div>
                )}
            </div>
            <FaChevronDown />
        </nav>
    );
};

export default NavbarDropdown;