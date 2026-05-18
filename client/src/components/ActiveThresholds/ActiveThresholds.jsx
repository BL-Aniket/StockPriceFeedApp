import React, { useEffect, useState } from "react";
import API from "../../API/axios";
import toast from "react-hot-toast";
import { useSearch } from "../../context/SearchContext";
const ActiveThresholds = ({ streamMessage, refreshKey }) => {
    const [thresholds, setThresholds] = useState([]);
    const [loading, setLoading] = useState(false);
    const { searchTerm } = useSearch();
    const userDetailsParsed = JSON.parse(localStorage.getItem("userDetails"));

    useEffect(() => {
        fetchActiveThresholds();
    }, [streamMessage, refreshKey]);

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

    const filteredThresholds = thresholds.filter((item) => {

    const search = searchTerm.toLowerCase();

    return (
        item.stockSymbol?.toLowerCase().includes(search) ||
        item.status?.toLowerCase().includes(search)
         );
    });

    return (
        <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-8">

            <div className="text-xl sm:text-2xl font-medium">
                Active Thresholds
            </div>

            {loading ? (
                <div className="mt-4 text-gray-500">
                    Loading...
                </div>
            ) : filteredThresholds.length === 0 ? (
                <div className="mt-4 text-sm sm:text-base font-medium text-gray-500">
                    {searchTerm
                        ? "No matching alerts found."
                        : "No active alerts configured."
                    }                
                </div>
            ) : (
                <div className="mt-6 overflow-x-auto w-full">

                    <table className="w-full min-w-[900px] whitespace-nowrap border-collapse">

                        <thead>
                            <tr className="border-b border-gray-200 text-left text-gray-500">
                                <th className="py-4 font-medium">Target</th>
                                <th className="py-4 font-medium">Upper Boundary</th>
                                <th className="py-4 font-medium">Lower Boundary</th>
                                <th className="py-4 font-medium">Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredThresholds.map((item) => (
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