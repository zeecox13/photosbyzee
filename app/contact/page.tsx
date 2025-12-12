'use client';

import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    sessionType: '',
    preferredDate: '',
    location: '',
    budget: '',
    referralSource: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          sessionType: '',
          preferredDate: '',
          location: '',
          budget: '',
          referralSource: '',
          message: '',
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="h-screen flex items-start justify-center text-center text-white relative bg-cover bg-fixed pt-[35vh]" style={{ backgroundImage: 'linear-gradient(rgba(60, 64, 51, 0.4), rgba(60, 64, 51, 0.4)), url(/engagement1.jpg)', backgroundPosition: 'center 30%' }}>
        <div className="max-w-4xl mx-auto px-5">
          <h1 className="font-serif text-7xl mb-4 font-normal tracking-wider drop-shadow-lg">
            Contact
          </h1>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-24 bg-[#F8F7F1]">
        <div className="max-w-2xl mx-auto px-5">
          <h2 className="font-serif text-5xl mb-6 text-center text-[#D4AF50] font-normal tracking-wide animate-fadeInUp">
            Get In Touch
          </h2>
          <p className="text-lg text-center text-[#3C4033] mb-12 animate-fadeInUp animate-delay-100">
            Interested in a photoshoot or have questions? I&apos;d love to hear from you.
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 animate-fadeInUp animate-delay-200">
            <div>
              <label htmlFor="name" className="block mb-2 text-[#3C4033] font-medium text-sm">
                Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="px-4 py-4 border-[1.5px] border-[#B7B7A4] rounded-md text-base bg-white text-[#3C4033] transition-all duration-300 focus:outline-none focus:border-[#D4AF50] focus:ring-2 focus:ring-[#D4AF50]/20 w-full hover:border-[#D4AF50]/50"
              />
            </div>

            <div>
              <label htmlFor="email" className="block mb-2 text-[#3C4033] font-medium text-sm">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="px-4 py-4 border-[1.5px] border-[#B7B7A4] rounded-md text-base bg-white text-[#3C4033] transition-all duration-300 focus:outline-none focus:border-[#D4AF50] focus:ring-2 focus:ring-[#D4AF50]/20 w-full hover:border-[#D4AF50]/50"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block mb-2 text-[#3C4033] font-medium text-sm">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="px-4 py-4 border-[1.5px] border-[#B7B7A4] rounded-md text-base bg-white text-[#3C4033] transition-all duration-300 focus:outline-none focus:border-[#D4AF50] focus:ring-2 focus:ring-[#D4AF50]/20 w-full hover:border-[#D4AF50]/50"
              />
            </div>

            <div>
              <label htmlFor="sessionType" className="block mb-2 text-[#3C4033] font-medium text-sm">
                Preferred Session Type
              </label>
              <select
                id="sessionType"
                name="sessionType"
                value={formData.sessionType}
                onChange={handleChange}
                className="px-4 py-4 border-[1.5px] border-[#B7B7A4] rounded-md text-base bg-white text-[#3C4033] transition-all duration-300 focus:outline-none focus:border-[#D4AF50] focus:ring-2 focus:ring-[#D4AF50]/20 w-full hover:border-[#D4AF50]/50"
              >
                <option value="">Select a session type</option>
                <option value="family">Family & Lifestyle</option>
                <option value="maternity">Maternity & Newborn</option>
                <option value="couples">Couples & Engagement</option>
                <option value="business">Small Business / Branding</option>
                <option value="boudoir">Boudoir</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="preferredDate" className="block mb-2 text-[#3C4033] font-medium text-sm">
                Preferred Date or Timeframe
              </label>
              <input
                type="text"
                id="preferredDate"
                name="preferredDate"
                placeholder="e.g., June 2024 or specific date"
                value={formData.preferredDate}
                onChange={handleChange}
                className="px-4 py-4 border-[1.5px] border-[#B7B7A4] rounded-md text-base bg-white text-[#3C4033] transition-all duration-300 focus:outline-none focus:border-[#D4AF50] focus:ring-2 focus:ring-[#D4AF50]/20 w-full hover:border-[#D4AF50]/50"
              />
            </div>

            <div>
              <label htmlFor="location" className="block mb-2 text-[#3C4033] font-medium text-sm">
                Location / General Area
              </label>
              <input
                type="text"
                id="location"
                name="location"
                placeholder="City, state, or specific location"
                value={formData.location}
                onChange={handleChange}
                className="px-4 py-4 border-[1.5px] border-[#B7B7A4] rounded-md text-base bg-white text-[#3C4033] transition-all duration-300 focus:outline-none focus:border-[#D4AF50] focus:ring-2 focus:ring-[#D4AF50]/20 w-full hover:border-[#D4AF50]/50"
              />
            </div>

            <div>
              <label htmlFor="budget" className="block mb-2 text-[#3C4033] font-medium text-sm">
                Budget Range
              </label>
              <input
                type="text"
                id="budget"
                name="budget"
                placeholder="e.g., $150-$300"
                value={formData.budget}
                onChange={handleChange}
                className="px-4 py-4 border-[1.5px] border-[#B7B7A4] rounded-md text-base bg-white text-[#3C4033] transition-all duration-300 focus:outline-none focus:border-[#D4AF50] focus:ring-2 focus:ring-[#D4AF50]/20 w-full hover:border-[#D4AF50]/50"
              />
            </div>

            <div>
              <label htmlFor="referralSource" className="block mb-2 text-[#3C4033] font-medium text-sm">
                How did you hear about me?
              </label>
              <select
                id="referralSource"
                name="referralSource"
                value={formData.referralSource}
                onChange={handleChange}
                className="px-4 py-4 border-[1.5px] border-[#B7B7A4] rounded-md text-base bg-white text-[#3C4033] transition-all duration-300 focus:outline-none focus:border-[#D4AF50] focus:ring-2 focus:ring-[#D4AF50]/20 w-full hover:border-[#D4AF50]/50"
              >
                <option value="">Select an option</option>
                <option value="instagram">Instagram</option>
                <option value="tiktok">TikTok</option>
                <option value="referral">Referral</option>
                <option value="google">Google</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block mb-2 text-[#3C4033] font-medium text-sm">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell me about your vision, ideas, or any questions you have..."
                className="px-4 py-4 border-[1.5px] border-[#B7B7A4] rounded-md text-base bg-white text-[#3C4033] transition-all duration-300 focus:outline-none focus:border-[#D4AF50] focus:ring-2 focus:ring-[#D4AF50]/20 w-full resize-none hover:border-[#D4AF50]/50"
              />
            </div>

            {submitStatus === 'success' && (
              <div className="rounded-md bg-green-50 p-4 border border-green-200">
                <div className="text-sm text-green-800">
                  Thank you for your message! I&apos;ll get back to you soon.
                </div>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="rounded-md bg-red-50 p-4 border border-red-200">
                <div className="text-sm text-red-800">
                  There was an error sending your message. Please try again or contact me directly at zeecox13@gmail.com
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="px-12 py-4 bg-[#D4AF50] text-black rounded-md text-base font-medium tracking-wide uppercase transition-all duration-300 hover:bg-[#B8943A] hover:translate-y-[-3px] hover:shadow-elegant hover:scale-105 active:scale-100 self-center mt-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0 golden-highlight"
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#3C4033] text-[#B7B7A4] text-center py-12 border-t border-[#4A4F42]">
        <div className="container mx-auto px-5">
          <p className="text-sm tracking-wide font-light mb-2">
            &copy; 2024 Photos by Zee. All rights reserved.
          </p>
          <p className="text-xs tracking-wide font-light opacity-75">
            Capturing life&apos;s beautiful moments
          </p>
        </div>
      </footer>
    </div>
  );
}

