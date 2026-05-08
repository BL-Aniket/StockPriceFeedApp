import React, { useState } from "react";
import { LuSlidersHorizontal } from "react-icons/lu";
import { MdOutlineEdit } from "react-icons/md";
import { RiKey2Line } from "react-icons/ri";
import Input from "../components/Input/Input";
import Button from "../components/Button/Button";

const Profile = () => {
    const [profileDetails, setProfileDetails] = useState(true);
    const [changePassword, setChangePassword] = useState(false);

    return (
        <section className="bg-gray-100 min-h-screen w-full py-5 sm:py-8 px-3 sm:px-5">

            <div className="max-w-5xl mx-auto w-full">

                {/* BREADCRUMB */}
                <div className="text-gray-500 text-sm mb-5">
                    Dashboard / Profile
                </div>

                {/* MAIN CARD */}
                <div className="bg-white w-full rounded-2xl border border-gray-200 p-5 sm:p-8 lg:p-10">

                    {/* TITLE */}
                    <div className="text-2xl sm:text-3xl font-medium">
                        Profile Settings
                    </div>

                    {/* TABS */}
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 items-start sm:items-center mt-8">

                        {/* PROFILE DETAILS TAB */}
                        <div
                            className={`flex items-center gap-2 justify-center px-4 py-2 rounded-lg text-sm cursor-pointer transition-all duration-300 ${profileDetails
                                ? "border border-gray-500 bg-gray-50"
                                : "border border-gray-300 hover:bg-gray-100"
                                }`}
                            onClick={() => {
                                setProfileDetails(true);
                                setChangePassword(false);
                            }}
                        >
                            <LuSlidersHorizontal />

                            <div
                                className={
                                    profileDetails
                                        ? "text-black font-medium"
                                        : "text-gray-500"
                                }
                            >
                                Profile Details
                            </div>
                        </div>

                        {/* CHANGE PASSWORD TAB */}
                        <div
                            className={`flex items-center gap-2 justify-center px-4 py-2 rounded-lg text-sm cursor-pointer transition-all duration-300 ${changePassword
                                ? "border border-gray-500 bg-gray-50"
                                : "border border-gray-300 hover:bg-gray-100"
                                }`}
                            onClick={() => {
                                setChangePassword(true);
                                setProfileDetails(false);
                            }}
                        >
                            <RiKey2Line />

                            <div
                                className={
                                    changePassword
                                        ? "text-black font-medium"
                                        : "text-gray-500"
                                }
                            >
                                Change Password
                            </div>
                        </div>
                    </div>

                    {/* DIVIDER */}
                    <div className="h-px mt-6 bg-gray-200 w-full"></div>

                    {/* PROFILE DETAILS */}
                    {profileDetails && (
                        <div className="mt-8">

                            {/* EMAIL */}
                            <div>
                                <div className="text-sm font-medium text-gray-500">
                                    Registered Email
                                </div>

                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">

                                    <div className="font-medium break-all">
                                        aniket.pawar@bridgelabz.com
                                    </div>

                                    <div className="flex gap-1 items-center text-sm text-indigo-500">
                                        <MdOutlineEdit />

                                        <div className="hover:underline cursor-pointer">
                                            Change
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* DISPLAY NAME */}
                            <div className="mt-6">
                                <label
                                    htmlFor="displayName"
                                    className="font-semibold text-sm text-[#333]"
                                >
                                    Display Name
                                </label>

                                <Input
                                    id="displayName"
                                    name="displayName"
                                    type="text"
                                    placeholder="ANIKET.PAWAR"
                                />
                            </div>

                            {/* ABOUT */}
                            <div className="mt-6">
                                <label
                                    htmlFor="about"
                                    className="font-semibold text-sm text-[#333]"
                                >
                                    About{" "}
                                    <span className="text-gray-400 font-medium">
                                        - Optional
                                    </span>
                                </label>

                                <div>
                                    <textarea
                                        rows={5}
                                        id="about"
                                        name="about"
                                        className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-0 focus:border-blue-700 placeholder:text-sm focus:shadow-md px-3 py-3 mt-2 resize-none"
                                    />
                                </div>
                            </div>

                            {/* BUTTON */}
                            <div className="w-full sm:w-60 mt-8">
                                <Button size="medium">
                                    Save Changes
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* CHANGE PASSWORD */}
                    {changePassword && (
                        <div className="mt-8">

                            {/* CURRENT PASSWORD */}
                            <div>
                                <label
                                    htmlFor="currentPassword"
                                    className="font-semibold text-sm text-[#333]"
                                >
                                    Current Password
                                </label>

                                <Input
                                    id="currentPassword"
                                    name="currentPassword"
                                    type="password"
                                    placeholder="Enter current password"
                                />
                            </div>

                            {/* NEW PASSWORD */}
                            <div className="mt-6">
                                <label
                                    htmlFor="newPassword"
                                    className="font-semibold text-sm text-[#333]"
                                >
                                    New Password
                                </label>

                                <Input
                                    id="newPassword"
                                    name="newPassword"
                                    type="password"
                                    placeholder="Enter new password"
                                />
                            </div>

                            {/* CONFIRM PASSWORD */}
                            <div className="mt-6">
                                <label
                                    htmlFor="confirmPassword"
                                    className="font-semibold text-sm text-[#333]"
                                >
                                    Confirm New Password
                                </label>

                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    placeholder="Confirm new password"
                                />
                            </div>

                            {/* BUTTON */}
                            <div className="w-full sm:w-72 mt-8">
                                <Button size="medium">
                                    UPDATE PASSWORD
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Profile;