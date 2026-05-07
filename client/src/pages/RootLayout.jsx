import React from "react";
import { Outlet, useLocation, useNavigation } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
// import Footer from "../components/Footer/Footer";


const RootLayout = () => {
    const navigation = useNavigation()

    const location = useLocation()

    console.log("location.pathname", location.pathname)

    const onThisPages = location.pathname.includes("/watchlist") || location.pathname.includes("/alerts") || location.pathname.includes("/profile")

    const options = [
        {
            symbol: "RELIANCE",
            name: "Reliance Industries Ltd.",
            ltp: 1460,
        },
        {
            symbol: "TCS",
            name: "Tata Consultancy Services Ltd.",
            ltp: 2426.80
        },
        {
            symbol: "HDFCBANK",
            name: "HDFC Bank Ltd.",
            ltp: 775.70,
        },
        {
            symbol: "INFY",
            name: "Infosys Ltd.",
            ltp: 1175
        },
        {
            symbol: "ITC",
            name: "ITC Ltd.",
            ltp: 311.80
        },
        {
            symbol: "SBIN",
            name: "State Bank of India",
            ltp: 1064.50
        },
    ]

    return (
        <section>
            {/* <div className="sticky top-0 z-50"> */}
            <Navbar />
            {/* </div> */}
            <main className="">
                {navigation.state === "loading" && <p className="">Loading...</p>}
                <Outlet />
            </main>
            {/* <Footer /> */}
            {onThisPages && <div className="fixed bottom-0 w-full">
                <marquee loop="infinite" className="bg-white text-black py-2.5" scrollAmount={3}>
                    <div className="flex gap-12 items-center">
                        {options?.map((item, idx) => {
                            return (
                                <div className="flex gap-2 items-center">
                                    <div className="font-semibold">
                                        {item.symbol}
                                    </div>
                                    <div className="text-gray-500 font-medium">
                                        {item.ltp}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </marquee>
            </div>}
        </section>
    )
}

export default RootLayout