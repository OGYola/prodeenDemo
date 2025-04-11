import React, { ReactNode, useState } from "react";

interface BlueprintSectionProps {
  title: string;
  children: ReactNode;
  icon?: string; // Optional emoji icon (or icon as a string)
}

export default function BlueprintSection({ title, children, icon }: BlueprintSectionProps) {
  const [isOpen, setIsOpen] = useState(true);

  // Toggle the collapsed/open state when the header is clicked
  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="bg-white border border-blue-100 shadow-md rounded-lg mb-8">
      {/* Section header with toggle indicator */}
      <div 
        className="p-6 cursor-pointer flex items-center justify-between" 
        onClick={handleToggle}
      >
        <h2 className="text-2xl font-bold text-blue-900">
          {icon && <span className="mr-2">{icon}</span>}
          {title}
        </h2>
        <span className="text-blue-600 font-semibold">
          {isOpen ? "−" : "+"}
        </span>
      </div>
      {/* Conditionally rendered content */}
      {isOpen && (
        <div className="px-6 pb-6">
          {children}
        </div>
      )}
    </div>
  );
}


// Sub-component for sections within the blueprint
export function SectionGroup({ title, children, icon }: BlueprintSectionProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold text-blue-800">
        {icon && <span className="mr-2">{icon}</span>}
        {title}
      </h3>
      <div>{children}</div>
    </div>
  );
}

// Component for displaying a list of items with an optional icon
interface ItemListProps {
  items: string[];
  icon?: string;
}

export function ItemList({ items, icon }: ItemListProps) {
  if (!items || items.length === 0) return null;
  
  return (
    <ul className="list-disc ml-5 text-sm text-blue-700">
      {items.map((item, i) => (
        <li key={i}>
          {icon && <span className="mr-1">{icon}</span>}
          {item}
        </li>
      ))}
    </ul>
  );
}

// Component for key-value pairs commonly used in the blueprint
interface KeyValuePairProps {
  label: string;
  value: string | number;
  icon?: string;
}

export function KeyValuePair({ label, value, icon }: KeyValuePairProps) {
  return (
    <p className="text-sm text-blue-700">
      <strong>
        {icon && <span className="mr-1">{icon}</span>}
        {label}:
      </strong>{" "}
      {value}
    </p>
  );
}