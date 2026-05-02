import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

/**
 * InquiryCalendar Component - Compact Mini Calendar
 * Shows only next 4-5 dates, not full month
 * User selects one date for meeting/interview
 */
export default function InquiryCalendar({
  propertyId,
  onDateSelected,
}) {
  const { isDark } = useTheme();
  const [startDate, setStartDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  // Get today without time
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get dates to display (4 dates starting from startDate)
  const getDisplayDates = () => {
    const dates = [];
    const current = new Date(startDate);
    current.setHours(0, 0, 0, 0);

    for (let i = 0; i < 4; i++) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  // Move to next dates
  const handleNextDates = () => {
    const nextStart = new Date(startDate);
    nextStart.setDate(nextStart.getDate() + 4);
    setStartDate(nextStart);
  };

  // Go back to today
  const handleToday = () => {
    setStartDate(new Date());
  };

  const handleSelectDate = (date) => {
    setSelectedDate(date);
    if (onDateSelected) {
      onDateSelected(date);
    }
  };

  const displayDates = getDisplayDates();
  const isToday = (date) => date.toDateString() === today.toDateString();

  return (
    <div className={`rounded-lg border p-3  border-neutral-200 dark:border-neutral-700`}>
      <h3 className={`text-sm font-semibold mb-3 text-neutral-700 dark:text-white`}>
        Select Date
      </h3>

      {/* Mini Date Picker */}
      <div className="space-y-2">
        {/* Date Buttons */}
        <div className="grid grid-cols-4 gap-2">
          {displayDates.map((date, index) => {
            const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
            const isTodayDate = isToday(date);

            return (
              <button
                key={index}
                type='button'
                onClick={() => handleSelectDate(date)}
                className={`py-2 cursor-pointer px-2 rounded text-xs font-semibold text-center transition 
                  ${isSelected
                    ? 'bg-red-500 text-white border border-red-500 '
                    : isTodayDate
                      ? 'text-primary border border-[#E0E0E0] dark:bg-neutral-800 dark:text-primary dark:border-primary'
                      : 'border border-neutral-200 hover:border-red-500 dark:text-white dark:border-neutral-700 dark:hover:border-red-500'
                  }`}

              >
                <div className="text-xs">{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                <div className="text-sm">{date.getDate()}</div>
                <div className="text-[6px]">{date.toLocaleDateString('en-US', { month: 'short' })}</div>


              </button>
            );
          })}
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-2 mt-3">
          <button
            type='button'
            onClick={handleToday}
            className="flex-1 py-2 cursor-pointer text-xs font-semibold rounded transition border border-neutral-200 dark:text-white dark:border-neutral-700 dark:hover:border-red-500"

          >
            Today
          </button>
          <button
            type='button'
            onClick={handleNextDates}
            className={`flex-1 py-2 cursor-pointer text-xs font-semibold rounded transition flex items-center justify-center gap-1 bg-red-500 hover:opacity-80 dark:border-neutral-700 text-white`}
          >
            Next
          </button>
        </div>
      </div>

      {/* Selected Date Display */}
      {selectedDate && (
        <div
          className={`mt-3 p-2 rounded text-center text-sm font-medium `}
        >
          {selectedDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
      )}
    </div>
  );
}
