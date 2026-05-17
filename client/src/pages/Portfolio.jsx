import React, { useEffect, useState } from "react";
import Input from "../components/Input/Input";
import Button from "../components/Button/Button";
import SearchableDropdown from "../components/Input/SearchableInput";
import ImportExcel from "../components/ImportExcel/ImportExcel";
import { MdCurrencyRupee } from "react-icons/md";
import validator from "validator"
import API from "../API/axios";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { useSearch } from "../context/SearchContext";
const Portfolio = () => {
    const [portfoliosList, setPortfoliosList] = useState([]);
    const [symbol, setSymbol] = useState("");
    const [company, setCompany] = useState("");
    const [companyId, setCompanyId] = useState(0);
    const [quantity, setQuantity] = useState("");
    const [buyPrice, setBuyPrice] = useState("");
    const [options, setOptions] = useState([])
    const [stockID, setStockID] = useState("")
    const [error, setError] = useState({})
    const { searchTerm } = useSearch();
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
    const [livePrices, setLivePrices] = useState({});

    const userDetailsParsed = JSON.parse(localStorage.getItem("userDetails"))

    useEffect(() => {
        getMarketTickers();
    }, [])

    useEffect(() => {
        getData()
    }, [])

    // =========================
    // SSE STREAM FOR LIVE PRICES
    // =========================
    useEffect(() => {
        const token = userDetailsParsed.token;
        const userId = userDetailsParsed.userId;
        const baseUrl = import.meta.env.VITE_API_BASE_URL;
        let reader;
        let cancelled = false;

        const connectStream = async () => {
            try {
                const response = await fetch(`/portfolio/${userDetailsParsed.userId}/stream`, {
                    headers: {
                        'Authorization': `Bearer ${userDetailsParsed.token}`,
                        'Accept': 'text/event-stream',
                    }
                });

                if (!response.ok) {
                    console.log("SSE stream failed with status:", response.status);
                    if (!cancelled) setTimeout(connectStream, 5000);
                    return;
                }

                reader = response.body.getReader();
                const decoder = new TextDecoder();
                let buffer = '';

                while (!cancelled) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split('\n');
                    buffer = lines.pop() || '';

                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            try {
                                const data = JSON.parse(line.slice(6));
                                if (data.stocks) {
                                    const priceMap = {};
                                    data.stocks.forEach((stock) => {
                                        const ticker = (stock.symbol || "").toUpperCase();
                                        priceMap[ticker] = {
                                            currentPrice: stock.currentPrice,
                                            currentValue: stock.currentValue,
                                            gainLoss: stock.gainLoss,
                                            gainLossPercent: stock.gainLossPercent,
                                        };
                                    });
                                    setLivePrices(priceMap);
                                }
                            } catch (err) {
                                // skip non-JSON lines (heartbeats, comments)
                            }
                        }
                    }
                }
            } catch (err) {
                console.log("SSE stream error, retrying in 5s...", err);
                if (!cancelled) setTimeout(connectStream, 5000);
            }
        };

        connectStream();

        return () => {
            cancelled = true;
            if (reader) reader.cancel();
        };
    }, []);

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
            const result = response.data.data;
            setOptions(result)
            console.log(result)
        } catch (error) {
            console.log("Error getting stocks list", error.response)
            toast.error("Failed to load market tickers")
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
                userId: Number(userDetailsParsed.userId),
                stockSymbol: symbol,
                quantity: Number(quantity),
                buyPrice: Number(buyPrice),
                upperLimit: 0,
                lowerLimit: 0,
                upperAlertSent: true,
                lowerAlertSent: true
            }
          
            if (stockID !== "") {
                
                const response = await API.put(`/portfolio/${stockID}`, formValues, {
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
            setCompanyId(0)
            setQuantity("")
            setBuyPrice("")

        } catch (error) {
            console.log("Error submitting portfolios", error);
            console.log("Backend response:", error?.response?.data)
            toast.error(error?.response?.data?.message || "Failed to add stock")
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
            console.log("GET /portfolio response status:", error?.response?.status)
            console.log("GET /portfolio response data:", error?.response?.data)
            console.log("userId used:", userDetailsParsed.userId)
            toast.error(
                error?.response?.data?.message 
                || error?.response?.data?.error 
                || "Failed to load portfolio. Check backend logs."
            );
        }
    }

    const handleEdit = async (editStockId) => {
        try {
            console.log("stockId", editStockId)
            const response = await API.get(`/portfolio/${userDetailsParsed.userId}`, {
                headers: {
                    'Authorization': `Bearer ${userDetailsParsed.token}`
                }
            })

            console.log("response edit values", response.data)

            const stock = response.data.stocks.find((item) => item.id === editStockId);

            if (stock) {
                setStockID(editStockId);
                setCompany(stock.companyName || stock.company || "");
                setSymbol(stock.symbol || stock.stockSymbol || "");
                setQuantity(stock.quantity);
                setBuyPrice(stock.buyPrice);
            } else {
                toast.error("Stock not found in portfolio");
            }
        } catch (error) {
            console.log("Error editing the portfolio stock", error)
            toast.error("Failed to load stock details for editing")
        }
    }

    const handleDelete = async (deleteStockId, stockSymbol) => {
        try {
            const result = await Swal.fire({
                title: `Remove ${stockSymbol}?`,
                text: "This stock will be removed from your portfolio.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#ef4444",
                cancelButtonColor: "#6b7280",
                confirmButtonText: "Yes, remove it!",
            });

            if (result.isConfirmed) {
                const response = await API.delete(`/portfolio/${deleteStockId}`, {
                    headers: {
                        'Authorization': `Bearer ${userDetailsParsed.token}`
                    }
                })

                toast.success(`Stock ${stockSymbol} removed!`);

                getData()

                console.log("response delete stock", response.data)
            }
        } catch (error) {
            console.log("Error deleting stock", error)
            toast.error("Failed to delete stock");
        }
    }


   const handleImportAll = async (file) => {
        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await API.post(
                `/portfolio/bulk?userId=${userDetailsParsed.userId}`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${userDetailsParsed.token}`,
                        'Content-Type': 'multipart/form-data',
                    }
                }
            );

            const addedStocks = response.data || [];
            const count = Array.isArray(addedStocks) ? addedStocks.length : 0;
            toast.success(`${count} stocks added to portfolio!`);
            getData();
        } catch (err) {
            console.log("Bulk upload failed", err);
            toast.error(err?.response?.data?.message || "Bulk upload failed");
        }
    };
    const filteredPortfolioStocks =
        portfoliosList?.stocks?.filter((item) => {

            const search = searchTerm.toLowerCase();

            return (
                item.companyName?.toLowerCase().includes(search) ||
                item.symbol?.toLowerCase().includes(search)
            );
    }) || [];


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
                            setCompanyId={setCompanyId}
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

                    <ImportExcel 
                        onImportAll={handleImportAll}
                        validTickers={options}
                        portfolioStocks={portfoliosList?.stocks || []}
                    />
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
                                {filteredPortfolioStocks?.map((item, idx) => {
                                    const ticker = (item.symbol || "").toUpperCase();
                                    const live = livePrices[ticker];
                                    const ltp = live?.currentPrice ?? item.currentPrice ?? 0;
                                    const currentValue = live?.currentValue ?? item.currentValue ?? 0;
                                    const gainLoss = live?.gainLoss ?? item.gainLoss ?? 0;
                                    const gainLossPercent = live?.gainLossPercent ?? item.gainLossPercent ?? 0;

                                    return (
                                    <tr
                                        key={idx}
                                        className="bg-white text-[15px] border-b border-gray-100"
                                    >
                                        <td className="px-4 py-4">
                                            {item.companyName}
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
                                                {ltp}
                                            </div>
                                        </td>

                                        <td className="px-4 py-4">
                                            <div className="flex items-center font-medium">
                                                <MdCurrencyRupee />
                                                {currentValue}
                                            </div>
                                        </td>

                                        <td className="px-4 py-4">
                                            <div
                                                className={`flex items-center font-medium ${ltp < item.buyPrice
                                                    ? "text-red-500"
                                                    : "text-green-500"
                                                    }`}
                                            >
                                                <MdCurrencyRupee />
                                                {gainLoss} (
                                                {Number(gainLossPercent).toFixed(2)}
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
                                    );
                                })}
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
