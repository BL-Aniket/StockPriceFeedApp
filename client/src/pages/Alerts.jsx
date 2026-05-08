import React, { useState } from "react";
import Input from "../components/Input/Input";
import Button from "../components/Button/Button";
import validator from "validator"

const Alerts = () => {
    const [stock, setStock] = useState("")
    const [upperLimit, setUpperLimit] = useState("")
    const [lowerLimit, setLowerLimit] = useState("")
    const [error, setError] = useState({})

    const validation = () => {
        let validate = true;
        const errorObj = {}

        if (validator.isEmpty(stock)) {
            validate = false;
            errorObj.stockError = "Please select a stock"
            setError(errorObj)
        }

        if (validator.isEmpty(upperLimit)) {
            validate = false;
            errorObj.upperLimitError = "Please select an Upper Limit"
            setError(errorObj)
        }

        if (validator.isEmpty(lowerLimit)) {
            validate = false;
            errorObj.lowerLimitError = "Please select a Lower Limit"
            setError(errorObj)
        }

        return validate;
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validation()) {
            return
        }

        setError({})

        // setStock("")
        // setUpperLimit("")
        // setLowerLimit("")
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

                            <select value={stock} className="border border-indigo-500 rounded-lg py-2.5 px-3 text-sm w-full focus:outline-none focus:ring-0" onChange={(e) => setStock(e.target.value)}>
                                <option>Select holding...</option>

                                <option>
                                    Reliance Industries Ltd. (RELIANCE)
                                </option>

                                <option>
                                    Tata Consultancy Services Ltd. (TCS)
                                </option>

                                <option>Infosys Ltd. (INFY)</option>

                                <option>
                                    OVERALL PORTFOLIO (Aggregated)
                                </option>
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
                <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-8">

                    <div className="text-xl sm:text-2xl font-medium">
                        Active Thresholds
                    </div>

                    <div className="mt-4 text-sm sm:text-base font-medium text-gray-500">
                        No active alerts configured.
                    </div>
                </div>

                {/* ALERT HISTORY */}
                <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-8">

                    <div className="text-xl sm:text-2xl font-medium">
                        Dispatched Alerts History
                    </div>

                    <div className="mt-4 text-sm sm:text-base font-medium text-gray-500 leading-relaxed">
                        No alerts triggered yet. Price monitoring is active.
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Alerts;