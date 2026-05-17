"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface CustomSelectProps {
  label: string;
  options: string[];
  placeholder?: string;
  icon?: React.ReactNode;
}

export default function CustomSelect({
  label,
  options,
  placeholder = "Select an option",
  icon,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(options[0] || null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className={`flex flex-col relative group ${isOpen ? "z-[100]" : "z-10"}`}
      ref={ref}
    >
      <label className="font-mono text-[10px] uppercase tracking-widest text-primary/60 absolute -top-5 z-10">
        {label}
      </label>
      <div className="relative">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className={`bg-transparent border-b py-2 font-serif text-xl transition-colors w-full pr-8 cursor-pointer relative z-10 flex items-center justify-between ${isOpen ? "border-obsession" : "border-primary group-hover:border-obsession"}`}
        >
          <span className="truncate">{selected || placeholder}</span>
          <div className="flex items-center gap-2">
            {icon && (
              <div
                className={`transition-colors duration-300 text-primary/40 group-hover:text-primary/70 ${isOpen ? "text-obsession" : ""}`}
              >
                {icon}
              </div>
            )}
            <ChevronDown
              className={`transition-transform duration-300 text-primary/50 ${isOpen ? "rotate-180 text-obsession" : ""}`}
              size={20}
            />
          </div>
        </div>

        {isOpen && (
          <div className="absolute top-full left-0 w-full mt-1 bg-[#EBE6DF] border border-primary shadow-obsession z-[100] max-h-60 overflow-y-auto">
            {options.map((option, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setSelected(option);
                  setIsOpen(false);
                }}
                className={`px-4 py-3 font-serif cursor-pointer transition-colors ${selected === option ? "bg-primary text-[#EBE6DF]" : "hover:bg-primary/10 text-primary"}`}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
