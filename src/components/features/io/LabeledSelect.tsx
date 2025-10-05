import * as React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LabeledSelectProps<T extends string = string> {
    label: string;
    value: T;
    onValueChange: (value: T) => void;
    options: { value: T; label: string }[];
    placeholder?: string;
    id?: string;
    name?: string;
    disabled?: boolean;
    className?: string;
    testId?: string;
}

export function LabeledSelect<T extends string = string>({
    label,
    value,
    onValueChange,
    options,
    placeholder,
    id,
    name,
    disabled,
    className,
    testId,
}: LabeledSelectProps<T>) {
    return (
        <div className="flex flex-col gap-1">
            <label htmlFor={id} className="font-medium">{label}</label>
            <Select value={value} onValueChange={onValueChange}>
                <SelectTrigger id={id} data-testid={testId} className={className} name={name} disabled={disabled}>
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value} role="option">{opt.label}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
