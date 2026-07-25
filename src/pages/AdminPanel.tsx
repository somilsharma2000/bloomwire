import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, Menu, X } from 'lucide-react'

const AdminPanel = () => {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [error, setError] = useState('')

  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123'

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      setPassword('')
      setError('')
    } else {
      setError('Invalid password')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setPassword('')
    navigate('/')
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linen">
        <div className="bg-white rounded-lg border-2 border-sienna p-8 max-w-md w-full">
          <h1 className="font-serif text-3xl text-sienna text-center mb-8">Admin Panel</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="form-input"
              autoFocus
            />
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button type="submit" className="btn-tactile w-full">
              Login
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex bg-linen">
      {/* Sidebar */}
      <div
        className={`bg-obsidian text-linen fixed lg:static h-screen flex flex-col transition-all duration-300 z-40 ${
          sidebarOpen ? 'w-64' : 'w-0 lg:w-20'
        }`}
      >
        <div className="p-4 border-b border-linen/20">
          <h2 className="font-serif text-xl font-bold">BloomWire</h2>
          <p className="text-xs text-linen/70">Admin Panel</p>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: '📊' },
            { id: 'orders', label: 'Orders', icon: '📦' },
            { id: 'products', label: 'Products', icon: '🌹' },
            { id: 'coupons', label: 'Coupons', icon: '🎟️' },
            { id: 'customers', label: 'Customers', icon: '👥' },
            { id: 'reviews', label: 'Reviews', icon: '⭐' },
            { id: 'photos', label: 'Photos', icon: '📸' },
            { id: 'stories', label: 'Stories', icon: '📖' },
            { id: 'analytics', label: 'Analytics', icon: '📈' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full text-left px-4 py-3 rounded-lg transition whitespace-nowrap ${
                activeTab === item.id ? 'bg-sienna text-linen' : 'hover:bg-linen/10'
              }`}
            >
              <span className="mr-2">{item.icon}</span>
              <span className={sidebarOpen ? 'inline' : 'hidden lg:inline'}>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="border-t border-linen/20 p-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition"
          >
            <LogOut className="w-5 h-5" />
            <span className={sidebarOpen ? 'inline' : 'hidden lg:inline'}>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className="bg-white border-b border-sienna/20 p-4 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 hover:bg-linen rounded-lg"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <h1 className="font-serif text-2xl text-obsidian flex-1">
            {[
              { id: 'dashboard', label: 'Dashboard' },
              { id: 'orders', label: 'Orders' },
              { id: 'products', label: 'Products' },
              { id: 'coupons', label: 'Coupons' },
              { id: 'customers', label: 'Customers' },
              { id: 'reviews', label: 'Reviews' },
              { id: 'photos', label: 'Photos' },
              { id: 'stories', label: 'Stories' },
              { id: 'analytics', label: 'Analytics' },
            ].find((item) => item.id === activeTab)?.label}
          </h1>
        </div>

        {/* Content */}
        <div className="p-6 max-w-7xl mx-auto">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { label: 'Total Orders', value: '5,234', icon: '📦' },
                  { label: 'Total Revenue', value: '₹52,34,000', icon: '💰' },
                  { label: 'Active Customers', value: '2,156', icon: '👥' },
                  { label: 'Products', value: '156', icon: '🌹' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white rounded-lg border-2 border-sienna/20 p-6">
                    <p className="text-3xl mb-2">{stat.icon}</p>
                    <p className="text-obsidian/70 text-sm">{stat.label}</p>
                    <p className="font-serif text-2xl text-sienna font-bold">{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-lg border-2 border-sienna/20 p-6">
                <h3 className="font-serif text-xl text-obsidian mb-4">Recent Orders</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-sienna/20">
                        <th className="text-left py-3 px-2 font-medium">Order ID</th>
                        <th className="text-left py-3 px-2 font-medium">Customer</th>
                        <th className="text-left py-3 px-2 font-medium">Amount</th>
                        <th className="text-left py-3 px-2 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {['BW1721898234ABC', 'BW1721898233XYZ', 'BW1721898232PQR'].map((id, i) => (
                        <tr key={i} className="border-b border-sienna/10">
                          <td className="py-3 px-2">{id}</td>
                          <td className="py-3 px-2">Customer {i + 1}</td>
                          <td className="py-3 px-2">₹{(999 + i * 500).toLocaleString('en-IN')}</td>
                          <td className="py-3 px-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              i === 0 ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                              {i === 0 ? 'Delivered' : 'Processing'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="bg-white rounded-lg border-2 border-sienna/20 p-6">
              <h3 className="font-serif text-xl text-obsidian mb-4">All Orders</h3>
              <p className="text-obsidian/70">Order management interface - view, update status, process refunds</p>
              <button className="btn-tactile mt-4">Manage Orders</button>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="bg-white rounded-lg border-2 border-sienna/20 p-6">
              <h3 className="font-serif text-xl text-obsidian mb-4">Product Management</h3>
              <p className="text-obsidian/70">Add, edit, delete products and manage inventory</p>
              <div className="mt-4 space-y-2">
                <button className="btn-tactile">Add New Product</button>
              </div>
            </div>
          )}

          {activeTab === 'coupons' && (
            <div className="bg-white rounded-lg border-2 border-sienna/20 p-6">
              <h3 className="font-serif text-xl text-obsidian mb-4">Coupon Management</h3>
              <p className="text-obsidian/70">Create, edit, delete coupons and track usage by creator</p>
              <button className="btn-tactile mt-4">Create Coupon</button>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="bg-white rounded-lg border-2 border-sienna/20 p-6">
              <h3 className="font-serif text-xl text-obsidian mb-4">Review Approval Queue</h3>
              <p className="text-obsidian/70">Approve or reject customer product reviews</p>
              <button className="btn-tactile mt-4">Review Submissions</button>
            </div>
          )}

          {activeTab === 'photos' && (
            <div className="bg-white rounded-lg border-2 border-sienna/20 p-6">
              <h3 className="font-serif text-xl text-obsidian mb-4">Customer Photos</h3>
              <p className="text-obsidian/70">Approve customer photo uploads for display on site</p>
              <button className="btn-tactile mt-4">Review Photos</button>
            </div>
          )}

          {activeTab === 'stories' && (
            <div className="bg-white rounded-lg border-2 border-sienna/20 p-6">
              <h3 className="font-serif text-xl text-obsidian mb-4">Customer Stories</h3>
              <p className="text-obsidian/70">Approve customer stories and award Pettles points</p>
              <button className="btn-tactile mt-4">Review Stories</button>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg border-2 border-sienna/20 p-6">
                  <h3 className="font-serif text-xl text-obsidian mb-4">Sales by Day</h3>
                  <p className="text-obsidian/70 text-sm">7-day sales trend chart would render here</p>
                </div>
                <div className="bg-white rounded-lg border-2 border-sienna/20 p-6">
                  <h3 className="font-serif text-xl text-obsidian mb-4">Top Products</h3>
                  <p className="text-obsidian/70 text-sm">Best selling products this month</p>
                </div>
                <div className="bg-white rounded-lg border-2 border-sienna/20 p-6">
                  <h3 className="font-serif text-xl text-obsidian mb-4">Revenue by Coupon</h3>
                  <p className="text-obsidian/70 text-sm">Track coupon performance and creator ROI</p>
                </div>
                <div className="bg-white rounded-lg border-2 border-sienna/20 p-6">
                  <h3 className="font-serif text-xl text-obsidian mb-4">Customer Insights</h3>
                  <p className="text-obsidian/70 text-sm">Repeat customers, average order value, etc.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminPanel
