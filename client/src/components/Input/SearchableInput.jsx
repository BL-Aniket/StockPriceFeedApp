import React, { useState, useRef, useEffect } from "react";

// const options = [
//     "Apple",
//     "Banana",
//     "Orange",
//     "Mango",
//     "Pineapple",
//     "Grapes",
//     "Strawberry"
// ];

const SearchableDropdown = ({ company, setCompany, setSymbol, setCompanyId, options }) => {
    const [search, setSearch] = useState("");
    const [filtered, setFiltered] = useState(options);
    const [open, setOpen] = useState(false);

    const ref = useRef();

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Smart filter + ranking
    const handleChange = (e) => {
        const value = e.target.value;
        setSearch(value);
        setCompany(value)

        const filteredData = options
            .map((item, idx) => {
                const lowerSymbol = item.ticker.toLowerCase();
                const lowerName = item.companyName.toLowerCase();
                const lowerValue = value.toLowerCase();

                let score = 0;

                if (lowerSymbol.startsWith(lowerValue)) score = 3; // best match
                else if (lowerSymbol.includes(lowerValue)) score = 2;
                else if (lowerName.includes(lowerValue)) score = 1;

                return { item, score };
            })
            .filter((obj) => obj.score > 0 || value === "")
            .sort((a, b) => b.score - a.score)
            .map((obj) => obj.item);

        setFiltered(filteredData);
    };

    const handleSelect = (item) => {
        setCompany(item.companyName)
        setSymbol(item.ticker)
        if (setCompanyId) setCompanyId(item.id)
        setSearch(item.ticker);
        setOpen(false);
    };

    return (
        <div ref={ref} className="relative">
            {/* Input */}
            <input
                type="text"
                value={company}
                onClick={() => {
                    setOpen(true);
                    setFiltered(options); // show all on click
                }}
                onChange={handleChange}
                placeholder="Search by company name or ticker..."
                className="border border-gray-300 rounded-lg focus:outline-0 focus:ring-0 focus:border-blue-700 placeholder:text-sm focus:shadow-md px-2 py-2 w-full mt-2"
            />

            {/* Dropdown */}
            {open && (
                <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {filtered.length > 0 ? (
                        filtered.map((item, index) => (
                            <li
                                key={index}
                                onClick={() => handleSelect(item)}
                                className="flex gap-2 items-center justify-start px-3 py-2 cursor-pointer hover:bg-gray-100"
                            >
                                <div className="font-medium text-[15px]">
                                    {item.ticker}
                                </div>
                                <div className="text-xs font-medium text-gray-500">
                                    {item.companyName}
                                </div>
                            </li>
                        ))
                    ) : (
                        <li className="px-3 py-2 text-gray-500">
                            No results found
                        </li>
                    )}
                </ul>
            )}
        </div>
    );
};

export default SearchableDropdown;