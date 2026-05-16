import React, { useEffect, useState } from "react";
import { LuSlidersHorizontal } from "react-icons/lu";
import { MdOutlineEdit } from "react-icons/md";
import { RiKey2Line } from "react-icons/ri";
import Input from "../components/Input/Input";
import Button from "../components/Button/Button";
import API from "../API/axios";
import toast from "react-hot-toast";

const Profile = () => {

    const [profileDetails, setProfileDetails] = useState(true);
    const [changePassword, setChangePassword] = useState(false);

    // EMAIL EDIT STATE
    const [isEditingEmail, setIsEditingEmail] = useState(false);

    // PROFILE DATA
    const [profileData, setProfileData] = useState({
        username: "",
        email: "",
        about: ""
    });

    // PASSWORD DATA
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    // =========================
    // FETCH PROFILE
    // =========================
    useEffect(() => {

        fetchProfile();

    }, []);

    const fetchProfile = async () => {

        try {

            // CHANGE API IF YOUR SWAGGER HAS DIFFERENT ENDPOINT
            const response = await API.get(
                "/api/auth/profile"
            );

            console.log("Profile Response", response.data);

            setProfileData({
                username: response.data.data.username || "",
                email: response.data.data.email || "",
                about: response.data.data.about || ""
            });

        } catch (error) {

            console.log(error);

            toast.error("Failed to fetch profile");
        }
    };

    // =========================
    // UPDATE PROFILE
    // =========================
    const handleUpdateProfile = async () => {

        try {

            if (!profileData.username) {
                toast.error("Username is required");
                return;
            }

            if (!profileData.email) {
                toast.error("Email is required");
                return;
            }

            const emailRegex =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(profileData.email)) {
                toast.error("Please enter valid email");
                return;
            }

            const payload = {
                username: profileData.username,
                email: profileData.email,
                about: profileData.about
            };

            console.log("Update Payload", payload);

            const response = await API.put(
                "/api/auth/profile",
                payload
            );

            console.log(
                "Update Profile Response",
                response.data
            );

            toast.success(
                "Profile Updated Successfully"
            );

            // CLOSE EMAIL EDIT
            setIsEditingEmail(false);

        } catch (error) {

            console.log(error);

            toast.error(
                error?.response?.data?.message ||
                "Profile Update Failed"
            );
        }
    };

    // =========================
    // CHANGE PASSWORD
    // =========================
    const handleChangePassword = async () => {

        try {

            if (!passwordData.currentPassword) {
                toast.error("Current password is required");
                return;
            }

            if (!passwordData.newPassword) {
                toast.error("New password is required");
                return;
            }

            if (!passwordData.confirmPassword) {
                toast.error("Confirm password is required");
                return;
            }

            if (
                passwordData.newPassword !==
                passwordData.confirmPassword
            ) {
                toast.error(
                    "New password and confirm password do not match"
                );
                return;
            }

            if (
                passwordData.currentPassword ===
                passwordData.newPassword
            ) {
                toast.error(
                    "New password cannot be same as current password"
                );
                return;
            }

            if (passwordData.newPassword.length < 8) {
                toast.error(
                    "Password must be at least 8 characters"
                );
                return;
            }

            const payload = {
                currentPassword:
                    passwordData.currentPassword,
                newPassword:
                    passwordData.newPassword,
                confirmPassword:
                    passwordData.confirmPassword,
            };

            console.log(
                "Change Password Payload",
                payload
            );

            const response = await API.post(
                "/api/auth/change-password",
                payload
            );

            console.log(
                "Change Password Response",
                response.data
            );

            toast.success(
                "Password Updated Successfully"
            );

            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });

            setTimeout(() => {

                localStorage.removeItem(
                    "userDetails"
                );

                window.location.href = "/login";

            }, 1500);

        } catch (error) {

            console.log(
                "Change Password Error",
                error
            );

            toast.error(
                error?.response?.data?.message ||
                "Password Change Failed"
            );
        }
    };

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
                            className={`flex items-center gap-2 justify-center px-4 py-2 rounded-lg text-sm cursor-pointer transition-all duration-300 ${
                                profileDetails
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
                            className={`flex items-center gap-2 justify-center px-4 py-2 rounded-lg text-sm cursor-pointer transition-all duration-300 ${
                                changePassword
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
                                        {profileData.email}
                                    </div>

                                    {/* EMAIL TEXT */}
                                    {!isEditingEmail && (
                                        <div className="font-medium break-all">
                                            {profileData.email}
                                        </div>
                                    )}

                                    {/* EMAIL INPUT */}
                                    {isEditingEmail && (
                                        <div className="w-full sm:w-[350px]">
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={profileData.email}
                                                onChange={(e) =>
                                                    setProfileData({
                                                        ...profileData,
                                                        email:
                                                            e.target.value
                                                    })
                                                }
                                            />
                                        </div>
                                    )}

                                    {/* CHANGE BUTTON */}
                                    <div
                                        className="flex gap-1 items-center text-sm text-indigo-500 cursor-pointer"
                                        onClick={() =>
                                            setIsEditingEmail(
                                                !isEditingEmail
                                            )
                                        }
                                    >
                                        <MdOutlineEdit />

                                        <div className="hover:underline">
                                            {isEditingEmail
                                                ? "Cancel"
                                                : "Change"}
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
                                    value={profileData.username}
                                    onChange={(e) =>
                                        setProfileData({
                                            ...profileData,
                                            username: e.target.value
                                        })
                                    }
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
                                        value={profileData.about}
                                        onChange={(e) =>
                                            setProfileData({
                                                ...profileData,
                                                about: e.target.value
                                            })
                                        }
                                        className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-0 focus:border-blue-700 placeholder:text-sm focus:shadow-md px-3 py-3 mt-2 resize-none"
                                    />
                                </div>
                            </div>

                            {/* BUTTON */}
                            <div className="w-full sm:w-60 mt-8">
                                <Button
                                    size="medium"
                                    onClick={handleUpdateProfile}
                                >
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
                                    value={
                                        passwordData.currentPassword
                                    }
                                    onChange={(e) =>
                                        setPasswordData({
                                            ...passwordData,
                                            currentPassword:
                                                e.target.value
                                        })
                                    }
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
                                    value={
                                        passwordData.newPassword
                                    }
                                    onChange={(e) =>
                                        setPasswordData({
                                            ...passwordData,
                                            newPassword:
                                                e.target.value
                                        })
                                    }
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
                                    value={passwordData.confirmPassword}
                                    onChange={(e) =>
                                        setPasswordData({
                                            ...passwordData,
                                            confirmPassword: e.target.value
                                        })
                                    }
                                />
                            </div>

                            {/* BUTTON */}
                            <div className="w-full sm:w-72 mt-8">
                                <Button
                                    size="medium"
                                    onClick={handleChangePassword}
                                >
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