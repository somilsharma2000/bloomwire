with open('bloomwire/src/components/Layout.tsx', 'r') as f:
    code = f.read()

# Replace footer background
code = code.replace(
    '<footer className="relative z-10 bg-white/80 border-t border-[#2d2418]/10 mt-20 text-[#2d2418]">',
    '<footer className="relative z-10 bg-[#F5EDE6] border-t border-[#2d2418]/10 mt-20 text-[#2d2418]">'
)

# In Quick Links column 2 (About & Info), ensure /about and /giving links exist
old_column_2 = '''            {/* Quick Links Column 2 */}
            <div>
              <h4 className="text-xs font-medium uppercase tracking-wider text-[#2d2418] mb-4">About & Info</h4>
              <ul className="space-y-2.5 text-sm text-[#8a7a6a]">
                <li><Link to="/about" className="hover:text-bloom-rose transition-colors">Our Story</Link></li>
                <li><Link to="/faq" className="hover:text-bloom-rose transition-colors">FAQs</Link></li>
                <li><Link to="/contact" className="hover:text-bloom-rose transition-colors">Contact Support</Link></li>
                <li><Link to="/terms" className="hover:text-bloom-rose transition-colors">Terms & Conditions</Link></li>
                <li><Link to="/privacy" className="hover:text-bloom-rose transition-colors">Privacy Policy</Link></li>
                <li><Link to="/returns" className="hover:text-bloom-rose transition-colors">Returns & Refunds</Link></li>
                <li><Link to="/shipping" className="hover:text-bloom-rose transition-colors">Shipping Policy</Link></li>
              </ul>
            </div>'''

new_column_2 = '''            {/* Quick Links Column 2 */}
            <div>
              <h4 className="text-xs font-medium uppercase tracking-wider text-[#2d2418] mb-4">About & Info</h4>
              <ul className="space-y-2.5 text-sm text-[#8a7a6a]">
                <li><Link to="/about" className="hover:text-bloom-rose transition-colors">Our Story</Link></li>
                <li><Link to="/giving" className="hover:text-bloom-rose transition-colors flex items-center gap-1"><span className="text-xs">🐾</span> Every Bloom Gives a Dog a Home</Link></li>
                <li><Link to="/faq" className="hover:text-bloom-rose transition-colors">FAQs</Link></li>
                <li><Link to="/contact" className="hover:text-bloom-rose transition-colors">Contact Support</Link></li>
                <li><Link to="/terms" className="hover:text-bloom-rose transition-colors">Terms & Conditions</Link></li>
                <li><Link to="/privacy" className="hover:text-bloom-rose transition-colors">Privacy Policy</Link></li>
                <li><Link to="/returns" className="hover:text-bloom-rose transition-colors">Returns & Refunds</Link></li>
                <li><Link to="/shipping" className="hover:text-bloom-rose transition-colors">Shipping Policy</Link></li>
              </ul>
            </div>'''

code = code.replace(old_column_2, new_column_2)

# Business Info & Bottom Footer additions
old_business_info = '''          {/* Business Info (Legal Compliance) */}
          <div className="border-t border-[#2d2418]/10 pt-6 mt-6 text-center sm:text-left">
            <p className="text-xs text-[#a0918a] leading-relaxed">
              <span className="text-[#8a7a6a] font-medium">Bloomwire™</span> · Jaipur, Rajasthan, India
            </p>
            <p className="text-xs text-[#a0918a] mt-1">
              Grievance Officer: Somil Sharma · hello@bloomwire.in · Mon–Sat, 10 AM–6 PM IST
            </p>
          </div>'''

new_business_info = '''          {/* Business Info (Legal Compliance) */}
          <div className="border-t border-[#2d2418]/10 pt-6 mt-6 text-center sm:text-left">
            <p className="text-xs text-[#a0918a] leading-relaxed">
              <span className="text-[#8a7a6a] font-medium">Bloomwire™</span> · Jaipur, Rajasthan, India
            </p>
            <p className="text-xs text-[#a0918a] mt-1">
              Grievance Officer: Somil Sharma · hello@bloomwire.in · Mon–Sat, 10 AM–6 PM IST
            </p>
            <p className="text-xs text-[#8a7a6a] mt-3 font-medium">
              🐾 2% of every order supports Dog Home Foundation, Jodhpur — caring for 800+ stray animals
            </p>
          </div>'''

code = code.replace(old_business_info, new_business_info)

# Add flower quote at very bottom of footer
old_bottom_credit = '''          {/* Bottom Footer Credit */}
          <div className="mt-12 pt-8 border-t border-[#2d2418]/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[#a0918a]">
            <p>© {new Date().getFullYear()} Bloomwire Flowers. All rights reserved.</p>
            <p className="flex items-center gap-1">
              <span className="text-center sm:text-right break-words">Handcrafted lasting blooms <span className="text-bloom-rose">&hearts;</span> Gen Z Aesthetic</span>
            </p>
          </div>'''

new_bottom_credit = '''          {/* Bottom Footer Credit */}
          <div className="mt-12 pt-8 border-t border-[#2d2418]/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[#a0918a]">
            <p>© {new Date().getFullYear()} Bloomwire Flowers. All rights reserved.</p>
            <p className="flex items-center gap-1">
              <span className="text-center sm:text-right break-words">Handcrafted lasting blooms <span className="text-bloom-rose">&hearts;</span> Gen Z Aesthetic</span>
            </p>
          </div>
          <p className="italic font-serif text-[#9A9A9A] text-sm text-center mt-6 pt-4 border-t border-[#2d2418]/10">
            ✿ Where flowers bloom, so does hope. — Lady Bird Johnson ✿
          </p>'''

code = code.replace(old_bottom_credit, new_bottom_credit)

with open('bloomwire/src/components/Layout.tsx', 'w') as f:
    f.write(code)

print("Layout.tsx updated successfully!")
