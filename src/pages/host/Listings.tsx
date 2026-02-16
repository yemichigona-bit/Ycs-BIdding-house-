import { useState } from 'react';
import { Link } from 'react-router-dom';
import { listings } from '@/data/mockData';
import { useCountdown } from '@/hooks/useCountdown';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Plus, 
  Search,
  Filter,
  Edit,
  Eye,
  EyeOff,
  Star,
  LogOut,
  SwitchCamera,
  ShoppingBag as LogoIcon
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

function ListingRow({ listing }: { listing: typeof listings[0] }) {
  const { formatted, isExpired } = useCountdown(listing.endDate);
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(price);
  };

  const visibilityIcons = {
    'public': <Eye className="w-4 h-4 text-green-600" />,
    'private': <EyeOff className="w-4 h-4 text-yellow-600" />,
    'unlisted': <EyeOff className="w-4 h-4 text-gray-400" />,
  };

  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="p-4">
        <div className="flex items-center gap-3">
          <img 
            src={listing.images[0]} 
            alt={listing.title}
            className="w-12 h-12 object-cover rounded"
          />
          <div>
            <p className="font-medium">{listing.title}</p>
            <p className="text-sm text-gray-500">{listing.category}</p>
          </div>
        </div>
      </td>
      <td className="p-4">
        <div className="flex items-center gap-1">
          {visibilityIcons[listing.visibility]}
          <span className="text-sm capitalize">{listing.visibility}</span>
        </div>
      </td>
      <td className="p-4">
        {listing.isDealOfTheDay && (
          <span className="inline-flex items-center gap-1 text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
            <Star className="w-3 h-3" />
            Deal
          </span>
        )}
      </td>
      <td className="p-4">
        <p className="font-medium">{formatPrice(listing.currentPrice)}</p>
        <p className="text-sm text-gray-500">{listing.bidCount} bids</p>
      </td>
      <td className="p-4">
        <p className="text-sm">{isExpired ? 'Ended' : formatted}</p>
      </td>
      <td className="p-4">
        <div className="flex items-center gap-2">
          <Link 
            to={`/host/listings/${listing.id}/edit`}
            className="p-2 hover:bg-gray-100 rounded-lg"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </Link>
          <Link 
            to={`/marketplace/${listing.id}`}
            className="p-2 hover:bg-gray-100 rounded-lg"
            title="View"
          >
            <Eye className="w-4 h-4" />
          </Link>
        </div>
      </td>
    </tr>
  );
}

export function HostListings() {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisibility, setFilterVisibility] = useState<'all' | 'public' | 'private' | 'unlisted'>('all');

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVisibility = filterVisibility === 'all' || listing.visibility === filterVisibility;
    return matchesSearch && matchesVisibility;
  });

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

      {/* Mobile header */}
      <div className="lg:hidden bg-white border-b sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          <Link to="/marketplace" className="flex items-center gap-2">
            <LogoIcon className="w-6 h-6 text-blue-600" />
            <span className="font-semibold">YC's Finest</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/host/dashboard" className="p-2 hover:bg-gray-100 rounded-lg">
              <LayoutDashboard className="w-5 h-5" />
            </Link>
            <Link to="/host/orders" className="p-2 hover:bg-gray-100 rounded-lg">
              <ShoppingBag className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="lg:ml-64 p-4 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold">Your Listings</h1>
              <p className="text-gray-500">Manage all your auction listings</p>
            </div>
            <Link 
              to="/host/listings/new"
              className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Create Listing
            </Link>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search listings..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={filterVisibility}
                onChange={(e) => setFilterVisibility(e.target.value as typeof filterVisibility)}
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All visibility</option>
                <option value="public">Public</option>
                <option value="private">Private</option>
                <option value="unlisted">Unlisted</option>
              </select>
            </div>
          </div>

          {/* Listings table */}
          <div className="bg-white rounded-lg border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-medium text-sm">Item</th>
                    <th className="text-left p-4 font-medium text-sm">Visibility</th>
                    <th className="text-left p-4 font-medium text-sm">Featured</th>
                    <th className="text-left p-4 font-medium text-sm">Price</th>
                    <th className="text-left p-4 font-medium text-sm">Ends</th>
                    <th className="text-left p-4 font-medium text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredListings.map(listing => (
                    <ListingRow key={listing.id} listing={listing} />
                  ))}
                </tbody>
              </table>
            </div>
            {filteredListings.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                <p>No listings found</p>
                <button 
                  onClick={() => { setSearchQuery(''); setFilterVisibility('all'); }}
                  className="text-blue-600 hover:underline mt-2"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
