import Image from 'next/image';
import Link from 'next/link';

// Gallery images for home page (6 images)
const homeGalleryImages = [
  'april.jpg',
  'fall.jpg',
  'headshot.jpg',
  'jacks.jpg',
  'prom.jpg',
  'bluebonnetboys.jpg',
];

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="h-screen flex items-center justify-center text-center text-white relative bg-cover bg-center bg-fixed" style={{ backgroundImage: 'linear-gradient(rgba(60, 64, 51, 0.4), rgba(60, 64, 51, 0.4)), url(/hero.jpg)' }}>
        <div className="max-w-4xl mx-auto px-5">
          <h1 className="font-serif text-7xl mb-4 font-normal tracking-wider drop-shadow-lg animate-fadeInUp" style={{ letterSpacing: '3px' }}>
            Photos by Zee
          </h1>
          <p className="text-2xl italic font-light tracking-wide drop-shadow-md animate-fadeInUp" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
            Capturing life&apos;s beautiful moments
          </p>
        </div>
      </section>

      {/* About Me Section */}
      <section className="py-20 bg-[#F8F7F1]">
        <div className="max-w-3xl mx-auto px-5">
          <h2 className="font-serif text-5xl text-center mb-12 text-[#6B705C] font-normal tracking-wide relative pb-5">
            About Me
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-gradient-to-r from-transparent via-[#B7B7A4] to-transparent"></span>
          </h2>
          <div className="space-y-6 text-center">
            <p className="text-lg text-[#3C4033] leading-relaxed">
              Hi, I&apos;m Zee, a lifestyle photographer who loves real moments, good light, and the little memories that matter most.
            </p>
            <p className="text-lg text-[#3C4033] leading-relaxed">
              I got my first camera at 16 and immediately fell in love with capturing life as it unfolds. Over the years I&apos;ve photographed families, couples, newborns, seniors, weddings, and everything in between, and each story reminds me why I love what I do.
            </p>
            <p className="text-lg text-[#3C4033] leading-relaxed">
              After a busy season of life, I&apos;m back home in the Northwoods, camera in hand, feeling more inspired than ever. I&apos;m here for the soft smiles, the real laughs, the quiet in between moments, and the magic people do not always see in themselves.
            </p>
            <p className="text-lg text-[#3C4033] leading-relaxed">
              I can&apos;t wait to meet you, hype you up, chase beautiful light with you, and create images you will love forever.
            </p>
            <p className="text-lg text-[#3C4033] leading-relaxed font-medium">
              ~ XO, Zee
            </p>
          </div>
        </div>
      </section>

      {/* Photo Gallery Section */}
      <section className="py-20 bg-[#F4F1EA]">
        <div className="max-w-7xl mx-auto px-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {homeGalleryImages.map((image, index) => (
              <div
                key={index}
                className="rounded-lg overflow-hidden shadow-lg bg-black aspect-[4/3] transition-transform duration-300 hover:translate-y-[-8px] hover:shadow-2xl"
              >
                <Image
                  src={`/${image}`}
                  alt={`Gallery image ${index + 1}`}
                  width={400}
                  height={300}
                  className="w-full h-full object-cover transition-transform duration-400 hover:scale-105 hover:brightness-110"
                  style={image === 'bluebonnetboys.jpg' ? { objectPosition: '59% 25%' } : {}}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Get In Touch Section */}
      <section id="contact" className="py-20 bg-[#F8F7F1]">
        <div className="max-w-2xl mx-auto px-5 text-center">
          <h2 className="font-serif text-5xl mb-4 text-[#6B705C] font-normal tracking-wide">
            Get In Touch
          </h2>
          <p className="text-lg text-[#3C4033] mb-10">
            Interested in a photoshoot or have questions? I&apos;d love to hear from you.
          </p>
          <form className="flex flex-col gap-5">
            <input
              type="text"
              placeholder="Your Name"
              required
              className="px-4 py-4 border-[1.5px] border-[#B7B7A4] rounded-md text-base bg-white text-[#3C4033] transition-all focus:outline-none focus:border-[#6B705C] w-full"
            />
            <input
              type="email"
              placeholder="Your Email"
              required
              className="px-4 py-4 border-[1.5px] border-[#B7B7A4] rounded-md text-base bg-white text-[#3C4033] transition-all focus:outline-none focus:border-[#6B705C] w-full"
            />
            <textarea
              placeholder="Your Message"
              rows={5}
              required
              className="px-4 py-4 border-[1.5px] border-[#B7B7A4] rounded-md text-base bg-white text-[#3C4033] transition-all focus:outline-none focus:border-[#6B705C] w-full resize-none"
            />
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

