import React, { useEffect, useState } from "react";
import API from "../../API/axios";
import toast from "react-hot-toast";

const ActiveThresholds = ({ key }) => {
    const [thresholds, setThresholds] = useState([]);
    const [loading, setLoading] = useState(false);

    const userDetailsParsed = JSON.parse(localStorage.getItem("userDetails"));

    useEffect(() => {
        fetchActiveThresholds();
    }, []);

    const fetchActiveThresholds = async () => {
        try {
            setLoading(true);

            const response = await API.get(
                `/api/alerts/${userDetailsParsed.userId}/active`,
                {
                    headers: {
                        Authorization: `Bearer ${userDetailsParsed.token}`,
                    },
                }
            );

            setThresholds(response.data.data || []);
        } catch (err) {
            console.log("Error fetching thresholds", err);
            toast.error("Failed to load active thresholds");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-8">

            <div className="text-xl sm:text-2xl font-medium">
                Active Thresholds
            </div>

            {loading ? (
                <div className="mt-4 text-gray-500">
                    Loading...
                </div>
            ) : thresholds.length === 0 ? (
                <div className="mt-4 text-sm sm:text-base font-medium text-gray-500">
                    No active alerts configured.
                </div>
            ) : (
                <div className="mt-6 overflow-x-auto">

                    <table className="w-full border-collapse">

                        <thead>
                            <tr className="border-b border-gray-200 text-left text-gray-500">
                                <th className="py-4 font-medium">Target</th>
                                <th className="py-4 font-medium">Upper Boundary</th>
                                <th className="py-4 font-medium">Lower Boundary</th>
                                <th className="py-4 font-medium">Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {thresholds.map((item) => (
                                <tr
                                    key={item.id}
                                    className="border-b border-gray-100"
                                >
                                    <td className="py-5 font-normal text-lg">
                                        {item.stockSymbol}
                                    </td>

                                    <td className="py-5 text-green-500 font-medium">
                                        +{item.upperLimit}%
                                    </td>

                                    <td className="py-5 text-red-500 font-medium">
                                        -{item.lowerLimit}%
                                    </td>

                                    <td className="py-5">
                                        <span className="bg-red-100 text-red-500 text-xs font-semibold px-4 py-1 rounded-full">
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

export default ActiveThresholds;