'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface BookingData {
  serviceType: string;
  price: number;
  deposit: number;
  date: string;
  time: string;
}

export default function PaymentPage() {
  const router = useRouter();
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const stored = sessionStorage.getItem('bookingData');
    if (!stored) {
      router.push('/client/booking');
      return;
    }
    setBookingData(JSON.parse(stored));
  }, [router]);

  const handlePayment = async () => {
    if (!bookingData) return;

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('clientToken');
      if (!token) {
        router.push('/client/login');
        return;
      }

      // Combine date and time
      const bookingDate = new Date(bookingData.date);
      const [hours, minutes] = bookingData.time.split(':');
      bookingDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      // Create booking
      const bookingResponse = await fetch('/api/client/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          serviceType: bookingData.serviceType,
          date: bookingDate.toISOString(),
          duration: 30, // Default 30 minutes
          totalPrice: bookingData.price,
          notes: `Time: ${bookingData.time}`,
        }),
      });

      if (!bookingResponse.ok) {
        const errorData = await bookingResponse.json();
        throw new Error(errorData.error || 'Failed to create booking');
      }

      const booking = await bookingResponse.json();

      // For now, we'll just show success and redirect
      // In production, you'd integrate Stripe here for payment
      alert(`Booking created! Deposit amount: $${bookingData.deposit.toFixed(2)}\n\nNote: Payment integration will be added next.`);
      
      // Clear booking data
      sessionStorage.removeItem('bookingData');
      
      // Redirect to dashboard
      router.push('/client/dashboard');
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-[#F8F7F1] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#3C4033]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F7F1] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-soft p-8 mb-8">
          <h1 className="text-4xl text-[#D4AF50] mb-6" style={{ fontFamily: "'Lora', serif" }}>Complete Your Booking</h1>
          
          {/* Booking Summary */}
          <div className="border-t border-gray-200 pt-6 mb-6">
            <h2 className="text-2xl text-[#D4AF50] mb-4" style={{ fontFamily: "'Lora', serif" }}>Booking Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-[#3C4033]">Service:</span>
                <span className="text-[#3C4033] font-medium">{bookingData.serviceType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#3C4033]">Date & Time:</span>
                <span className="text-[#3C4033] font-medium">
                  {new Date(bookingData.date).toLocaleDateString()} at {bookingData.time}
                </span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-3 mt-3">
                <span className="text-[#3C4033]">Session Price:</span>
                <span className="font-serif text-xl text-[#D4AF50]">${bookingData.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#3C4033]">Deposit (50%):</span>
                <span className="font-serif text-2xl text-[#D4AF50]">${bookingData.deposit.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-[#F8F7F1] rounded-lg p-6 mb-6">
            <p className="text-sm text-[#3C4033] mb-2">
              You will be charged a 50% deposit to secure your booking. The remaining balance will be due on the day of your session.
            </p>
            <p className="text-xs text-[#3C4033] opacity-75">
              Payment processing will be integrated with Stripe. For now, this creates your booking.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Payment Button */}
          <div className="flex gap-4">
            <button
              onClick={() => router.back()}
              className="px-8 py-3 border-2 border-[#D4AF50] text-[#D4AF50] rounded-md text-base font-bold tracking-wide uppercase transition-all duration-300 hover:bg-[#D4AF50] hover:text-black"
              style={{ fontFamily: "'Lora', serif" }}
            >
              Back
            </button>
            <button
              onClick={handlePayment}
              disabled={loading}
              className="flex-1 px-12 py-4 bg-[#D4AF50] text-black rounded-md text-base font-bold tracking-wide uppercase transition-all duration-300 hover:bg-[#B8943A] hover:translate-y-[-3px] hover:shadow-elegant hover:scale-105 active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0 golden-highlight"
              style={{ fontFamily: "'Lora', serif" }}
            >
              {loading ? 'Processing...' : `Pay Deposit $${bookingData.deposit.toFixed(2)}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

