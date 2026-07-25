const RewardsPage = () => {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-4xl md:text-5xl text-sienna mb-4 text-center">Pettles Loyalty Program</h1>
        <p className="text-center text-obsidian/70 text-lg mb-16">
          Earn points with every purchase and redeem for amazing rewards
        </p>

        {/* How It Works */}
        <section className="mb-16">
          <h2 className="font-serif text-3xl text-obsidian mb-8 text-center">How Pettles Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg border-2 border-sienna/20 p-8 text-center">
              <div className="text-5xl mb-4">🛍️</div>
              <h3 className="font-serif text-xl text-sienna mb-3">Earn Points</h3>
              <p className="text-obsidian/70 text-sm">
                Get 1 point for every ₹1 spent on purchases
              </p>
            </div>

            <div className="bg-white rounded-lg border-2 border-sienna/20 p-8 text-center">
              <div className="text-5xl mb-4">⭐</div>
              <h3 className="font-serif text-xl text-sienna mb-3">Bonus Points</h3>
              <p className="text-obsidian/70 text-sm">
                Write reviews, upload photos, share stories, and refer friends
              </p>
            </div>

            <div className="bg-white rounded-lg border-2 border-sienna/20 p-8 text-center">
              <div className="text-5xl mb-4">🎁</div>
              <h3 className="font-serif text-xl text-sienna mb-3">Redeem Rewards</h3>
              <p className="text-obsidian/70 text-sm">
                Convert points to discounts on future purchases
              </p>
            </div>

            <div className="bg-white rounded-lg border-2 border-sienna/20 p-8 text-center">
              <div className="text-5xl mb-4">🌱</div>
              <h3 className="font-serif text-xl text-sienna mb-3">Level Up</h3>
              <p className="text-obsidian/70 text-sm">
                Unlock exclusive perks as you climb tiers
              </p>
            </div>
          </div>
        </section>

        {/* Earning Points */}
        <section className="mb-16">
          <h2 className="font-serif text-3xl text-obsidian mb-8 text-center">Ways to Earn Pettles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-linen rounded-lg border-2 border-sienna/20 p-8">
              <h3 className="font-serif text-2xl text-sienna mb-4">🛍️ Purchase</h3>
              <p className="text-obsidian/70 mb-4">1 point per ₹1 spent</p>
              <p className="text-sm text-obsidian/70">
                Every purchase automatically earns you points. Track your points in your account dashboard.
              </p>
            </div>

            <div className="bg-linen rounded-lg border-2 border-sienna/20 p-8">
              <h3 className="font-serif text-2xl text-sienna mb-4">⭐ Write Reviews</h3>
              <p className="text-obsidian/70 mb-4">25 points per review</p>
              <p className="text-sm text-obsidian/70">
                Share your feedback on products you've purchased. Helpful reviews get bonus points!
              </p>
            </div>

            <div className="bg-linen rounded-lg border-2 border-sienna/20 p-8">
              <h3 className="font-serif text-2xl text-sienna mb-4">📸 Upload Photos</h3>
              <p className="text-obsidian/70 mb-4">50 points per photo</p>
              <p className="text-sm text-obsidian/70">
                Share beautiful photos of your BloomWire flowers. Get featured on our Instagram for extra points!
              </p>
            </div>

            <div className="bg-linen rounded-lg border-2 border-sienna/20 p-8">
              <h3 className="font-serif text-2xl text-sienna mb-4">📖 Share Stories</h3>
              <p className="text-obsidian/70 mb-4">100 points per story</p>
              <p className="text-sm text-obsidian/70">
                Tell us the story behind your flower purchase. Heartwarming stories earn bonus points.
              </p>
            </div>

            <div className="bg-linen rounded-lg border-2 border-sienna/20 p-8">
              <h3 className="font-serif text-2xl text-sienna mb-4">👥 Refer Friends</h3>
              <p className="text-obsidian/70 mb-4">200 points per successful referral</p>
              <p className="text-sm text-obsidian/70">
                Share your referral code with friends. Earn points when they make their first purchase.
              </p>
            </div>

            <div className="bg-linen rounded-lg border-2 border-sienna/20 p-8">
              <h3 className="font-serif text-2xl text-sienna mb-4">🎂 Birthdays</h3>
              <p className="text-obsidian/70 mb-4">100 bonus points</p>
              <p className="text-sm text-obsidian/70">
                Get a special birthday bonus when you update your profile with your birthday.
              </p>
            </div>
          </div>
        </section>

        {/* Redemption */}
        <section className="mb-16">
          <h2 className="font-serif text-3xl text-obsidian mb-8 text-center">Redeem Your Pettles</h2>
          <div className="bg-sienna text-linen rounded-lg p-12 text-center">
            <p className="text-lg mb-8">Convert your Pettles points into exciting rewards:</p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="bg-linen/20 rounded-lg p-6">
                <p className="text-2xl font-bold mb-2">100 pts</p>
                <p className="text-linen/90">₹50 off</p>
              </div>
              <div className="bg-linen/20 rounded-lg p-6">
                <p className="text-2xl font-bold mb-2">250 pts</p>
                <p className="text-linen/90">₹150 off</p>
              </div>
              <div className="bg-linen/20 rounded-lg p-6">
                <p className="text-2xl font-bold mb-2">500 pts</p>
                <p className="text-linen/90">₹350 off</p>
              </div>
              <div className="bg-linen/20 rounded-lg p-6">
                <p className="text-2xl font-bold mb-2">1000 pts</p>
                <p className="text-linen/90">₹800 off</p>
              </div>
            </div>
          </div>
        </section>

        {/* Tier System */}
        <section>
          <h2 className="font-serif text-3xl text-obsidian mb-8 text-center">Loyalty Tiers</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg border-2 border-sienna/20 p-8 text-center">
              <div className="text-4xl mb-4">🌱</div>
              <h3 className="font-serif text-xl text-sienna mb-2">Seed</h3>
              <p className="text-obsidian/70 text-sm mb-4">0-500 points</p>
              <ul className="text-sm text-obsidian/70 space-y-2">
                <li>✓ Earn 1 point per ₹1</li>
                <li>✓ Member benefits</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg border-2 border-sienna/20 p-8 text-center">
              <div className="text-4xl mb-4">🌿</div>
              <h3 className="font-serif text-xl text-sienna mb-2">Sprout</h3>
              <p className="text-obsidian/70 text-sm mb-4">500-2000 points</p>
              <ul className="text-sm text-obsidian/70 space-y-2">
                <li>✓ 1.25x points multiplier</li>
                <li>✓ Early access to sales</li>
                <li>✓ Exclusive offers</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg border-2 border-sienna/20 p-8 text-center">
              <div className="text-4xl mb-4">🌸</div>
              <h3 className="font-serif text-xl text-sienna mb-2">Bloom</h3>
              <p className="text-obsidian/70 text-sm mb-4">2000-5000 points</p>
              <ul className="text-sm text-obsidian/70 space-y-2">
                <li>✓ 1.5x points multiplier</li>
                <li>✓ Priority customer support</li>
                <li>✓ Free shipping always</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg border-2 border-sienna/20 p-8 text-center">
              <div className="text-4xl mb-4">🌹</div>
              <h3 className="font-serif text-xl text-sienna mb-2">Garden</h3>
              <p className="text-obsidian/70 text-sm mb-4">5000+ points</p>
              <ul className="text-sm text-obsidian/70 space-y-2">
                <li>✓ 2x points multiplier</li>
                <li>✓ VIP treatment</li>
                <li>✓ Exclusive products</li>
                <li>✓ Personal florist</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default RewardsPage
