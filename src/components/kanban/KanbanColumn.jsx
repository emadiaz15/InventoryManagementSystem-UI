import React, { useState } from "react";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

const variantStyles = {
    warning: {
        base: "bg-warning-500 hover:bg-warning-600 focus:ring-warning-600",
        badge: "bg-warning-600",
    },
    success: {
        base: "bg-success-500 hover:bg-success-600 focus:ring-success-600",
        badge: "bg-success-600",
    },
    primary: {
        base: "bg-primary-500 hover:bg-primary-600 focus:ring-primary-600",
        badge: "bg-secondary-500", // mantenemos verde para badge en azul
    },
};

const KanbanColumn = ({ title, count, children, variant = "primary" }) => {
    const [isOpen, setIsOpen] = useState(true);
    const styles = variantStyles[variant] || variantStyles.primary;

    return (
        <div>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`inline-flex items-center px-5 py-2.5 text-sm font-medium text-white rounded-lg w-full transition-colors focus:outline-none focus:ring-4 ${styles.base}`}
            >
                {title}
                <span
                    className={`inline-flex items-center justify-center w-5 h-5 ms-2 text-xs font-semibold text-white rounded-full ${styles.badge}`}
                >
                    {count}
                </span>
                {isOpen ? (
                    <ChevronUpIcon className="w-5 h-5 ms-2" />
                ) : (
                    <ChevronDownIcon className="w-5 h-5 ms-2" />
                )}
            </button>

            {isOpen && <div className="mt-4 space-y-4">{children}</div>}
        </div>
    );
};

export default KanbanColumn;
