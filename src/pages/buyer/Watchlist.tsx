import { Link } from 'react-router-dom';
import { listings, watchlist } from '@/data/mockData';
import { useCountdown } from '@/hooks/useCountdown';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Gavel, 
  Heart, 
  LogOut,
  SwitchCamera,
  ShoppingBag as LogoIcon,
  Trash2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

function WatchlistCard({ listingId }: { listingId: string }) {
  const listing = listings.find(l => l.id === listingId);
  const { formatted, isExpired } = useCountdown(listing?.endDate || new Date());
  
  if (!listing) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(price);
  };

  const conditionColors = {
    'new': 'bg-green-100 text-green-700',
    'like-new': 'bg-blue-100 text-blue-700',
    'good': 'bg-yellow-100 text-yellow-700',
    'fair': 'bg-orange-100 text-orange-700',
  };

  return (
    <div className="bg-white rounded-lg border overflow-hidden hover:shadow-md transition-shadow">
      <Link to={`/marketplace/${listing.id}`}>
        <div className="aspect-[4/3] bg-gray-100">
          <img 
            src={listing.images[0]} 
            alt={listing.title}
            className="w-full h-full object-cover"
          />
        </div>
      </Link>
      <div className="p-4">
        <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded ${conditionColors[listing.condition]}`}>
          {listing.condition.replace('-', ' ')}
        </span>
        <Link to={`/marketplace/${listing.id}`}>
          <h3 className="font-medium mt-2 line-clamp-2 hover:text-blue-600 transition-colors">
            {listing.title}
          </h3>
        </Link>
        <p className="text-lg font-semibold mt-2">{formatPrice(listing.currentPrice)}</p>
        <div className="flex items-center justify-between mt-3 text-sm text-gray-500">
          <span>{isExpired ? 'Ended' : formatted}</span>
          <span>{listing.bidCount} bids</span>
        </div>
        <div className="flex gap-2 mt-4">
          <button 
            onClick={() => alert('Removed from watchlist')}
            className="flex-1 flex items-center justify-center gap-2 py-2 border rounded-lg hover:bg-gray-50"
          >
            <Trash2 className="w-4 h-4" />
            Remove
          </button>
          {!isExpired && (
            <Link 
              to={`/marketplace/${listing.id}`}
              className="flex-1 py-2 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700"
            >
              Bid now
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export function BuyerWatchlist() {
  const { user, logout } = useAuth();

  const watchedListings = watchlist.map(w => w.listingId);
  const activeWatched = watchedListings.filter(id => {
    const listing = listings.find(l => l.id === id);
    return listing && new Date(listing.endDate) > new Date();
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
          <Link to="/buyer/dashboard" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
          <Link to="/buyer/orders" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
            <ShoppingBag className="w-5 h-5" />
            <span>My Orders</span>
          </Link>
          <Link to="/buyer/bids" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
            <Gavel className="w-5 h-5" />
            <span>My Bids</span>
          </Link>
          <Link to="/buyer/watchlist" className="flex items-center gap-3 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg">
            <Heart className="w-5 h-5" />
            <span className="font-medium">Watchlist</span>
          </Link>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="font-medium text-blue-600">{user?.name.charAt(0)}</span>
            </div>
            <div>
              <p className="font-medium text-sm">{user?.name}</p>
              <p className="text-xs text-gray-500">Buyer Account</p>
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
            <Link to="/buyer/dashboard" className="p-2 hover:bg-gray-100 rounded-lg">
              <LayoutDashboard className="w-5 h-5" />
            </Link>
            <Link to="/buyer/orders" className="p-2 hover:bg-gray-100 rounded-lg">
              <ShoppingBag className="w-5 h-5" />
            </Link>
            <Link to="/buyer/bids" className="p-2 hover:bg-gray-100 rounded-lg">
              <Gavel className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="lg:ml-64 p-4 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">My Watchlist</h1>
              <p className="text-gray-500">Items you're watching ({activeWatched.length} active)</p>
            </div>
          </div>

          {/* Watchlist Grid */}
          {activeWatched.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {activeWatched.map(listingId => (
                <WatchlistCard key={listingId} listingId={listingId} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border p-12 text-center">
              <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Your watchlist is empty</h2>
              <p className="text-gray-500 mb-4">Save items you're interested in and we'll notify you before they end</p>
              <Link 
                to="/marketplace"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Browse marketplace
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
