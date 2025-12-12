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
];

export default function Portfolio() {
  return (
    <div>
      {/* Hero Section */}
      <section className="h-screen flex items-center justify-center text-center text-white relative bg-cover bg-fixed" style={{ backgroundImage: 'linear-gradient(rgba(60, 64, 51, 0.4), rgba(60, 64, 51, 0.4)), url(/girlsblue.jpg)', backgroundPosition: 'center 25%' }}>
        <div className="max-w-4xl mx-auto px-5">
          <h1 className="font-serif text-7xl mb-4 font-normal tracking-wider drop-shadow-lg">
            Portfolio
          </h1>
        </div>
      </section>

      {/* Portfolio Gallery Section */}
      <section className="py-24 bg-[#F4F1EA]">
        <div className="max-w-7xl mx-auto px-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolioImages.map((image, index) => (
              <div
                key={index}
                className="rounded-lg overflow-hidden shadow-soft bg-black aspect-[4/3] transition-all duration-500 hover:translate-y-[-12px] hover:shadow-elegant animate-fadeInUp"
                style={{ animationDelay: `${index * 0.08}s`, animationFillMode: 'both' }}
              >
                <Image
                  src={`/${image}`}
                  alt={`Portfolio image ${index + 1}`}
                  width={400}
                  height={300}
                  className="w-full h-full object-cover transition-all duration-500 hover:scale-110 hover:brightness-110"
                  loading={index < 6 ? 'eager' : 'lazy'}
                  style={
                    image === 'bluebonnetboys.jpg' 
                      ? { objectPosition: '59% 25%' }
                      : (image === 'april.jpg' || image === 'aprildance.jpg')
                      ? { objectPosition: 'center 30%' }
                      : (image === 'engagement1.jpg' || image === 'engagement2.jpg')
                      ? { objectPosition: 'center 30%' }
                      : image === 'brianna2.jpg'
                      ? { objectPosition: 'center 60%' }
                      : image === 'brianna3.jpg'
                      ? { objectPosition: 'center 10%' }
                      : (image === 'alexis.jpg' || image === 'alexiskiss.jpg' || image === 'headshot.jpg')
                      ? { objectPosition: 'center 30%' }
                      : {}
                  }
                />
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

