import React, { useRef, useState } from "react";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";
import { MdCheckCircle, MdWarning, MdCancel, MdClose } from "react-icons/md";

const ImportExcel = ({ onImportAll, validTickers = [], portfolioStocks = [] }) => {
    const [importedStocks, setImportedStocks] = useState([]);
    const [originalFile, setOriginalFile] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileImport = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                const data = new Uint8Array(evt.target.result);
                const workbook = XLSX.read(data, { type: "array" });
                const firstSheet = workbook.SheetNames[0];
                const sheet = workbook.Sheets[firstSheet];
                const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

                if (jsonData.length < 2) {
                    toast.error("Excel file is empty or has no data rows");
                    return;
                }

                const headers = jsonData[0].map((h) => String(h).toLowerCase().trim());
                const companyIdx = headers.findIndex((h) => h.includes("company"));
                const tickerIdx = headers.findIndex((h) => h.includes("ticker") || h.includes("symbol"));
                const qtyIdx = headers.findIndex((h) => h.includes("quantity") || h.includes("qty"));
                const priceIdx = headers.findIndex((h) => h.includes("price") || h.includes("buy"));

                if (tickerIdx === -1 || qtyIdx === -1 || priceIdx === -1) {
                    toast.error("Excel must have columns: Ticker, Quantity, Buy Price");
                    return;
                }

                const rows = jsonData.slice(1).filter((row) => row[tickerIdx]);

                const parsed = rows.map((row, idx) => {
                    const ticker = String(row[tickerIdx] || "").trim().toUpperCase();
                    const companyFromExcel = companyIdx !== -1 ? String(row[companyIdx] || "").trim() : "";
                    const matchedTicker = validTickers.find((t) => t.ticker?.toUpperCase() === ticker);
                    const company = companyFromExcel || matchedTicker?.companyName || ticker;

                    return {
                        id: `import-${idx}`,
                        company,
                        ticker,
                        quantity: Number(row[qtyIdx]) || 0,
                        buyPrice: Number(row[priceIdx]) || 0,
                    };
                }).filter((r) => r.ticker && r.quantity > 0 && r.buyPrice > 0);

                if (parsed.length === 0) {
                    toast.error("No valid rows found in the Excel file");
                    return;
                }

                // --- CROSS-REFERENCE against validTickers & portfolioStocks ---
                const validTickerSet = new Set(validTickers.map((t) => t.ticker?.toUpperCase()));
                const portfolioTickerSet = new Set(
                    portfolioStocks.map((s) => (s.symbol || s.stockSymbol || "").toUpperCase())
                );

                const categorized = parsed.map((stock) => {
                    const upperTicker = stock.ticker.toUpperCase();

                    if (!validTickerSet.has(upperTicker)) {
                        return { ...stock, status: "invalid", reason: "Ticker not recognized" };
                    }
                    if (portfolioTickerSet.has(upperTicker)) {
                        return { ...stock, status: "duplicate", reason: "Already in portfolio" };
                    }
                    return { ...stock, status: "new", reason: "" };
                });

                const newCount = categorized.filter((s) => s.status === "new").length;
                const dupCount = categorized.filter((s) => s.status === "duplicate").length;
                const invCount = categorized.filter((s) => s.status === "invalid").length;

                setImportedStocks(categorized);
                setOriginalFile(file);
                setShowModal(true);
                toast.success(
                    `${categorized.length} rows loaded — ${newCount} new, ${dupCount} duplicate, ${invCount} invalid`,
                    { duration: 4000 }
                );
            } catch (err) {
                console.log("Error parsing Excel", err);
                toast.error("Failed to parse Excel file");
            }
        };
        reader.readAsArrayBuffer(file);
        e.target.value = "";
    };

    const handleAddAll = async () => {
        if (!originalFile) {
            toast.error("No file to upload");
            return;
        }
        const newStocks = importedStocks.filter((s) => s.status === "new");
        if (newStocks.length === 0) {
            toast.error("No new stocks to add — remove duplicates/invalid rows first");
            return;
        }
        await onImportAll(originalFile);
        setImportedStocks([]);
        setOriginalFile(null);
        setShowModal(false);
    };

    const handleRemoveRow = (id) => {
        setImportedStocks((prev) => prev.filter((s) => s.id !== id));
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setImportedStocks([]);
        setOriginalFile(null);
    };

    const newCount = importedStocks.filter((s) => s.status === "new").length;
    const dupCount = importedStocks.filter((s) => s.status === "duplicate").length;
    const invCount = importedStocks.filter((s) => s.status === "invalid").length;

    const getRowStyle = (status) => {
        switch (status) {
            case "duplicate": return "bg-yellow-50";
            case "invalid": return "bg-red-50";
            default: return "";
        }
    };

    const getStatusBadge = (status, reason) => {
        switch (status) {
            case "new":
                return (
                    <span className="inline-flex items-center gap-1 text-green-600 text-xs font-medium">
                        <MdCheckCircle size={14} /> New
                    </span>
                );
            case "duplicate":
                return (
                    <span className="inline-flex items-center gap-1 text-yellow-600 text-xs font-medium">
                        <MdWarning size={14} /> {reason}
                    </span>
                );
            case "invalid":
                return (
                    <span className="inline-flex items-center gap-1 text-red-500 text-xs font-medium">
                        <MdCancel size={14} /> {reason}
                    </span>
                );
            default:
                return null;
        }
    };

    return (
        <>
            {/* IMPORT BUTTON */}
            <div className="w-full sm:w-52">
                <input
                    type="file"
                    ref={fileInputRef}
                    accept=".xlsx,.xls"
                    className="hidden"
                    onChange={handleFileImport}
                />
                <button
                    type="button"
                    className="flex justify-center gap-2 items-center border border-gray-300 py-1.5 w-full text-sm rounded-lg font-medium hover:bg-gray-50 cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                >
                    IMPORT (.XLSX)
                </button>
            </div>

            {/* MODAL OVERLAY */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col">
                        {/* MODAL HEADER */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                            <div>
                                <div className="text-xl font-semibold text-[#444]">
                                    Imported Stocks ({importedStocks.length})
                                </div>
                                <div className="flex gap-3 mt-1 text-xs">
                                    <span className="text-green-600 font-medium">✅ {newCount} new</span>
                                    <span className="text-yellow-600 font-medium">⚠️ {dupCount} duplicate</span>
                                    <span className="text-red-500 font-medium">❌ {invCount} invalid</span>
                                </div>
                            </div>
                            <button
                                className="text-gray-400 hover:text-gray-600 cursor-pointer"
                                onClick={handleCloseModal}
                            >
                                <MdClose size={24} />
                            </button>
                        </div>

                        {/* MODAL BODY */}
                        <div className="overflow-auto flex-1 px-6 py-4">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-gray-500 bg-gray-50 border-b border-gray-200 sticky top-0">
                                        <th className="px-4 text-left font-semibold py-3 text-sm">Company</th>
                                        <th className="px-4 text-left font-semibold py-3 text-sm">Ticker</th>
                                        <th className="px-4 text-left font-semibold py-3 text-sm">Quantity</th>
                                        <th className="px-4 text-left font-semibold py-3 text-sm">Buy Price</th>
                                        <th className="px-4 text-left font-semibold py-3 text-sm">Status</th>
                                        <th className="px-4 text-left font-semibold py-3 text-sm">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {importedStocks.map((stock) => (
                                        <tr key={stock.id} className={`border-b border-gray-100 text-sm ${getRowStyle(stock.status)}`}>
                                            <td className="px-4 py-3">{stock.company}</td>
                                            <td className="px-4 py-3 font-medium">{stock.ticker}</td>
                                            <td className="px-4 py-3">{stock.quantity}</td>
                                            <td className="px-4 py-3">₹{stock.buyPrice}</td>
                                            <td className="px-4 py-3">{getStatusBadge(stock.status, stock.reason)}</td>
                                            <td className="px-4 py-3">
                                                <button
                                                    className="text-red-500 hover:text-red-700 text-xs font-medium cursor-pointer"
                                                    onClick={() => handleRemoveRow(stock.id)}
                                                >
                                                    Remove
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* MODAL FOOTER */}
                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
                            <button
                                className="border border-gray-300 text-gray-600 px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 cursor-pointer transition"
                                onClick={handleCloseModal}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-indigo-500 hover:bg-indigo-400 text-white px-5 py-2 rounded-lg text-sm font-medium cursor-pointer transition"
                                onClick={handleAddAll}
                            >
                                Add {newCount} New to Portfolio
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ImportExcel;
