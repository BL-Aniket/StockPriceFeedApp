import React, { useState } from "react";
import { LuSlidersHorizontal } from "react-icons/lu";
import { MdOutlineEdit } from "react-icons/md";
import { RiKey2Line } from "react-icons/ri";
import Input from "../components/Input/Input";
import Button from "../components/Button/Button";

const Profile = () => {
    const [profileDetails, setProfileDetails] = useState(true)
    const [changePassword, setChangePassword] = useState(false)

    return (
        <section className="bg-gray-100 py-10 min-h-screen w-full flex flex-col relative">
            <div className="max-w-4xl mx-auto w-full mb-5">
                <div className="text-gray-500 text-sm mb-5">Dashboard / Profile</div>
                <div className="bg-white w-full py-10 px-8">
                    <div className="text-3xl font-medium">
                        Profile Settings</div>
                    <div className="flex gap-5 items-center mt-10">
                        <div className={profileDetails ? "border border-gray-500 flex items-center gap-2 justify-center px-2 py-1 rounded text-sm cursor-pointer" : "border border-gray-300 flex items-center rounded gap-2 justify-center px-2 py-1 hover:bg-gray-100 cursor-pointer transition-all duration-300 text-sm"} onClick={() => { setProfileDetails(true); setChangePassword(false) }}>
                            <LuSlidersHorizontal />
                            <div className="">Profile Details</div>
                        </div>
                        <div className={changePassword ? "border border-gray-500 flex items-center gap-2 justify-center px-2 py-1 rounded text-sm cursor-pointer" : "border border-gray-300 flex items-center rounded gap-2 justify-center px-2 py-1 hover:bg-gray-100 cursor-pointer transition-all duration-300 text-sm"} onClick={() => { setChangePassword(true); setProfileDetails(false) }}>
                            <RiKey2Line />
                            <div className="text-gray-500">Change Password</div>
                        </div>
                    </div>

                    <div className="h-0.5 mt-5 bg-gray-200 w-full"></div>

                    {profileDetails && <div className="mt-10">
                        <div className="text-sm font-medium">Registered Email</div>
                        <div className="flex items-center gap-3"><div className="font-medium">aniket.pawar@bridgelabz.com</div><div className="flex gap-1 items-center text-sm"><MdOutlineEdit /><div className="hover:underline cursor-pointer">Change</div></div></div>

                        <div className="mt-5">
                            <label htmlFor="quantity" className="font-semibold text-sm text-[#333]">
                                Display Name
                            </label>
                            <Input id="buyPrice" name="buyPrice" type="text" placeholder="ANIKET.PAWAR" />
                        </div>

                        <div className="mt-5">
                            <label htmlFor="quantity" className="font-semibold text-sm text-[#333]">
                                About <span className="text-gray-400"> - Optional</span>
                            </label>
                            <div>
                                <textarea rows={5} id="buyPrice" name="buyPrice" type="text" className="w-full border border-gray-300 rounded-lg focus:outline-0 focus:ring-0 focus:border-blue-700 placeholder:text-sm focus:shadow-md px-2 py-2 w-full mt-2" />
                            </div>
                        </div>
                        <div className="w-1/4 mt-8">
                            <Button size="medium">Save Changes</Button>
                        </div>
                    </div>}

                    {changePassword &&
                        <div>
                            <div className="mt-5">
                                <label htmlFor="quantity" className="font-semibold text-sm text-[#333]">
                                    Current Password
                                </label>
                                <Input id="buyPrice" name="buyPrice" type="text" placeholder="" />
                            </div>

                            <div className="mt-5">
                                <label htmlFor="quantity" className="font-semibold text-sm text-[#333]">
                                    New Password
                                </label>
                                <Input id="buyPrice" name="buyPrice" type="text" placeholder="" />
                            </div>

                            <div className="mt-5">
                                <label htmlFor="quantity" className="font-semibold text-sm text-[#333]">
                                    Confirm New Password
                                </label>
                                <Input id="buyPrice" name="buyPrice" type="text" placeholder="" />
                            </div>
                            <div className="w-1/4 mt-8">
                                <Button size="medium">UPDATE PASSWORD</Button>
                            </div>
                        </div>}
                </div>
            </div>
        </section>
    )
}

export default Profile