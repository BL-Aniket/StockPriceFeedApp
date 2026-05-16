import React, { useEffect, useState } from "react";
import API from "../../API/axios";
import toast from "react-hot-toast";

const AlertHistory = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    const userDetailsParsed = JSON.parse(localStorage.getItem("userDetails"));

    useEffect(() => {
        fetchAlertHistory();
    }, []);

    const fetchAlertHistory = async () => {
        try {
            setLoading(true);

            const response = await API.get(
                `/api/alerts/${userDetailsParsed.userId}/history`,
                {
                    headers: {
                        Authorization: `Bearer ${userDetailsParsed.token}`,
                    },
                }
            );

            setHistory(response.data.data || []);
        } catch (err) {
            console.log("Error fetching alert history", err);
            toast.error("Failed to load alert history");
        } finally {
            setLoading(false);
        }
    };

    const getStatusStyle = (status) => {
        switch (status?.toUpperCase()) {
            case "TRIGGERED":
                return "bg-red-100 text-red-500";

            case "ACTIVE":
                return "bg-green-100 text-green-600";

            default:
                return "bg-gray-100 text-gray-500";
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-8">

            {/* TITLE */}
            <div className="text-xl sm:text-2xl font-medium">
                Dispatched Alerts History
            </div>

            {/* LOADING */}
            {loading ? (
                <div className="mt-4 text-gray-500">
                    Loading...
                </div>
            ) : history.length === 0 ? (
                <div className="mt-4 text-sm sm:text-base font-medium text-gray-500 leading-relaxed">
                    No alerts triggered yet. Price monitoring is active.
                </div>
            ) : (
                <div className="mt-6 overflow-x-auto">

                    <table className="w-full border-collapse">

                        {/* HEADER */}
                        <thead>
                            <tr className="border-b border-gray-200 text-left text-gray-500">

                                <th className="py-4 font-medium">
                                    Symbol
                                </th>

                                <th className="py-4 font-medium">
                                    Alert Type
                                </th>

                                <th className="py-4 font-medium">
                                    Triggered Price
                                </th>

                                <th className="py-4 font-medium">
                                    Limit Crossed
                                </th>

                                <th className="py-4 font-medium">
                                    Time
                                </th>

                                <th className="py-4 font-medium">
                                    Status
                                </th>
                            </tr>
                        </thead>

                        {/* BODY */}
                        <tbody>
                            {history.map((item) => (
                                <tr
                                    key={item.id}
                                    className="border-b border-gray-100"
                                >
                                    {/* SYMBOL */}
                                    <td className="py-5 font-semibold text-lg">
                                        {item.stockSymbol}
                                    </td>

                                    {/* ALERT TYPE */}
                                    <td className="py-5">
                                        {item.alertType}
                                    </td>

                                    {/* TRIGGERED PRICE */}
                                    <td className="py-5 font-medium">
                                        ₹{item.triggeredPrice}
                                    </td>

                                    {/* LIMIT CROSSED */}
                                    <td
                                        className={`py-5 font-medium ${
                                            item.alertType === "UPPER_LIMIT"
                                                ? "text-green-500"
                                                : "text-red-500"
                                        }`}
                                    >
                                        {item.alertType === "UPPER_LIMIT"
                                            ? "+"
                                            : "-"}
                                        {item.limitCrossed}%
                                    </td>

                                    {/* TIMESTAMP */}
                                    <td className="py-5 text-sm text-gray-500">
                                        {new Date(item.timestamp).toLocaleString()}
                                    </td>

                                    {/* STATUS */}
                                    <td className="py-5">
                                        <span
                                            className={`text-xs font-semibold px-4 py-1 rounded-full ${getStatusStyle(
                                                item.status
                                            )}`}
                                        >
                                            {item.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AlertHistory;