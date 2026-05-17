"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, Calendar } from "lucide-react";

interface CustomDatePickerProps {
  label: string;
  placeholder?: string;
}

export default function CustomDatePicker({
  label,
  placeholder = "Select Date",
}: CustomDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
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

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0,
  ).getDate();
  const firstDay = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1,
  ).getDay();

  const nextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1),
    );
  };

  const prevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1),
    );
  };

  const handleSelect = (day: number) => {
    setSelectedDate(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day),
    );
    setIsOpen(false);
  };

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const formatDisplayDate = (d: Date | null) => {
    if (!d) return placeholder;
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${day} / ${month} / ${year}`;
  };

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
          <span className="truncate">{formatDisplayDate(selectedDate)}</span>
          <div className="flex items-center gap-2">
            <Calendar
              className={`transition-colors duration-300 text-primary/40 group-hover:text-primary/70 ${isOpen ? "text-obsession" : ""}`}
              size={18}
            />
            <ChevronDown
              className={`transition-transform duration-300 text-primary/50 ${isOpen ? "rotate-180 text-obsession" : ""}`}
              size={20}
            />
          </div>
        </div>

        {isOpen && (
          <div className="absolute top-full left-0 min-w-[280px] w-max mt-1 bg-[#EBE6DF] border border-primary shadow-obsession z-[100] p-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-4 border-b border-primary/20 pb-2">
              <button
                onClick={prevMonth}
                className="hover:text-obsession transition-colors p-1"
                aria-label="Previous Month"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="font-sans font-bold uppercase text-sm tracking-widest text-[#161513]">
                {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </span>
              <button
                onClick={nextMonth}
                className="hover:text-obsession transition-colors p-1"
                aria-label="Next Month"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Days of Week */}
            <div className="grid grid-cols-7 gap-1 text-center font-mono text-[10px] mb-2 text-primary/60 uppercase">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                <div key={d}>{d}</div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} className="py-2" />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const isSelected =
                  selectedDate?.getDate() === day &&
                  selectedDate?.getMonth() === currentMonth.getMonth() &&
                  selectedDate?.getFullYear() === currentMonth.getFullYear();
                return (
                  <div
                    key={day}
                    onClick={() => handleSelect(day)}
                    className={`text-center py-2 cursor-pointer font-serif text-sm transition-all border ${
                      isSelected
                        ? "bg-obsession text-secondary border-obsession shadow-[2px_2px_0_0_#252422] -translate-y-[2px]"
                        : "border-transparent hover:border-primary/20 hover:bg-primary/5 text-primary"
                    }`}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
