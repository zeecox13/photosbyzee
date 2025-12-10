import Image from 'next/image';

// Portfolio images - excluding girlsblue.jpg (used as hero) and hero.jpg
const portfolioImages = [
  'april.jpg',
  'aprildance.jpg',
  'alexis.jpg',
  'alexiskiss.jpg',
  'baseball.jpg',
  'bluebonnetboys.jpg',
  'brianna1.jpg',
  'brianna2.jpg',
  'brianna3.jpg',
  'dance.jpg',
  'engagement1.jpg',
  'engagement2.jpg',
  'fall.jpg',
  'grad1.jpg',
  'grad2.jpg',
  'grad3.jpg',
  'grad4.jpg',
  'headshot.jpg',
  'jacks.jpg',
  'keilah1.jpg',
  'maternity1.jpg',
  'maternity2.jpg',
  'prom.jpg',
];

export default function Portfolio() {
  return (
    <div>
      {/* Hero Section */}
      <section className="h-screen flex items-center justify-center text-center text-white relative bg-cover bg-center bg-fixed" style={{ backgroundImage: 'linear-gradient(rgba(60, 64, 51, 0.4), rgba(60, 64, 51, 0.4)), url(/girlsblue.jpg)' }}>
        <div className="max-w-4xl mx-auto px-5">
          <h1 className="font-serif text-7xl mb-4 font-normal tracking-wider drop-shadow-lg">
            Portfolio
          </h1>
        </div>
      </section>

      {/* Portfolio Gallery Section */}
      <section className="py-20 bg-[#F4F1EA]">
        <div className="max-w-7xl mx-auto px-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolioImages.map((image, index) => (
              <div
                key={index}
                className="rounded-lg overflow-hidden shadow-lg bg-black aspect-[4/3] transition-transform duration-300 hover:translate-y-[-8px] hover:shadow-2xl"
              >
                <Image
                  src={`/${image}`}
                  alt={`Portfolio image ${index + 1}`}
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

