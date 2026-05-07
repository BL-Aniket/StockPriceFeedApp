import React, { useState } from "react"
import Input from "../components/Input/Input"
import Button from "../components/Button/Button";
import SearchableDropdown from "../components/Input/SearchableInput";
import { MdCurrencyRupee } from "react-icons/md";

const Portfolio = () => {
    const [portfoliosList, setPortfoliosList] = useState([])
    const [symbol, setSymbol] = useState("")
    const [company, setCompany] = useState("")
    const [quantity, setQuantity] = useState("")
    const [buyPrice, setBuyPrice] = useState("")

    const options = [
        {
            symbol: "RELIANCE",
            name: "Reliance Industries Ltd.",
            ltp: 1460,
        },
        {
            symbol: "TCS",
            name: "Tata Consultancy Services Ltd.",
            ltp: 2426.80
        },
        {
            symbol: "HDFCBANK",
            name: "HDFC Bank Ltd.",
            ltp: 775.70,
        },
        {
            symbol: "INFY",
            name: "Infosys Ltd.",
            ltp: 1175
        },
        {
            symbol: "ITC",
            name: "ITC Ltd.",
            ltp: 311.80
        },
        {
            symbol: "SBIN",
            name: "State Bank of India",
            ltp: 1064.50
        },
    ]

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("njsnsnsjds")

        const selectedPortfolio = options.find((item, idx) => item.symbol === symbol)


        console.log("selectedPortfolio", selectedPortfolio)

        if (!selectedPortfolio) return;

        const portfoliosList = []

        const obj = {
            symbol: symbol,
            company: company,
            quantity: Number(quantity),
            buyPrice: Number(buyPrice),
            ltp: selectedPortfolio.ltp,
            currentValue: Number((selectedPortfolio.ltp * quantity).toFixed(2)),
            gainLoss: selectedPortfolio.ltp < buyPrice ? Number(((buyPrice * quantity) - (selectedPortfolio.ltp * quantity)).toFixed(2)) : Number(((selectedPortfolio.ltp * quantity) - (buyPrice * quantity)).toFixed(2)),
            gainLossPercent: ((selectedPortfolio.ltp - buyPrice) / buyPrice) * 100
        }

        // portfoliosList.push(obj)

        setPortfoliosList((prev) => [...prev, obj])

        setCompany("")
        setBuyPrice("")
        setQuantity("")
    }

    console.log("symbol", symbol)

    console.log("portfolioList", portfoliosList)

    return (
        <section className="bg-gray-100 py-10 min-h-screen w-full flex flex-col relative">
            <div className="bg-white max-w-4xl mx-auto p-5 space-y-3">
                <div className="text-2xl text-center font-medium">Add companies to Core Watchlist</div>
                <div className="text-gray-500 font-medium text-sm text-center">Keep track of latest announcements, insider trades and credit ratings of your portfolio.</div>
                <div className="grid grid-cols-3 gap-4 items-center justify-center">
                    <div className="">
                        <label htmlFor="companyName" className="font-semibold text-sm text-[#333]">
                            Company Name
                        </label>
                        <SearchableDropdown company={company} setCompany={setCompany} setSymbol={setSymbol} options={options} />

                        {/* <Input id="companyName" name="companyName" type="text" placeholder="Search by company name and ticker..." /> */}
                    </div>
                    <div className="">
                        <label htmlFor="quantity" className="font-semibold text-sm text-[#333]">
                            Quantity
                        </label>
                        <Input id="quantity" name="quantity" type="number" value={quantity} placeholder="e.g. 50" onChange={(e) => setQuantity(e.target.value)} />
                    </div>
                    <div className="">
                        <label htmlFor="buyPrice" className="font-semibold text-sm text-[#333]">
                            Buy Price
                        </label>
                        <Input id="buyPrice" name="buyPrice" type="number" value={buyPrice} placeholder="e.g. 1500" onChange={(e) => setBuyPrice(e.target.value)} />
                    </div>
                </div>
                <div className="flex gap-3 justify-center items-center mx-auto">
                    <div className="w-20">
                        <Button size="small" onClick={handleSubmit}>ADD</Button>
                    </div>
                    <div className="w-40">
                        <button type="submit" className="flex justify-center gap-2 items-center border border-gray-300 py-1.5 w-full text-sm rounded-lg font-semibold hover:bg-gray-50 cursor-pointer">IMPORT (.XLSX)</button>
                    </div>
                </div>
            </div>


            {portfoliosList?.length > 0 ? <div className="mt-5 max-w-4xl mx-auto">
                <div className="table table-auto mx-auto">
                    <table>
                        <thead>
                            <tr className="text-gray-500 bg-gray-50 border border-gray-100">
                                <th className="px-3 text-left font-medium py-4">Company</th>
                                <th className="px-3 text-left font-medium py-4">Ticker</th>
                                <th className="px-3 text-left font-medium py-4">Quantity</th>
                                <th className="px-3 text-left font-medium py-4">Avg Buy Price</th>
                                <th className="px-3 text-left font-medium py-4">LTP (Live)</th>
                                <th className="px-3 text-left font-medium py-4">Current Value</th>
                                <th className="px-3 text-left font-medium py-4">Gain/Loss</th>
                                <th className="px-3 text-left font-medium py-4">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {portfoliosList && portfoliosList.length > 0 && portfoliosList.map((item, idx) => {
                                return (
                                    <tr className="bg-white text-[15px]">
                                        <td className="px-3 py-4">{item.company}</td>
                                        <td className="px-3 py-4">{item.symbol}</td>
                                        <td className="px-3 py-4">{item.quantity}</td>
                                        <td className="px-3 py-4"><div className="flex items-center"><div><MdCurrencyRupee /></div><div>{item.buyPrice}</div></div></td>
                                        <td className="px-3 py-4"><div className="flex items-center text-indigo-500 font-medium"><div><MdCurrencyRupee /></div><div>{item.ltp}</div></div></td>
                                        <td className="px-3 py-4"><div className="flex items-center font-mediumn"><div><MdCurrencyRupee /></div><div>{item.currentValue}</div></div></td>
                                        <td className="px-3 py-4"><div className={`flex items-center font-medium ${item.ltp < item.buyPrice ? "text-red-500" : "text-green-500"}`}><div><MdCurrencyRupee /></div><div>{item.gainLoss} ({Number(item.gainLossPercent).toFixed(2)}%)</div></div></td>
                                        <td className="px-3 py-4">
                                            <div className="flex gap-2 items-center justify-center">
                                                <div className="text-sm font-medium text-blue-500 cursor-pointer">Edit</div>
                                                <div className="text-sm font-medium text-red-500 cursor-pointer">Delete</div>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div> : <div className="bg-white py-1 mx-auto w-full text-center max-w-4xl mt-5">Your Portfolio is Empty</div>}
        </section >
    )
}

export default Portfolio