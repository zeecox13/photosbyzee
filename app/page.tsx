import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Photos by Zee - Professional Photography',
  description: 'Capturing life\'s beautiful moments with professional photography services',
};

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
      <section className="h-screen flex items-start justify-center text-center text-white relative bg-cover bg-fixed pt-[35vh]" style={{ backgroundImage: 'linear-gradient(rgba(60, 64, 51, 0.4), rgba(60, 64, 51, 0.4)), url(/hero.jpg)', backgroundPosition: 'center 40%' }}>
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
      <section className="py-24 bg-[#F8F7F1]">
        <div className="max-w-3xl mx-auto px-5">
          <h2 className="font-serif text-5xl text-center mb-16 text-[#D4AF50] font-normal tracking-wide relative pb-5 animate-fadeInUp">
            About Me
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-0.5 bg-gradient-to-r from-transparent via-[#B7B7A4] to-transparent"></span>
          </h2>
          <div className="space-y-8 text-center">
            <p className="text-lg text-[#3C4033] leading-relaxed animate-fadeInUp animate-delay-100">
              Hi, I&apos;m Zee, a lifestyle photographer who loves real moments, good light, and the little memories that matter most.
            </p>
            <p className="text-lg text-[#3C4033] leading-relaxed animate-fadeInUp animate-delay-200">
              I got my first camera at 16 and immediately fell in love with capturing life as it unfolds. Over the years I&apos;ve photographed families, couples, newborns, seniors, weddings, and everything in between, and each story reminds me why I love what I do.
            </p>
            <p className="text-lg text-[#3C4033] leading-relaxed animate-fadeInUp animate-delay-300">
              After a busy season of life, I&apos;m back home in the Northwoods, camera in hand, feeling more inspired than ever. I&apos;m here for the soft smiles, the real laughs, the quiet in between moments, and the magic people do not always see in themselves.
            </p>
            <p className="text-lg text-[#3C4033] leading-relaxed animate-fadeInUp animate-delay-400">
              I can&apos;t wait to meet you, hype you up, chase beautiful light with you, and create images you will love forever.
            </p>
            <p className="text-lg text-[#3C4033] leading-relaxed font-medium animate-fadeInUp animate-delay-500">
              ~ XO, Zee
            </p>
          </div>
        </div>
      </section>

      {/* Photo Gallery Section */}
      <section className="py-20 bg-[#F4F1EA]">
        <div className="max-w-7xl mx-auto px-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {homeGalleryImages.map((image, index) => (
              <div
                key={index}
                className="rounded-lg overflow-hidden shadow-soft bg-black aspect-[4/3] transition-all duration-500 hover:translate-y-[-12px] hover:shadow-elegant animate-fadeInUp"
                style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'both' }}
              >
                <Image
                  src={`/${image}`}
                  alt={`Gallery image ${index + 1}`}
                  width={400}
                  height={300}
                  className="w-full h-full object-cover transition-all duration-500 hover:scale-110 hover:brightness-110"
                  loading={index < 3 ? 'eager' : 'lazy'}
                  style={
                    image === 'bluebonnetboys.jpg' 
                      ? { objectPosition: '59% 25%' }
                      : image === 'headshot.jpg'
                      ? { objectPosition: 'center 30%' }
                      : image === 'prom.jpg'
                      ? { objectPosition: 'center 40%' }
                      : {}
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Get In Touch Section */}
      <section id="contact" className="py-20 bg-[#F8F7F1]">
        <div className="max-w-2xl mx-auto px-5 text-center">
          <h2 className="font-serif text-5xl mb-4 text-[#D4AF50] font-normal tracking-wide">
            Get In Touch
          </h2>
          <p className="text-lg text-[#3C4033] mb-10">
            Interested in a photoshoot or have questions? I&apos;d love to hear from you.
          </p>
          <Link
            href="/contact"
            className="inline-block px-12 py-4 bg-[#D4AF50] text-black rounded-md text-base font-medium tracking-wide uppercase transition-all duration-300 hover:bg-[#B8943A] hover:translate-y-[-3px] hover:shadow-elegant hover:scale-105 active:scale-100 golden-highlight"
          >
            Get In Touch
          </Link>
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

