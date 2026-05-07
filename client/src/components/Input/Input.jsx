import React from "react";

const Input = (props) => {
    return (
        <input className="border border-gray-300 rounded-lg focus:outline-0 focus:ring-0 focus:border-blue-700 placeholder:text-sm focus:shadow-md px-2 py-2 w-full mt-2" {...props} />
    )
}

export default Input;