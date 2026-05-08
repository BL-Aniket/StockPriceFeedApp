import React from "react";

const Button = ({ children, size, ...props }) => {
    const sizeVariants = {
        small: "py-1.5 text-sm",
        medium: "py-2 text-sm",
        large: "py-2.5 text-sm"
    };

    return (
        <button {...props} type="submit" className={`bg-indigo-500 hover:bg-indigo-400 w-full rounded-lg ${sizeVariants[size]} cursor-pointer transition-all duration-300 text-white font-medium`}>{children}</button>
    )
}

export default Button