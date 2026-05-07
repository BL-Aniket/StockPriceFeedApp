import React from "react";
import Input from "../components/Input/Input";
import Button from "../components/Button/Button";

const Alerts = () => {
    return (
        <section className="bg-gray-100 py-10 min-h-screen w-full flex flex-col relative">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white py-10 px-8">
                    <div className="text-2xl font-medium text-center">Global Alert Settings</div>
                    <div className="text-gray-500 font-medium text-center mt-5">Set +/- % movement thresholds. The system will dispatch an email alert when the live price crosses these bounds relative to your average buy price.</div>

                    <div className="grid grid-cols-7 gap-5 items-center mt-5 justify-center">
                        <div className="col-span-3 w-full">
                            <label htmlFor="portfolio" className="font-semibold text-sm">Stock from your Portfolio</label>
                            <select className="border border-indigo-500 rounded-lg py-3 ps-2 mt-2 text-sm w-full">
                                <option>Select holding...</option>
                                <option>Reliance Industries Ltd. (RELIANCE)</option>
                                <option>Tata Consultancy Services Ltd. (TCS)</option>
                                <option>Infosys Ltd. (INFY)</option>
                                <option>OVERALL PORTFOLIO (Aggregated)</option>
                            </select>
                        </div>
                        <div className="col-span-3 flex gap-5">
                            <div className="">
                                <label htmlFor="quantity" className="font-semibold text-sm text-[#333]">
                                    Upper Limit (+%)
                                </label>
                                <Input id="quantity" name="quantity" type="number" placeholder="e.g. 50" />
                            </div>
                            <div className="">
                                <label htmlFor="quantity" className="font-semibold text-sm text-[#333]">
                                    Lower Limit (-%)
                                </label>
                                <Input id="quantity" name="quantity" type="number" placeholder="e.g. 50" />
                            </div>
                        </div>
                        <div className="w-20 mt-8">
                            <Button size="medium">SAVE</Button>
                        </div>
                    </div>
                </div>

                <div className="bg-white py-10 px-8 mt-5">
                    <div className="text-lg font-medium">Active Thresholds</div>
                    <div className="mt-5 font-medium">No active alerts configured.</div>
                </div>

                <div className="bg-white py-10 px-8 mt-5">
                    <div className="text-lg font-medium">Dispatched Alerts History</div>
                    <div className="mt-5 font-medium text-gray-500">No alerts triggered yet. Price monitoring is active.</div>
                </div>

            </div>
        </section>
    )
}

export default Alerts