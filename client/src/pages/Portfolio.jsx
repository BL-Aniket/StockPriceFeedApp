import React, { useEffect, useEffectEvent, useState } from "react";
import Input from "../components/Input/Input";
import Button from "../components/Button/Button";
import SearchableDropdown from "../components/Input/SearchableInput";
import { MdCurrencyRupee } from "react-icons/md";
import validator from "validator"
import API from "../API/axios";
import toast from "react-hot-toast";

const Portfolio = () => {
    const [portfoliosList, setPortfoliosList] = useState([]);
    const [symbol, setSymbol] = useState("");
    const [company, setCompany] = useState("");
    const [quantity, setQuantity] = useState("");
    const [buyPrice, setBuyPrice] = useState("");
    const [options, setOptions] = useState([])
    const [stockID, setStockID] = useState("")
    const [error, setError] = useState({})
    const [submitted, setSubmitted] = useState(false)
    const [touched, setTouched] = useState({
        companyName: false,
        quantity: false,
        buyPrice: false
    });
    const [errors, setErrors] = useState({
        companyName: "",
        quantity: "",
        buyPrice: "",
    });

    const userDetailsParsed = JSON.parse(localStorage.getItem("userDetails"))

    useEffect(() => {
        getMarketTickers();
    }, [])

    useEffect(() => {
        getData()
    }, [])

    // =========================
    // DEBOUNCED CompanyName VALIDATION
    // =========================
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!company.trim()) {
                setErrors((prev) => ({
                    ...prev,
                    companyName: "Company Name is required",
                }));
            } else {
                setErrors((prev) => ({
                    ...prev,
                    companyName: "",
                }));
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [company]);

    // =========================
    // DEBOUNCED QUANTITY VALIDATION
    // =========================
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!quantity.trim()) {
                setErrors((prev) => ({
                    ...prev,
                    quantity: "Quantity is required",
                }));
            } else if (!validator.isNumeric(quantity)) {
                setErrors((prev) => ({
                    ...prev,
                    quantity: "Please enter a numeric value",
                }));
            } else if (
                quantity <= 0
            ) {
                setErrors((prev) => ({
                    ...prev,
                    quantity:
                        "Quantity should be more than 0",
                }));
            } else {
                setErrors((prev) => ({
                    ...prev,
                    quantity: "",
                }));
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [quantity]);

    // =========================
    // DEBOUNCED BUY PRICE VALIDATION
    // =========================
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!buyPrice.trim()) {
                setErrors((prev) => ({
                    ...prev,
                    buyPrice: "Buy Price is required",
                }));
            } else if (
                !validator.isNumeric(buyPrice)
            ) {
                setErrors((prev) => ({
                    ...prev,
                    buyPrice:
                        "Please enter a numeric value",
                }));
            } else if (
                buyPrice <= 0
            ) {
                setErrors((prev) => ({
                    ...prev,
                    buyPrice:
                        "Buy Price should be more than 0",
                }));
            } else {
                setErrors((prev) => ({
                    ...prev,
                    buyPrice: "",
                }));
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [buyPrice]);

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
                companyName: item.companyName
            }))

            setOptions(result)
            console.log(result)
        } catch (error) {
            console.log("Error getting stocks list", error.response)
        }
    }

    const handleSubmit = async (e) => {
        try {
            e.preventDefault()

            setSubmitted(true)

            // Prevent registration if validation errors exist
            if (errors.companyName !== "" || errors.quantity !== "" || errors.buyPrice !== "") {
                toast.error("Please fix validation errors");
                return;
            }

            const formValues = {
                id: 0,
                userId: userDetailsParsed.userId,
                stockSymbol: symbol,
                quantity: quantity,
                buyPrice: buyPrice,
                thresholdPrice: 0,
                thresholdAlertSent: true
            }

            if (stockID !== "") {
                const response = await API.put(`/portfolio/${userDetailsParsed.userId}`, formValues, {
                    headers: {
                        'Authorization': `Bearer ${userDetailsParsed.token}`
                    }
                })

                toast.success("Stock Portfolio Edited Successfully!");

                console.log("Portfolio Edited Successfully!", response.data)

                getData();
            } else {
                const response = await API.post("/portfolio/add", formValues, {
                    headers: {
                        'Authorization': `Bearer ${userDetailsParsed.token}`
                    }
                })

                toast.success("Stock Portfolio Added Successfully!");

                console.log("Portfolio Submitted Successfully!", response.data)
                getData()
            }

            setCompany("")
            setSymbol("")
            setQuantity("")
            setBuyPrice("")

        } catch (error) {
            console.log("Error submitting portfolios", error)
        }
    }

    const getData = async () => {
        try {
            const response = await API.get(`/portfolio/${userDetailsParsed.userId}`, {
                headers: {
                    'Authorization': `Bearer ${userDetailsParsed.token}`
                }
            })

            console.log("response portfolio list", response.data)

            setPortfoliosList(response.data)
        } catch (error) {
            console.log("Error getting portfolio list", error)
        }
    }

    const handleEdit = async (stockID) => {
        try {
            console.log("stockId", stockID)
            const getData = await API.get(`/portfolio/${userDetailsParsed.userId}`, {
                headers: {
                    'Authorization': `Bearer ${userDetailsParsed.token}`
                }
            })

            console.log("response edit values", getData.data)


            setStockID(stockID)

            const result = await getData.data.stocks.map((item) => {
                setCompany(item.companyName);
                setQuantity(item.quantity);
                setBuyPrice(item.buyPrice)
            })

        } catch (error) {
            console.log("Error editing the portfolio stock", error)
        }
    }

    const handleDelete = async (stockID, stockSymbol) => {
        try {
            const askConfirmation = await confirm(`Are you sure you want to remove ${stockSymbol} from your portfolio?`)

            if (askConfirmation) {
                const response = await API.delete(`/portfolio/${userDetailsParsed.userId}`, {
                    headers: {
                        'Authorization': `Bearer ${userDetailsParsed.token}`
                    }
                })

                toast.success(`Stock Portfolio ${stockSymbol} Deleted!`);

                getData()

                console.log("response delete stock", response.data)
            } else {
                console.log("clicked cancel")
            }
        } catch (error) {
            console.log("Error deleting stock", error)
        }
    }


    return (
        <section className="bg-gray-100 min-h-screen w-full py-5 sm:py-8 px-3 sm:px-5">
            {/* FORM CARD */}
            <div className="bg-white max-w-4xl mx-auto p-5 sm:p-8 rounded-2xl border border-gray-200">

                {/* HEADING */}
                <div className="text-xl sm:text-2xl font-semibold text-[#444] text-center leading-snug">
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
                            className="font-medium text-sm block mb-0.5"
                        >
                            Company Name
                        </label>

                        <SearchableDropdown
                            company={company}
                            setCompany={setCompany}
                            setSymbol={setSymbol}
                            options={options}
                            onBlur={() => {
                                setTouched((prev) => ({
                                    ...prev,
                                    companyName: true
                                }))
                            }}
                        />

                        {(touched.companyName || submitted) && errors.companyName && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.companyName}
                            </p>
                        )}
                    </div>

                    {/* QUANTITY */}
                    <div>
                        <label
                            htmlFor="quantity"
                            className="font-medium text-sm block mb-0.5"
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
                            onBlur={() => {
                                setTouched((prev) => ({
                                    ...prev,
                                    quantity: true
                                }))
                            }}
                        />

                        {(touched.quantity || submitted) && errors.quantity && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.quantity}
                            </p>
                        )}                    </div>

                    {/* BUY PRICE */}
                    <div>
                        <label
                            htmlFor="buyPrice"
                            className="font-medium text-sm block mb-0.5"
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
                            onBlur={() => {
                                setTouched((prev) => ({
                                    ...prev,
                                    buyPrice: true
                                }))
                            }}
                        />

                        {(touched.buyPrice || submitted) && errors.buyPrice && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.buyPrice}
                            </p>
                        )}
                    </div>
                </div>

                {/* BUTTONS */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mt-8">

                    <div className="w-full sm:w-32">
                        <Button size="small" onClick={handleSubmit}>
                            {stockID !== "" ? "UPDATE" : "ADD"}
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
            {portfoliosList ? (
                <div className="mt-6 max-w-4xl mx-auto">

                    {/* DESKTOP TABLE */}
                    <div className="overflow-x-auto bg-white rounded-2xl border border-gray-200">

                        <table className="w-full max-w-4xl">
                            <thead>
                                <tr className="text-gray-500 bg-gray-50 border-b border-gray-200">
                                    <th className="px-4 text-left font-semibold py-4 text-sm">
                                        Company
                                    </th>

                                    <th className="px-4 text-left font-semibold py-4 text-sm">
                                        Ticker
                                    </th>

                                    <th className="px-4 text-left font-semibold py-4 text-sm">
                                        Quantity
                                    </th>

                                    <th className="px-4 text-left font-semibold py-4 text-sm">
                                        Avg Buy Price
                                    </th>

                                    <th className="px-4 text-left font-semibold py-4 text-sm">
                                        LTP (Live)
                                    </th>

                                    <th className="px-4 text-left font-semibold py-4 text-sm">
                                        Current Value
                                    </th>

                                    <th className="px-4 text-left font-semibold py-4 text-sm">
                                        Gain/Loss
                                    </th>

                                    <th className="px-4 text-left font-semibold py-4 text-sm">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {portfoliosList?.stocks?.map((item, idx) => (
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
                                                {item.currentPrice}
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
                                                <button className="text-sm font-medium text-blue-500 cursor-pointer hover:text-blue-700" onClick={() => { handleEdit(item.id) }}>
                                                    Edit
                                                </button>

                                                <button className="text-sm font-medium text-red-500 hover:text-red-700 cursor-pointer" onClick={() => {
                                                    handleDelete(item.id, item.symbol)
                                                }}>
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
                <div className="bg-white py-3 px-4 rounded-xl mx-auto w-full text-center max-w-4xl mt-6 border text-gray-500 border-gray-200 text-sm sm:text-base">
                    Your Portfolio is Empty. Add a Stock or Import to Start
                    Tracking.
                </div>
            )}
        </section>
    );
};

export default Portfolio;

{/* MOBILE CARDS */ }
{/* <div className="block lg:hidden space-y-4">

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
                                    <div className="flex items-center justify-center"><MdCurrencyRupee />
                                        {item.gainLoss}</div>
                                    (
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
                    </div> */}

// const options = [
//     {
//         symbol: "RELIANCE",
//         name: "Reliance Industries Ltd.",
//         ltp: 1460,
//     },
//     {
//         symbol: "TCS",
//         name: "Tata Consultancy Services Ltd.",
//         ltp: 2426.8,
//     },
//     {
//         symbol: "HDFCBANK",
//         name: "HDFC Bank Ltd.",
//         ltp: 775.7,
//     },
//     {
//         symbol: "INFY",
//         name: "Infosys Ltd.",
//         ltp: 1175,
//     },
//     {
//         symbol: "ITC",
//         name: "ITC Ltd.",
//         ltp: 311.8,
//     },
//     {
//         symbol: "SBIN",
//         name: "State Bank of India",
//         ltp: 1064.5,
//     },
// ];





// Old handleSubmit function

// const handleSubmit = (e) => {
//     e.preventDefault();

//     if (!validation()) {
//         return;
//     }

//     const selectedPortfolio = options.find(
//         (item) => item.symbol === symbol
//     );

//     if (!selectedPortfolio) return;

//     const obj = {
//         symbol: symbol,
//         company: company,
//         quantity: Number(quantity),
//         buyPrice: Number(buyPrice),
//         ltp: selectedPortfolio.ltp,
//         currentValue: Number(
//             (selectedPortfolio.ltp * quantity).toFixed(2)
//         ),
//         gainLoss:
//             selectedPortfolio.ltp < buyPrice
//                 ? Number(
//                     (
//                         buyPrice * quantity -
//                         selectedPortfolio.ltp * quantity
//                     ).toFixed(2)
//                 )
//                 : Number(
//                     (
//                         selectedPortfolio.ltp * quantity -
//                         buyPrice * quantity
//                     ).toFixed(2)
//                 ),
//         gainLossPercent:
//             ((selectedPortfolio.ltp - buyPrice) / buyPrice) * 100,
//     };

//     setPortfoliosList((prev) => [...prev, obj]);

//     setCompany("");
//     setBuyPrice("");
//     setQuantity("");

//     setError({})
// };