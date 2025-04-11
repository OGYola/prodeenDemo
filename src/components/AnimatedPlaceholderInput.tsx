'use client'

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"

// Define an interface for the props
interface AnimatedPlaceholderInputProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

// Animated placeholder input component
const AnimatedPlaceholderInput: React.FC<AnimatedPlaceholderInputProps> = ({ value, onChange, className }) => {
  // List of CPG product ideas to cycle through
  const productIdeas = [
    "Vegan collagen booster for women 35+",
    "Plant-based protein bars for kids",
    "Biodegradable cleaning pods for kitchens",
    "Adaptogenic coffee alternative with mushrooms",
    "Hydration powder with electrolytes for athletes",
    "Probiotic sparkling water with real fruit",
    "Zero-waste shampoo bars with essential oils",
    "Keto-friendly frozen desserts with no sugar",
    "CBD-infused sleep gummies for better rest",
    "Sustainable pet food made from insect protein"
  ];
  
  const [placeholderText, setPlaceholderText] = useState("");
  const [currentIdeaIndex, setCurrentIdeaIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [showCursor, setShowCursor] = useState(true);
  const [isFocused, setIsFocused] = useState(false);

  // If the Input component is a standard HTML input (or forwards its ref), use this type:
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Do not animate if the user has typed something or the input is focused
    if (value || isFocused) return;

    const currentIdea = productIdeas[currentIdeaIndex];

    let timeoutId: NodeJS.Timeout;
    
    if (isTyping) {
      if (placeholderText.length < currentIdea.length) {
        // Continue typing one more character
        timeoutId = setTimeout(() => {
          setPlaceholderText(currentIdea.slice(0, placeholderText.length + 1));
        }, 80); // Typing speed
      } else {
        // Fully typed: wait 2000ms then switch to deletion phase
        timeoutId = setTimeout(() => {
          setIsTyping(false);
        }, 500);
      }
    } else {
      if (placeholderText.length > 0) {
        // Delete one character
        timeoutId = setTimeout(() => {
          setPlaceholderText(currentIdea.slice(0, placeholderText.length - 1));
        }, 40); // Deleting speed
      } else {
        // Text fully deleted: pause and then move to next idea and re-enable typing
        timeoutId = setTimeout(() => {
          setCurrentIdeaIndex(prev => (prev + 1) % productIdeas.length);
          setIsTyping(true);
        }, 200);
      }
    }

    return () => clearTimeout(timeoutId);
  }, [placeholderText, currentIdeaIndex, isTyping, productIdeas, value, isFocused]);

  // Effect for cursor blinking
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530); // Blink rate

    return () => clearInterval(cursorInterval);
  }, []);

  // Handle focusing the input when clicking on the placeholder area
  const handlePlaceholderClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        value={value}
        onChange={onChange}
        className={className}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder=""  // Custom placeholder so leave empty
      />
      
      {/* Show the animated placeholder text only when input is empty */}
      {!value && (
        <div 
          className="absolute inset-0 flex items-center px-4 text-gray-500 pointer-events-none"
          onClick={handlePlaceholderClick}
        >
          e.g. {placeholderText}
          <span className={`ml-0.5 ${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100`}>
            |
          </span>
        </div>
      )}
    </div>
  );
};

export default AnimatedPlaceholderInput;
