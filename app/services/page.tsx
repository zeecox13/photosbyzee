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
    title: 'Small Business / Headshots & Branding',
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
      <section className="h-[60vh] flex items-center justify-center text-center bg-[#F8F7F1]">
        <div className="max-w-4xl mx-auto px-5">
          <h1 className="font-serif text-7xl mb-4 font-normal tracking-wider text-[#6B705C]">
            Services
          </h1>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-[#F8F7F1]">
        <div className="max-w-6xl mx-auto px-5">
          <h2 className="font-serif text-5xl text-center mb-12 text-[#6B705C] font-normal tracking-wide relative pb-5">
            Photography Services
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-gradient-to-r from-transparent via-[#B7B7A4] to-transparent"></span>
          </h2>
          <p className="text-lg text-center text-[#3C4033] mb-16 max-w-3xl mx-auto">
            I offer a variety of photography services to capture your special moments. Each session is tailored to your unique story and style.
          </p>
          <p className="text-base text-center text-[#3C4033] mb-16 max-w-3xl mx-auto font-medium">
            All sessions include up to 30 minutes and 13 edited photos.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white p-10 rounded-xl shadow-md transition-all duration-300 hover:translate-y-[-8px] hover:shadow-xl text-center"
              >
                <h3 className="font-serif text-3xl text-[#6B705C] mb-4 font-medium">
                  {service.title}
                </h3>
                <p className="text-[#3C4033] leading-relaxed mb-6">
                  {service.description}
                </p>
                <div className="text-2xl font-medium text-[#6B705C] mb-6 font-serif">
                  {service.price}
                </div>
                <Link
                  href="/#contact"
                  className="inline-block px-9 py-3.5 bg-[#6B705C] text-white rounded-md text-base font-medium tracking-wide uppercase transition-all duration-300 hover:bg-[#5A5E4F] hover:translate-y-[-2px] hover:shadow-lg"
                >
                  Book Session
                </Link>
              </div>
            ))}
          </div>
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

