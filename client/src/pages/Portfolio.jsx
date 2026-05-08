import React, { useState } from "react";
import Input from "../components/Input/Input";
import Button from "../components/Button/Button";
import SearchableDropdown from "../components/Input/SearchableInput";
import { MdCurrencyRupee } from "react-icons/md";

const Portfolio = () => {
    const [portfoliosList, setPortfoliosList] = useState([]);
    const [symbol, setSymbol] = useState("");
    const [company, setCompany] = useState("");
    const [quantity, setQuantity] = useState("");
    const [buyPrice, setBuyPrice] = useState("");

    const options = [
        {
            symbol: "RELIANCE",
            name: "Reliance Industries Ltd.",
            ltp: 1460,
        },
        {
            symbol: "TCS",
            name: "Tata Consultancy Services Ltd.",
            ltp: 2426.8,
        },
        {
            symbol: "HDFCBANK",
            name: "HDFC Bank Ltd.",
            ltp: 775.7,
        },
        {
            symbol: "INFY",
            name: "Infosys Ltd.",
            ltp: 1175,
        },
        {
            symbol: "ITC",
            name: "ITC Ltd.",
            ltp: 311.8,
        },
        {
            symbol: "SBIN",
            name: "State Bank of India",
            ltp: 1064.5,
        },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();

        const selectedPortfolio = options.find(
            (item) => item.symbol === symbol
        );

        if (!selectedPortfolio) return;

        const obj = {
            symbol: symbol,
            company: company,
            quantity: Number(quantity),
            buyPrice: Number(buyPrice),
            ltp: selectedPortfolio.ltp,
            currentValue: Number(
                (selectedPortfolio.ltp * quantity).toFixed(2)
            ),
            gainLoss:
                selectedPortfolio.ltp < buyPrice
                    ? Number(
                        (
                            buyPrice * quantity -
                            selectedPortfolio.ltp * quantity
                        ).toFixed(2)
                    )
                    : Number(
                        (
                            selectedPortfolio.ltp * quantity -
                            buyPrice * quantity
                        ).toFixed(2)
                    ),
            gainLossPercent:
                ((selectedPortfolio.ltp - buyPrice) / buyPrice) * 100,
        };

        setPortfoliosList((prev) => [...prev, obj]);

        setCompany("");
        setBuyPrice("");
        setQuantity("");
    };

    return (
        <section className="bg-gray-100 min-h-screen w-full py-5 sm:py-8 px-3 sm:px-5">
            {/* FORM CARD */}
            <div className="bg-white max-w-5xl mx-auto p-5 sm:p-8 rounded-2xl border border-gray-200">

                {/* HEADING */}
                <div className="text-2xl sm:text-3xl font-medium text-center leading-snug">
                    Add companies to Core Watchlist
                </div>

                <div className="text-gray-500 font-medium text-sm sm:text-base text-center mt-4 max-w-2xl mx-auto leading-relaxed">
                    Keep track of latest announcements, insider trades and
                    credit ratings of your portfolio.
                </div>

                {/* FORM */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">

                    {/* COMPANY */}
                    <div>
                        <label
                            htmlFor="companyName"
                            className="font-medium text-sm block mb-2"
                        >
                            Company Name
                        </label>

                        <SearchableDropdown
                            company={company}
                            setCompany={setCompany}
                            setSymbol={setSymbol}
                            options={options}
                        />
                    </div>

                    {/* QUANTITY */}
                    <div>
                        <label
                            htmlFor="quantity"
                            className="font-medium text-sm block mb-2"
                        >
                            Quantity
                        </label>

                        <Input
                            id="quantity"
                            name="quantity"
                            type="number"
                            value={quantity}
                            placeholder="e.g. 50"
                            onChange={(e) => setQuantity(e.target.value)}
                        />
                    </div>

                    {/* BUY PRICE */}
                    <div>
                        <label
                            htmlFor="buyPrice"
                            className="font-medium text-sm block mb-2"
                        >
                            Buy Price (₹)
                        </label>

                        <Input
                            id="buyPrice"
                            name="buyPrice"
                            type="number"
                            value={buyPrice}
                            placeholder="e.g. 1500"
                            onChange={(e) => setBuyPrice(e.target.value)}
                        />
                    </div>
                </div>

                {/* BUTTONS */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mt-8">

                    <div className="w-full sm:w-32">
                        <Button size="small" onClick={handleSubmit}>
                            ADD
                        </Button>
                    </div>

                    <div className="w-full sm:w-52">
                        <button
                            type="submit"
                            className="flex justify-center gap-2 items-center border border-gray-300 py-1.5 w-full text-sm rounded-lg font-medium hover:bg-gray-50 cursor-pointer"
                        >
                            IMPORT (.XLSX)
                        </button>
                    </div>
                </div>
            </div>

            {/* TABLE */}
            {portfoliosList?.length > 0 ? (
                <div className="mt-6 max-w-7xl mx-auto">

                    {/* MOBILE CARDS */}
                    <div className="block lg:hidden space-y-4">

                        {portfoliosList.map((item, idx) => (
                            <div
                                key={idx}
                                className="bg-white rounded-2xl border border-gray-200 p-5"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-semibold text-lg">
                                            {item.company}
                                        </div>

                                        <div className="text-sm text-gray-500 mt-1">
                                            {item.symbol}
                                        </div>
                                    </div>

                                    <div
                                        className={`text-sm font-medium ${item.ltp < item.buyPrice
                                            ? "text-red-500"
                                            : "text-green-500"
                                            }`}
                                    >
                                        {Number(item.gainLossPercent).toFixed(2)}%
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mt-5 text-sm">

                                    <div>
                                        <div className="text-gray-500">
                                            Quantity
                                        </div>

                                        <div className="font-medium mt-1">
                                            {item.quantity}
                                        </div>
                                    </div>

                                    <div>
                                        <div className="text-gray-500">
                                            Buy Price
                                        </div>

                                        <div className="font-medium mt-1 flex items-center">
                                            <MdCurrencyRupee />
                                            {item.buyPrice}
                                        </div>
                                    </div>

                                    <div>
                                        <div className="text-gray-500">
                                            LTP
                                        </div>

                                        <div className="font-medium mt-1 flex items-center text-indigo-500">
                                            <MdCurrencyRupee />
                                            {item.ltp}
                                        </div>
                                    </div>

                                    <div>
                                        <div className="text-gray-500">
                                            Current Value
                                        </div>

                                        <div className="font-medium mt-1 flex items-center">
                                            <MdCurrencyRupee />
                                            {item.currentValue}
                                        </div>
                                    </div>
                                </div>

                                <div
                                    className={`mt-5 flex items-center text-sm font-medium ${item.ltp < item.buyPrice
                                        ? "text-red-500"
                                        : "text-green-500"
                                        }`}
                                >
                                    <MdCurrencyRupee />
                                    {item.gainLoss} (
                                    {Number(item.gainLossPercent).toFixed(2)}%)
                                </div>

                                <div className="flex gap-5 mt-5">
                                    <button className="text-sm font-medium text-blue-500">
                                        Edit
                                    </button>

                                    <button className="text-sm font-medium text-red-500">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* DESKTOP TABLE */}
                    <div className="hidden lg:block overflow-x-auto bg-white rounded-2xl border border-gray-200">

                        <table className="w-full min-w-[1100px]">
                            <thead>
                                <tr className="text-gray-500 bg-gray-50 border-b border-gray-200">
                                    <th className="px-4 text-left font-medium py-4">
                                        Company
                                    </th>

                                    <th className="px-4 text-left font-medium py-4">
                                        Ticker
                                    </th>

                                    <th className="px-4 text-left font-medium py-4">
                                        Quantity
                                    </th>

                                    <th className="px-4 text-left font-medium py-4">
                                        Avg Buy Price
                                    </th>

                                    <th className="px-4 text-left font-medium py-4">
                                        LTP (Live)
                                    </th>

                                    <th className="px-4 text-left font-medium py-4">
                                        Current Value
                                    </th>

                                    <th className="px-4 text-left font-medium py-4">
                                        Gain/Loss
                                    </th>

                                    <th className="px-4 text-left font-medium py-4">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {portfoliosList.map((item, idx) => (
                                    <tr
                                        key={idx}
                                        className="bg-white text-[15px] border-b border-gray-100"
                                    >
                                        <td className="px-4 py-4">
                                            {item.company}
                                        </td>

                                        <td className="px-4 py-4">
                                            {item.symbol}
                                        </td>

                                        <td className="px-4 py-4">
                                            {item.quantity}
                                        </td>

                                        <td className="px-4 py-4">
                                            <div className="flex items-center">
                                                <MdCurrencyRupee />
                                                {item.buyPrice}
                                            </div>
                                        </td>

                                        <td className="px-4 py-4">
                                            <div className="flex items-center text-indigo-500 font-medium">
                                                <MdCurrencyRupee />
                                                {item.ltp}
                                            </div>
                                        </td>

                                        <td className="px-4 py-4">
                                            <div className="flex items-center font-medium">
                                                <MdCurrencyRupee />
                                                {item.currentValue}
                                            </div>
                                        </td>

                                        <td className="px-4 py-4">
                                            <div
                                                className={`flex items-center font-medium ${item.ltp < item.buyPrice
                                                    ? "text-red-500"
                                                    : "text-green-500"
                                                    }`}
                                            >
                                                <MdCurrencyRupee />
                                                {item.gainLoss} (
                                                {Number(
                                                    item.gainLossPercent
                                                ).toFixed(2)}
                                                %)
                                            </div>
                                        </td>

                                        <td className="px-4 py-4">
                                            <div className="flex gap-4 items-center">
                                                <button className="text-sm font-medium text-blue-500">
                                                    Edit
                                                </button>

                                                <button className="text-sm font-medium text-red-500">
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="bg-white py-3 px-4 rounded-xl mx-auto w-full text-center max-w-5xl mt-6 border border-gray-200 text-sm sm:text-base">
                    Your Portfolio is Empty. Add a Stock or Import to Start
                    Tracking.
                </div>
            )}
        </section>
    );
};

export default Portfolio;