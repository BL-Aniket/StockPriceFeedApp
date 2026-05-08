import React from "react";
import Input from "../components/Input/Input";
import Button from "../components/Button/Button";

const Alerts = () => {
    return (
        <section className="bg-gray-100 min-h-screen w-full py-5 sm:py-8 px-3 sm:px-5">

            <div className="max-w-5xl mx-auto space-y-5">

                {/* ALERT SETTINGS CARD */}
                <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-8">

                    {/* HEADING */}
                    <div className="text-2xl sm:text-3xl font-medium text-center leading-snug">
                        Global Alert Settings
                    </div>

                    {/* DESCRIPTION */}
                    <div className="text-gray-500 font-medium text-sm sm:text-base text-center mt-4 max-w-3xl mx-auto leading-relaxed">
                        Set +/- % movement thresholds. The system will dispatch
                        an email alert when the live price crosses these bounds
                        relative to your average buy price.
                    </div>

                    {/* FORM */}
                    <div className="grid grid-cols-1 lg:grid-cols-7 gap-5 items-end mt-8">

                        {/* STOCK SELECT */}
                        <div className="lg:col-span-3 w-full">
                            <label
                                htmlFor="portfolio"
                                className="font-semibold text-sm block mb-2"
                            >
                                Stock from your Portfolio
                            </label>

                            <select className="border border-indigo-500 rounded-lg py-3 px-3 text-sm w-full focus:outline-none focus:ring-0">
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
                        </div>

                        {/* LIMIT INPUTS */}
                        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-5">

                            {/* UPPER LIMIT */}
                            <div>
                                <label
                                    htmlFor="upperLimit"
                                    className="font-semibold text-sm text-[#333] block mb-2"
                                >
                                    Upper Limit (+%)
                                </label>

                                <Input
                                    id="upperLimit"
                                    name="upperLimit"
                                    type="number"
                                    placeholder="e.g. 10"
                                />
                            </div>

                            {/* LOWER LIMIT */}
                            <div>
                                <label
                                    htmlFor="lowerLimit"
                                    className="font-semibold text-sm text-[#333] block mb-2"
                                >
                                    Lower Limit (-%)
                                </label>

                                <Input
                                    id="lowerLimit"
                                    name="lowerLimit"
                                    type="number"
                                    placeholder="e.g. 5"
                                />
                            </div>
                        </div>

                        {/* BUTTON */}
                        <div className="w-full lg:w-auto">
                            <Button size="medium">
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