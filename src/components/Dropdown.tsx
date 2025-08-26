import React from "react";

export interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  placeholder?: string;
  className?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  isOpen,
  onToggle,
  placeholder = "Select option",
  className = "",
}) => {
  const selectedOption = options.find((option) => option.value === value);

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-4 py-2 text-left bg-gray-700 border border-gray-600 rounded-lg text-gray-100 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
      >
        <div className="flex items-center justify-between">
          <span className={selectedOption ? "text-gray-100" : "text-gray-400"}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <svg
            className={`w-4 h-4 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-20 overflow-hidden">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                onToggle();
              }}
              className={`w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors border-0 outline-none focus:outline-none focus:ring-0 focus:border-0 rounded-none ${
                value === option.value
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "text-gray-100"
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{option.label}</span>
                {value === option.value && (
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
