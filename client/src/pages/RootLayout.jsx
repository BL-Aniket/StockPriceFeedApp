import React, { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate, useNavigation } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import { FaArrowTrendDown } from "react-icons/fa6";
import { FaArrowTrendUp } from "react-icons/fa6";
import toast from "react-hot-toast";
import API from "../API/axios";

const RootLayout = () => {
    const [options, setOptions] = useState([])
    const navigation = useNavigation();
    const location = useLocation();
    const navigate = useNavigate()

    const userDetailsParsed = JSON.parse(localStorage.getItem("userDetails"))

    const onThisPages =
        location.pathname.includes("/watchlist") ||
        location.pathname.includes("/alerts") ||
        location.pathname.includes("/profile");

    useEffect(() => {

        const userDetails = JSON.parse(
            localStorage.getItem("userDetails")
        );

        if (!userDetails?.token) {
            navigate("/login");
            toast.error("Please login first!")
        }

    }, []);

    useEffect(() => {
        getMarketTickers();
    }, [])



    // const options = [
    //     {
    //         symbol: "RELIANCE",
    //         name: "Reliance Industries Ltd.",
    //         ltp: 1460,
    //         deviation: 0.15,
    //     },
    //     {
    //         symbol: "TCS",
    //         name: "Tata Consultancy Services Ltd.",
    //         ltp: 2426.8,
    //         deviation: 0.11,
    //     },
    //     {
    //         symbol: "HDFCBANK",
    //         name: "HDFC Bank Ltd.",
    //         ltp: 775.7,
    //         deviation: 0.04,
    //     },
    //     {
    //         symbol: "INFY",
    //         name: "Infosys Ltd.",
    //         ltp: 1175,
    //         deviation: 0.07,
    //     },
    //     {
    //         symbol: "ITC",
    //         name: "ITC Ltd.",
    //         ltp: 311.8,
    //         deviation: 0.23,
    //     },
    //     {
    //         symbol: "SBIN",
    //         name: "State Bank of India",
    //         ltp: 1064.5,
    //         deviation: 0.09,
    //     },
    // ];

    const getMarketTickers = async () => {
        try {
            const response = await API.get("/api/home/market-ticker", {
                headers: {
                    'Authorization': `Bearer ${userDetailsParsed.token}`
                }
            })

            console.log("response.data stocks", response.data)

            const result = response.data.data.map((item) => ({
                ticker: item.ticker,
                changePercent: item.changePercent,
                currentPrice: item.currentPrice
            }))

            setOptions(result)
            console.log(result)
        } catch (error) {
            console.log("Error getting stocks list", error.response)
        }
    }

    return (
        <section className="min-h-screen flex flex-col">
            {/* NAVBAR */}
            <Navbar />

            {/* MAIN CONTENT */}
            <main className="flex-1">

                {/* LOADING */}
                {navigation.state === "loading" && (
                    <div className="w-full py-3 text-center text-sm sm:text-base font-medium bg-white border-b border-gray-200">
                        Loading...
                    </div>
                )}

                {/* PAGE CONTENT */}
                <Outlet />
            </main>

            {/* LIVE STOCK TICKER */}
            {onThisPages && (
                <div className="fixed bottom-0 left-0 w-full z-50 border-t border-gray-200 bg-white shadow-sm">

                    <marquee
                        loop="infinite"
                        scrollAmount={3}
                        className="py-2"
                    >
                        <div className="flex items-center gap-8 sm:gap-12 px-2">

                            {options?.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center gap-2 whitespace-nowrap"
                                >
                                    {/* SYMBOL */}
                                    <div className="font-semibold text-xs sm:text-sm text-black">
                                        {item.ticker}
                                    </div>

                                    {/* PRICE */}
                                    <div className="text-gray-500 font-medium text-xs sm:text-sm">
                                        {item.currentPrice}
                                    </div>

                                    {/* DEVIATION */}
                                    <div className={`${item.deviation < 0.10 ? "text-red-500" : "text-green-500"} font-medium text-xs sm:text-sm flex items-center gap-1`}>
                                        {item.changePercent < 0.10 ? <FaArrowTrendDown /> : <FaArrowTrendUp />}  {item.changePercent}%
                                    </div>

                                </div>
                            ))}
                        </div>
                    </marquee>
                </div>
            )}
        </section>
    );
};

export default RootLayout;