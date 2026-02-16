import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { categories } from '@/data/mockData';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  ArrowLeft,
  LogOut,
  SwitchCamera,
  ShoppingBag as LogoIcon
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export function HostCreateListing() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Electronics',
    condition: 'good' as const,
    startingPrice: '',
    buyNowPrice: '',
    shipping: '3.99',
    visibility: 'public' as const,
    isDealOfTheDay: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would create the listing
    alert('Listing created successfully!');
    navigate('/host/listings');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r z-50 hidden lg:block">
        <div className="p-4 border-b">
          <Link to="/marketplace" className="flex items-center gap-2">
            <LogoIcon className="w-6 h-6 text-blue-600" />
            <span className="text-xl font-semibold">YC's Finest</span>
          </Link>
        </div>
        
        <nav className="p-4 space-y-1">
          <Link to="/host/dashboard" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
          <Link to="/host/listings" className="flex items-center gap-3 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg">
            <Package className="w-5 h-5" />
            <span className="font-medium">Listings</span>
          </Link>
          <Link to="/host/orders" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
            <ShoppingBag className="w-5 h-5" />
            <span>Orders</span>
          </Link>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="font-medium text-blue-600">{user?.name.charAt(0)}</span>
            </div>
            <div>
              <p className="font-medium text-sm">{user?.name}</p>
              <p className="text-xs text-gray-500">Host Account</p>
            </div>
          </div>
          <div className="space-y-1">
            <Link 
              to="/login" 
              onClick={() => logout()}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg w-full"
            >
              <SwitchCamera className="w-4 h-4" />
              Switch account
            </Link>
            <button 
              onClick={() => logout()}
              className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg w-full"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:ml-64 p-4 lg:p-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Link to="/host/listings" className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Create New Listing</h1>
              <p className="text-gray-500">Add a new item to your auctions</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-lg border p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="block font-medium mb-2">Item Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Apple AirPods Pro 2nd Gen"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block font-medium mb-2">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your item, including condition, features, and any defects..."
                rows={4}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Category & Condition */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-2">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.slice(1).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-medium mb-2">Condition *</label>
                <select
                  value={formData.condition}
                  onChange={(e) => setFormData({ ...formData, condition: e.target.value as typeof formData.condition })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="new">New</option>
                  <option value="like-new">Like New</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                </select>
              </div>
            </div>

            {/* Pricing */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-medium mb-2">Starting Price (£) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.startingPrice}
                  onChange={(e) => setFormData({ ...formData, startingPrice: e.target.value })}
                  placeholder="0.00"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-2">Buy Now Price (£)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.buyNowPrice}
                  onChange={(e) => setFormData({ ...formData, buyNowPrice: e.target.value })}
                  placeholder="Optional"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block font-medium mb-2">Shipping (£) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.shipping}
                  onChange={(e) => setFormData({ ...formData, shipping: e.target.value })}
                  placeholder="0.00"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Visibility */}
            <div>
              <label className="block font-medium mb-2">Visibility *</label>
              <div className="grid sm:grid-cols-3 gap-3">
                {(['public', 'private', 'unlisted'] as const).map((vis) => (
                  <label 
                    key={vis}
                    className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                      formData.visibility === vis ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="visibility"
                      value={vis}
                      checked={formData.visibility === vis}
                      onChange={(e) => setFormData({ ...formData, visibility: e.target.value as typeof formData.visibility })}
                      className="w-4 h-4 text-blue-600"
                    />
                    <div>
                      <p className="font-medium capitalize">{vis}</p>
                      <p className="text-xs text-gray-500">
                        {vis === 'public' && 'Visible to everyone'}
                        {vis === 'private' && 'Invite-only access'}
                        {vis === 'unlisted' && 'Only via direct link'}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Deal of the Day */}
            <div>
              <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={formData.isDealOfTheDay}
                  onChange={(e) => setFormData({ ...formData, isDealOfTheDay: e.target.checked })}
                  className="w-4 h-4 text-blue-600"
                />
                <div>
                  <p className="font-medium">Mark as Deal of the Day</p>
                  <p className="text-sm text-gray-500">Featured prominently on the homepage</p>
                </div>
              </label>
            </div>

            {/* Images placeholder */}
            <div>
              <label className="block font-medium mb-2">Images</label>
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <p className="text-gray-500">Drag and drop images here, or click to browse</p>
                <p className="text-sm text-gray-400 mt-1">PNG, JPG up to 10MB each</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4 border-t">
              <Link 
                to="/host/listings"
                className="flex-1 py-3 border rounded-lg text-center hover:bg-gray-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Listing
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
