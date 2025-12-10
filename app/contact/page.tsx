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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder - form submission logic can be added later
    console.log('Form submitted:', formData);
    alert('Thank you for your inquiry! I\'ll get back to you soon.');
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="h-screen flex items-center justify-center text-center text-white relative bg-cover bg-center bg-fixed" style={{ backgroundImage: 'linear-gradient(rgba(60, 64, 51, 0.4), rgba(60, 64, 51, 0.4)), url(/engagement1.jpg)' }}>
        <div className="max-w-4xl mx-auto px-5">
          <h1 className="font-serif text-7xl mb-4 font-normal tracking-wider drop-shadow-lg">
            Contact
          </h1>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-[#F8F7F1]">
        <div className="max-w-2xl mx-auto px-5">
          <h2 className="font-serif text-5xl mb-4 text-center text-[#6B705C] font-normal tracking-wide">
            Get In Touch
          </h2>
          <p className="text-lg text-center text-[#3C4033] mb-10">
            Interested in a photoshoot or have questions? I&apos;d love to hear from you.
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
                className="px-4 py-4 border-[1.5px] border-[#B7B7A4] rounded-md text-base bg-white text-[#3C4033] transition-all focus:outline-none focus:border-[#6B705C] w-full"
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
                className="px-4 py-4 border-[1.5px] border-[#B7B7A4] rounded-md text-base bg-white text-[#3C4033] transition-all focus:outline-none focus:border-[#6B705C] w-full"
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
                className="px-4 py-4 border-[1.5px] border-[#B7B7A4] rounded-md text-base bg-white text-[#3C4033] transition-all focus:outline-none focus:border-[#6B705C] w-full"
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
                className="px-4 py-4 border-[1.5px] border-[#B7B7A4] rounded-md text-base bg-white text-[#3C4033] transition-all focus:outline-none focus:border-[#6B705C] w-full"
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
                className="px-4 py-4 border-[1.5px] border-[#B7B7A4] rounded-md text-base bg-white text-[#3C4033] transition-all focus:outline-none focus:border-[#6B705C] w-full"
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
                className="px-4 py-4 border-[1.5px] border-[#B7B7A4] rounded-md text-base bg-white text-[#3C4033] transition-all focus:outline-none focus:border-[#6B705C] w-full"
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
                className="px-4 py-4 border-[1.5px] border-[#B7B7A4] rounded-md text-base bg-white text-[#3C4033] transition-all focus:outline-none focus:border-[#6B705C] w-full"
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
                className="px-4 py-4 border-[1.5px] border-[#B7B7A4] rounded-md text-base bg-white text-[#3C4033] transition-all focus:outline-none focus:border-[#6B705C] w-full"
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
                className="px-4 py-4 border-[1.5px] border-[#B7B7A4] rounded-md text-base bg-white text-[#3C4033] transition-all focus:outline-none focus:border-[#6B705C] w-full resize-none"
              />
            </div>

            <button
              type="submit"
              className="px-12 py-4 bg-[#6B705C] text-white rounded-md text-base font-medium tracking-wide uppercase transition-all duration-300 hover:bg-[#5A5E4F] hover:translate-y-[-3px] hover:shadow-lg self-center mt-2"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#3C4033] text-[#B7B7A4] text-center py-8">
        <div className="container mx-auto px-5">
          <p className="text-sm tracking-wide font-light">
            &copy; 2024 Photos by Zee. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

