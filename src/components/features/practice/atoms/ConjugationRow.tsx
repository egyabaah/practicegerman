import React from "react";

interface ConjugationRowProps {
    pronoun: string;
    form: string;
    isActive?: boolean;
}

export const ConjugationRow = ({ pronoun, form, isActive }: ConjugationRowProps) => {
    return (
        <li
            className={`grid grid-cols-2 items-center px-2 py-1 rounded odd:bg-muted/40 even:bg-background
            ${isActive
                ? "border-2 border-primary"
                : "border border-transparent"
            }`}
        >
            <span className={isActive ? "font-bold" : "font-semibold"}>
                {pronoun}
            </span>
            <span className={isActive ? "font-bold" : ""}>
                {form}
            </span>
        </li>
    );
};
