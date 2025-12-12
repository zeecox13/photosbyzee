'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isPast } from 'date-fns';

// Note: Route Segment Config (dynamic, revalidate) can only be used in Server Components.
// This is a Client Component, so we rely on the layout.tsx for dynamic config.

interface AvailabilitySlot {
  id: string;
  startTime: string;
  endTime: string;
  isRecurring: boolean;
}

function BookingPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceType = searchParams.get('serviceType') || '';
  const priceStr = searchParams.get('price') || 'Starting at $150';
  
  // Extract price number from string like "Starting at $150"
  const priceMatch = priceStr.match(/\$([\d,]+)/);
  const basePrice = priceMatch ? parseFloat(priceMatch[1].replace(/,/g, '')) : 150;
  const depositAmount = basePrice * 0.5;

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [availability, setAvailability] = useState<Record<string, AvailabilitySlot[]>>({});
  const [bookedDates, setBookedDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [error, setError] = useState('');

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('clientToken');
    if (!token) {
      router.push('/client/login');
      return;
    }
    fetchAvailability();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMonth]);

  const fetchAvailability = async () => {
    try {
      const token = localStorage.getItem('clientToken');
      if (!token) {
        setLoading(false);
        router.push('/client/login');
        return;
      }

      const startDate = startOfMonth(currentMonth).toISOString().split('T')[0];
      const endDate = endOfMonth(currentMonth).toISOString().split('T')[0];

      const response = await fetch(
        `/api/client/availability?startDate=${startDate}&endDate=${endDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAvailability(data.slots || {});
        setBookedDates(data.bookedDates || []);
      }
    } catch (err) {
      console.error('Error fetching availability:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = (date: Date) => {
    if (isPast(date) && !isSameDay(date, new Date())) {
      return; // Can't select past dates
    }
    setSelectedDate(date);
    setSelectedTime('');
  };

  const handleContinue = () => {
    if (!selectedDate || !selectedTime) {
      setError('Please select both a date and time');
      return;
    }

    // Store booking details and proceed to payment
    const bookingData = {
      serviceType,
      price: basePrice,
      deposit: depositAmount,
      date: selectedDate.toISOString(),
      time: selectedTime,
    };

    sessionStorage.setItem('bookingData', JSON.stringify(bookingData));
    router.push('/client/booking/payment');
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getAvailableTimes = (date: Date): AvailabilitySlot[] => {
    const dateKey = format(date, 'yyyy-MM-dd');
    return availability[dateKey] || [];
  };

  const isDateAvailable = (date: Date): boolean => {
    const dateKey = format(date, 'yyyy-MM-dd');
    return availability[dateKey] && availability[dateKey].length > 0;
  };

  const isDateBooked = (date: Date): boolean => {
    const dateKey = format(date, 'yyyy-MM-dd');
    return bookedDates.includes(dateKey);
  };

  return (
    <div className="min-h-screen bg-[#F8F7F1] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-soft p-8 mb-8">
          <h1 className="text-4xl text-[#D4AF50] mb-2" style={{ fontFamily: "'Lora', serif" }}>Book Your Session</h1>
          <p className="text-lg text-[#3C4033] mb-4">
            {serviceType} - {priceStr}
          </p>
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-[#3C4033]">Session Price:</span>
              <span className="font-serif text-2xl text-[#D4AF50]">${basePrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-[#3C4033]">Deposit (50%):</span>
              <span className="font-serif text-2xl text-[#D4AF50]">${depositAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-xl shadow-soft p-8 mb-8">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
              className="px-4 py-2 text-[#D4AF50] hover:bg-[#F8F7F1] rounded-md transition-colors"
            >
              ← Previous
            </button>
            <h2 className="text-2xl text-[#D4AF50]" style={{ fontFamily: "'Lora', serif" }}>
              {format(currentMonth, 'MMMM yyyy')}
            </h2>
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
              className="px-4 py-2 text-[#D4AF50] hover:bg-[#F8F7F1] rounded-md transition-colors"
            >
              Next →
            </button>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-sm font-medium text-[#D4AF50] py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {daysInMonth.map((date) => {
              const isAvailable = isDateAvailable(date);
              const isBooked = isDateBooked(date);
              const isSelected = selectedDate && isSameDay(date, selectedDate);
              const isPastDate = isPast(date) && !isSameDay(date, new Date());

              return (
                <button
                  key={date.toISOString()}
                  onClick={() => !isPastDate && isAvailable && !isBooked && handleDateSelect(date)}
                  disabled={isPastDate || !isAvailable || isBooked}
                  className={`
                    aspect-square rounded-md transition-all duration-200
                    ${isSelected
                      ? 'bg-[#D4AF50] text-black font-semibold'
                      : isBooked
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : isPastDate
                      ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                      : isAvailable
                      ? 'bg-[#F8F7F1] text-[#3C4033] hover:bg-[#D4AF50] hover:text-black'
                      : 'bg-white text-gray-300 cursor-not-allowed'
                    }
                  `}
                >
                  {format(date, 'd')}
                </button>
              );
            })}
          </div>
        </div>

        {/* Time Selection */}
        {selectedDate && (
          <div className="bg-white rounded-xl shadow-soft p-8 mb-8 animate-fadeInUp">
            <h3 className="text-2xl text-[#D4AF50] mb-4" style={{ fontFamily: "'Lora', serif" }}>
              Select Time - {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {getAvailableTimes(selectedDate).map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => setSelectedTime(slot.startTime)}
                  className={`
                    px-4 py-3 rounded-md transition-all duration-200
                    ${selectedTime === slot.startTime
                      ? 'bg-[#D4AF50] text-black font-semibold'
                      : 'bg-[#F8F7F1] text-[#3C4033] hover:bg-[#D4AF50] hover:text-black'
                    }
                  `}
                >
                  {slot.startTime}
                </button>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-8">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Continue Button */}
        {selectedDate && selectedTime && (
          <div className="flex justify-end">
            <button
              onClick={handleContinue}
              className="px-12 py-4 bg-[#D4AF50] text-black rounded-md text-base font-bold tracking-wide uppercase transition-all duration-300 hover:bg-[#B8943A] hover:translate-y-[-3px] hover:shadow-elegant hover:scale-105 active:scale-100 golden-highlight"
              style={{ fontFamily: "'Lora', serif" }}
            >
              Continue to Payment
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#F8F7F1]">
        <div className="text-center">
          <div className="text-[#D4AF50] text-lg">Loading...</div>
        </div>
      </div>
    }>
      <BookingPageContent />
    </Suspense>
  );
}

