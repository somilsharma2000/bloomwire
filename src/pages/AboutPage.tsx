const AboutPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-16 md:py-24 px-4 bg-gradient-to-b from-linen to-sage/20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-serif text-5xl md:text-6xl text-sienna mb-6">TACTILE BOTANICA</h1>
          <p className="text-2xl text-obsidian mb-4">Where Luxury Blooms</p>
          <p className="text-lg text-obsidian/70">
            Handcrafted luxury flowers that celebrate life's most beautiful moments
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-4xl text-obsidian mb-8 text-center">Our Mission</h2>
          <p className="text-lg text-obsidian/70 mb-6 leading-relaxed">
            At BloomWire, we believe that flowers are more than just plants—they're messengers of emotion, carriers of love, and symbols of life's most precious moments. Our mission is to deliver premium, handcrafted floral arrangements that transform ordinary occasions into extraordinary memories.
          </p>
          <p className="text-lg text-obsidian/70 leading-relaxed">
            Every bouquet is curated with meticulous care, ensuring that when you send flowers from BloomWire, you're sending not just blooms, but a piece of luxury, artistry, and tactile beauty.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24 px-4 bg-obsidian/5">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-4xl text-obsidian mb-12 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg border-2 border-sienna/20 p-8 text-center">
              <div className="text-5xl mb-4">🌹</div>
              <h3 className="font-serif text-2xl text-sienna mb-4">Quality</h3>
              <p className="text-obsidian/70">
                We source only the freshest, most premium flowers. Every stem is hand-selected for perfection. Our freshness guarantee ensures your flowers stay beautiful longer.
              </p>
            </div>

            <div className="bg-white rounded-lg border-2 border-sienna/20 p-8 text-center">
              <div className="text-5xl mb-4">🌱</div>
              <h3 className="font-serif text-2xl text-sienna mb-4">Sustainability</h3>
              <p className="text-obsidian/70">
                We're committed to eco-friendly practices. Our packaging is recyclable, and we partner with sustainable suppliers who share our vision for a greener future.
              </p>
            </div>

            <div className="bg-white rounded-lg border-2 border-sienna/20 p-8 text-center">
              <div className="text-5xl mb-4">✨</div>
              <h3 className="font-serif text-2xl text-sienna mb-4">Artistry</h3>
              <p className="text-obsidian/70">
                Our florists are artists. Every arrangement is a masterpiece, thoughtfully designed to capture emotion and create lasting impressions through tactile botanical beauty.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-4xl text-obsidian mb-8 text-center">Our Story</h2>
          <p className="text-lg text-obsidian/70 mb-6 leading-relaxed">
            BloomWire was born from a simple idea: luxury flowers shouldn't be hard to access. What started as a passion for beautiful blooms has grown into a thriving floral business serving thousands of happy customers across India.
          </p>
          <p className="text-lg text-obsidian/70 mb-6 leading-relaxed">
            Every day, our dedicated team of florists, designers, and delivery specialists work tirelessly to ensure that when you choose BloomWire, you're choosing more than flowers—you're choosing a promise of luxury, freshness, and artistry.
          </p>
          <p className="text-lg text-obsidian/70 leading-relaxed">
            With TACTILE BOTANICA as our creative vision, we continue to push boundaries, innovate designs, and celebrate the beauty of nature in every arrangement.
          </p>
        </div>
      </section>
    </div>
  )
}

export default AboutPage
