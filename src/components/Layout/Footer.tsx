import { Mail, MapPin, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'

export const Footer = () => {
  return (
    <footer className="bg-obsidian text-linen mt-16 md:mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="font-serif text-2xl text-sienna mb-2">BloomWire</h3>
            <p className="text-sm text-linen/80 mb-4">TACTILE BOTANICA</p>
            <p className="text-sm text-linen/70">Where Luxury Blooms</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg text-sienna mb-4">Shop</h4>
            <ul className="space-y-2">
              <li><Link to="/shop" className="text-sm text-linen/80 hover:text-sienna transition">All Products</Link></li>
              <li><Link to="/shop?category=bouquets" className="text-sm text-linen/80 hover:text-sienna transition">Bouquets</Link></li>
              <li><Link to="/shop?category=arrangements" className="text-sm text-linen/80 hover:text-sienna transition">Arrangements</Link></li>
              <li><Link to="/rewards" className="text-sm text-linen/80 hover:text-sienna transition">Pettles Rewards</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-serif text-lg text-sienna mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-sm text-linen/80 hover:text-sienna transition">About Us</Link></li>
              <li><Link to="/faq" className="text-sm text-linen/80 hover:text-sienna transition">FAQ</Link></li>
              <li><Link to="/wholesale" className="text-sm text-linen/80 hover:text-sienna transition">Wholesale</Link></li>
              <li><Link to="/creator" className="text-sm text-linen/80 hover:text-sienna transition">Creator Program</Link></li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="font-serif text-lg text-sienna mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link to="/policy/shipping" className="text-sm text-linen/80 hover:text-sienna transition">Shipping</Link></li>
              <li><Link to="/policy/privacy" className="text-sm text-linen/80 hover:text-sienna transition">Privacy</Link></li>
              <li><Link to="/policy/terms" className="text-sm text-linen/80 hover:text-sienna transition">Terms</Link></li>
              <li><Link to="/policy/refund" className="text-sm text-linen/80 hover:text-sienna transition">Refund</Link></li>
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-linen/20 pt-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start space-x-3">
              <Mail className="w-5 h-5 text-sienna flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <a href="mailto:bloomwire2000@gmail.com" className="text-sm text-linen/80 hover:text-sienna transition">
                  bloomwire2000@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-sienna flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm font-medium">Address</p>
                <p className="text-sm text-linen/80">JAGDAMBA NAGAR, JAIPUR</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Clock className="w-5 h-5 text-sienna flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm font-medium">Hours</p>
                <p className="text-sm text-linen/80">24/7 Available</p>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-linen/20 pt-8 mb-8">
          <h4 className="font-serif text-lg text-sienna mb-4">Newsletter</h4>
          <p className="text-sm text-linen/80 mb-4">Subscribe for exclusive offers and updates</p>
          <form className="flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 bg-linen/10 border border-linen/30 rounded text-linen placeholder:text-linen/50 focus:outline-none focus:border-sienna"
            />
            <button className="px-6 py-2 bg-sienna text-linen rounded font-medium hover:bg-sienna/90 transition">
              Subscribe
            </button>
          </form>
        </div>

        {/* Copyright */}
        <div className="border-t border-linen/20 pt-8 text-center">
          <p className="text-sm text-linen/70">
            &copy; 2024 BloomWire. All rights reserved. | Crafted with 🌹 by TACTILE BOTANICA
          </p>
        </div>
      </div>
    </footer>
  )
}
