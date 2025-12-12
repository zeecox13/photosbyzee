import Link from 'next/link';

const services = [
  {
    title: 'Family & Lifestyle',
    description: 'Capture the love and connection of your family with natural, authentic moments. Perfect for annual photos, milestones, or just because. Sessions are up to 30 minutes and include 13 edited photos.',
    price: 'Starting at $150',
  },
  {
    title: 'Maternity & Newborn',
    description: 'Gentle, intimate sessions capturing the precious early days. From maternity to newborn, I\'ll preserve these fleeting moments with care. Sessions are up to 30 minutes and include 13 edited photos.',
    price: 'Starting at $150',
  },
  {
    title: 'Couples & Engagement',
    description: 'Romantic sessions that tell your love story. From engagement photos to anniversary celebrations, I\'ll capture your connection beautifully. Sessions are up to 30 minutes and include 13 edited photos.',
    price: 'Starting at $150',
  },
  {
    title: 'Senior Portraits',
    description: 'Celebrate this milestone with portraits that reflect your personality and style. Multiple locations and outfit changes available. Sessions are up to 30 minutes and include 13 edited photos.',
    price: 'Starting at $150',
  },
  {
    title: 'SMB, Headshots, & Branding',
    description: 'Professional headshots and branding sessions for your business or personal brand. Look polished and confident. Sessions are up to 30 minutes and include 13 edited photos.',
    price: 'Starting at $250',
  },
  {
    title: 'Boudoir Sessions',
    description: 'Intimate, empowering boudoir sessions that celebrate your confidence and story. Includes pre-session planning, professional posing guidance, and a curated gallery of images.',
    price: 'Starting at $1,200',
  },
];

export default function Services() {
  return (
    <div>
      {/* Hero Section - No background image, just title */}
      <section className="pt-32 pb-16 text-center bg-[#F8F7F1]">
        <div className="max-w-4xl mx-auto px-5">
          <h1 className="text-7xl mb-6 font-normal tracking-wider text-[#D4AF50]" style={{ fontFamily: "'Lora', serif" }}>
            Services
          </h1>
          <p className="text-lg text-center text-[#3C4033] mb-4 max-w-3xl mx-auto">
            I offer a variety of photography services to capture your special moments. Each session is tailored to your unique story and style.
          </p>
          <p className="text-base text-center text-[#3C4033] max-w-3xl mx-auto font-medium">
            All sessions include up to 30 minutes and 13 edited photos.
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className="pt-8 pb-20 bg-[#F8F7F1]">
        <div className="max-w-6xl mx-auto px-5">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white p-10 rounded-xl shadow-soft border border-gray-100 transition-all duration-500 hover:translate-y-[-12px] hover:shadow-elegant text-center flex flex-col h-full animate-fadeInUp"
                style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'both' }}
              >
                <h3 className="font-serif text-3xl text-[#D4AF50] mb-4 font-medium min-h-[4.5rem] flex items-center justify-center leading-tight">
                  {service.title}
                </h3>
                <p className="text-[#3C4033] leading-relaxed mb-6 flex-grow" style={{ minHeight: '140px', lineHeight: '1.75rem' }}>
                  {service.description}
                </p>
                <div className="mt-auto">
                  <div className="text-2xl font-medium text-[#D4AF50] mb-6 font-serif">
                    {service.price}
                  </div>
                  <Link
                    href={`/client/register?serviceType=${encodeURIComponent(service.title)}&price=${encodeURIComponent(service.price)}`}
                    className="inline-block px-9 py-3.5 bg-[#D4AF50] text-black rounded-md text-base font-bold tracking-wide uppercase transition-all duration-300 hover:bg-[#B8943A] hover:translate-y-[-2px] hover:shadow-elegant hover:scale-105 active:scale-100 golden-highlight"
                    style={{ fontFamily: "'Lora', serif" }}
                  >
                    Book Session
                  </Link>
                </div>
              </div>
            ))}
          </div>
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

