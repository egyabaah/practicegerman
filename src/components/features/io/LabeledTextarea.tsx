import * as React from "react";
import { Textarea } from "@/components/ui/textarea";

interface LabeledTextareaProps {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
    className?: string;
    /** error message */
    error?: string;
    /** optional guidance text */
    helperText?: string;
    id?: string;
    name?: string;
    required?: boolean;
    testId?: string;
    /** Optional aria-label for stable test queries/accessibility */
    ariaLabel?: string;
}

export function LabeledTextarea({
    label,
    value,
    onChange,
    placeholder,
    className,
    error,
    helperText,
    id,
    name,
    required,
    testId,
    ariaLabel
}: LabeledTextareaProps) {
    return (
        <div className="flex flex-col gap-1">
            <label htmlFor={id} className="font-medium">{label}</label>
            <Textarea
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                id={id}
                className={className}
                name={name}
                required={required}
                data-testid={testId}
                aria-label={ariaLabel}
            />
            {helperText && !error && (
                <span className="text-sm text-gray-500">{helperText}</span>
            )}
            {error && <span className="text-sm text-red-500">{error}</span>}
        </div>
    );
}
