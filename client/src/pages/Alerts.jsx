import React, { useEffect, useState } from "react";
import Input from "../components/Input/Input";
import Button from "../components/Button/Button";
import API from "../API/axios";
import toast from "react-hot-toast";
import ActiveThresholds from "../components/ActiveThresholds/ActiveThresholds";
import AlertHistory from "../components/AlertHistory/AlertHistory";
const Alerts = () => {
    const [portfolioStocks, setPortfolioStocks] = useState([]);
    const [selectedStockId, setSelectedStockId] = useState("");
    const [upperLimit, setUpperLimit] = useState("")
    const [lowerLimit, setLowerLimit] = useState("")
    const [error, setError] = useState({})
    const [refreshKey, setRefreshKey] = useState(0);

    const userDetailsParsed = JSON.parse(localStorage.getItem("userDetails"));

    useEffect(() => {
        fetchPortfolioWithIds();
    }, []);

    const fetchPortfolioWithIds = async () => {
        try {
            const [tickerRes, portfolioRes] = await Promise.all([
                API.get("/api/home/market-ticker", {
                    headers: { 'Authorization': `Bearer ${userDetailsParsed.token}` }
                }),
                API.get(`/portfolio/${userDetailsParsed.userId}`, {
                    headers: { 'Authorization': `Bearer ${userDetailsParsed.token}` }
                })
            ]);

            // Build ticker → companyId map from market-ticker
            const tickerIdMap = {};
            (tickerRes.data.data || []).forEach((item, index) => {
                const id = item.id || index + 1;
                tickerIdMap[item.ticker?.toUpperCase()] = id;
            });

            // Merge portfolio stocks with company IDs
            const stocks = (portfolioRes.data.stocks || []).map((stock) => {
                const ticker = (stock.symbol || stock.stockSymbol || "").toUpperCase();
                return {
                    id: tickerIdMap[ticker] || stock.id,
                    ticker,
                    companyName: stock.company || stock.companyName || ticker,
                };
            });

            setPortfolioStocks(stocks);
        } catch (err) {
            console.log("Error fetching portfolio for alerts", err);
            toast.error("Failed to load portfolio stocks");
        }
    };

    const validation = () => {
        let validate = true;
        const errorObj = {}

        if (!selectedStockId) {
            validate = false;
            errorObj.stockError = "Please select a stock"
            setError(errorObj)
        }

        if (!upperLimit.trim() || Number(upperLimit) <= 0) {
            validate = false;
            errorObj.upperLimitError = "Please enter a valid Upper Limit"
            setError(errorObj)
        }

        if (!lowerLimit.trim() || Number(lowerLimit) <= 0) {
            validate = false;
            errorObj.lowerLimitError = "Please enter a valid Lower Limit"
            setError(errorObj)
        }

        return validate;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validation()) {
            return
        }

        setError({})

        try {
            const response = await API.put(
                `/portfolio/${selectedStockId}/threshold?upperLimit=${upperLimit}&lowerLimit=${lowerLimit}`,
                {},
                {
                    headers: { 'Authorization': `Bearer ${userDetailsParsed.token}` }
                }
            );

            console.log("Threshold saved:", response.data);
            toast.success(`Alert set for ${response.data.stockSymbol}: +${upperLimit}% / -${lowerLimit}%`);

            setUpperLimit("");
            setLowerLimit("");
            setSelectedStockId("");
            setRefreshKey((prev) => prev + 1);
        } catch (err) {
            console.log("Error saving threshold", err);
            toast.error(err?.response?.data?.message || "Failed to save alert");
        }
    }

    return (
        <section className="bg-gray-100 min-h-screen w-full py-5 sm:py-8 px-3 sm:px-5">

            <div className="max-w-4xl mx-auto space-y-5">

                {/* ALERT SETTINGS CARD */}
                <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-8">

                    {/* HEADING */}
                    <div className="text-xl sm:text-2xl text-[#444] font-semibold text-center leading-snug">
                        Global Alert Settings
                    </div>

                    {/* DESCRIPTION */}
                    <div className="text-gray-500 font-medium text-sm sm:text-base text-center mt-4 max-w-3xl mx-auto leading-relaxed">
                        Set +/- % movement thresholds. The system will dispatch
                        an email alert when the live price crosses these bounds
                        relative to your average buy price.
                    </div>

                    {/* FORM */}
                    <div className={`grid grid-cols-1 lg:grid-cols-7 gap-5 ${Object.values(error).length > 0 ? "items-center" : "items-end"} mt-8`}>

                        {/* STOCK SELECT */}
                        <div className="lg:col-span-3 w-full">
                            <label
                                htmlFor="portfolio"
                                className="font-medium text-sm block mb-2"
                            >
                                Stock from your Portfolio
                            </label>

                            <select value={selectedStockId} className="border border-indigo-500 rounded-lg py-2.5 px-3 text-sm w-full focus:outline-none focus:ring-0" onChange={(e) => setSelectedStockId(e.target.value)}>
                                <option value="">Select holding...</option>
                                <option value="overall">OVERALL PORTFOLIO (Aggregated)</option>
                                {portfolioStocks.map((s) => (
                                    <option key={s.id} value={s.id}>
                                        {s.companyName} ({s.ticker})
                                    </option>
                                ))}
                            </select>

                            {error.stockError && <div className="mt-1 text-xs sm:text-sm text-red-500">{error.stockError}</div>}
                        </div>

                        {/* LIMIT INPUTS */}
                        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 items-end gap-5">

                            {/* UPPER LIMIT */}
                            <div>
                                <label
                                    htmlFor="upperLimit"
                                    className="font-medium text-sm text-[#333] block"
                                >
                                    Upper Limit (+%)
                                </label>

                                <Input
                                    id="upperLimit"
                                    name="upperLimit"
                                    type="number"
                                    style={{ padding: "7px" }}
                                    value={upperLimit}
                                    placeholder="e.g. 10"
                                    onChange={(e) => setUpperLimit(e.target.value)}
                                />

                                {error.upperLimitError && <div className="mt-1 text-xs sm:text-sm text-red-500">{error.upperLimitError}</div>}
                            </div>

                            {/* LOWER LIMIT */}
                            <div>
                                <label
                                    htmlFor="lowerLimit"
                                    className="font-medium text-sm text-[#333] block"
                                >
                                    Lower Limit (-%)
                                </label>

                                <Input
                                    id="lowerLimit"
                                    name="lowerLimit"
                                    type="number"
                                    style={{ padding: "7px" }}
                                    placeholder="e.g. 5"
                                    value={lowerLimit}
                                    onChange={(e) => setLowerLimit(e.target.value)}
                                />

                                {error.lowerLimitError && <div className="mt-1 text-xs sm:text-sm text-red-500">{error.lowerLimitError}</div>}
                            </div>
                        </div>

                        {/* BUTTON */}
                        <div className="w-full lg:w-auto">
                            <Button size="medium" onClick={handleSubmit}>
                                SAVE
                            </Button>
                        </div>
                    </div>
                </div>

                {/* ACTIVE THRESHOLDS */}
              <ActiveThresholds key={refreshKey} />

                {/* ALERT HISTORY */}
               <AlertHistory />
            </div>
        </section>
    );
};

export default Alerts;