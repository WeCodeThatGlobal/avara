import { ElementType } from "react";
import { ChangeEvent, FocusEvent } from "react";

interface ReusableInputProps {
    id: string;
    label: string;
    type?: string;
    placeholder?: string;
    Icon?: ElementType;
    required?: boolean;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onBlur: (e: FocusEvent<HTMLInputElement>) => void;
    error?: string;
    maxLength?: number;
}

export default function InputField({ id, label, type = 'text', placeholder, Icon, required, value, onChange, onBlur, error, maxLength }: ReusableInputProps) {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-600 mb-2">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
                {Icon && (
                    <Icon className="pointer-events-none w-5 h-5 absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400" />
                )}
                <input
                    type={type}
                    id={id}
                    name={id}
                    className={`w-full p-3 ${Icon ? 'pl-10' : ''} border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 ${error ? 'focus:ring-red-500' : 'focus:ring-blue-500'} ${error ? 'focus:border-red-500' : 'focus:border-blue-500'} transition`}
                    placeholder={placeholder}
                    required={required}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    maxLength={maxLength}
                />
            </div>
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
};