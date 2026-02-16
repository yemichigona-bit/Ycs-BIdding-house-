import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { listings, categories } from '@/data/mockData';
import { useCountdown } from '@/hooks/useCountdown';
import { 
  Search, 
  ShoppingCart, 
  User, 
  Heart, 
  Gavel,
  MapPin,
  Star,
  Clock,
  LogOut,
  SwitchCamera
} from 'lucide-react';

function ListingCard({ listing }: { listing: typeof listings[0] }) {
  const { formatted, isExpired } = useCountdown(listing.endDate);
  const { user } = useAuth();
  const navigate = useNavigate();

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
    <div 
      onClick={() => navigate(`/marketplace/${listing.id}`)}
      className="bg-white border rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-gray-100">
        <img
          src={listing.images[0]}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
        />
        {listing.isDealOfTheDay && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
            Deal of the Day
          </span>
        )}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            // Add to watchlist
          }}
          className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50"
        >
          <Heart className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* Content */}
      <div className="p-3">
        <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded ${conditionColors[listing.condition]}`}>
          {listing.condition.replace('-', ' ')}
        </span>
        
        <h3 className="font-medium text-sm mt-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {listing.title}
        </h3>

        <div className="flex items-center gap-1 mt-1">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-3 h-3 ${i < Math.floor(listing.sellerRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">({listing.sellerSales})</span>
        </div>

        <div className="mt-2">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-semibold">{formatPrice(listing.currentPrice)}</span>
            {listing.buyNowPrice && (
              <span className="text-sm text-gray-400 line-through">{formatPrice(listing.buyNowPrice)}</span>
            )}
          </div>
          {listing.shipping > 0 ? (
            <p className="text-xs text-gray-500">+ {formatPrice(listing.shipping)} shipping</p>
          ) : (
            <p className="text-xs text-green-600">Free shipping</p>
          )}
        </div>

        <div className="flex items-center justify-between mt-3 pt-2 border-t">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            {isExpired ? 'Ended' : formatted}
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Gavel className="w-3 h-3" />
            {listing.bidCount} bids
          </div>
        </div>
      </div>
    </div>
  );
}

export function Marketplace() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredListings = useMemo(() => {
    return listings.filter(listing => {
      const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          listing.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || listing.category === selectedCategory;
      const isVisible = listing.visibility === 'public' || 
                       (user && listing.visibility === 'private');
      return matchesSearch && matchesCategory && isVisible;
    });
  }, [searchQuery, selectedCategory, user]);

  const dealsOfTheDay = listings.filter(l => l.isDealOfTheDay && l.visibility === 'public');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const switchAccount = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        {/* Top bar */}
        <div className="bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                Deliver to London
              </span>
            </div>
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <span>Hello, {user.name}</span>
                  <button onClick={switchAccount} className="hover:underline flex items-center gap-1">
                    <SwitchCamera className="w-3 h-3" />
                    Switch account
                  </button>
                  <button onClick={handleLogout} className="hover:underline flex items-center gap-1">
                    <LogOut className="w-3 h-3" />
                    Sign out
                  </button>
                </>
              ) : (
                <Link to="/login" className="hover:underline">Sign in</Link>
              )}
            </div>
          </div>
        </div>

        {/* Main header */}
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <Link to="/marketplace" className="flex items-center gap-2 flex-shrink-0">
              <ShoppingCart className="w-8 h-8 text-blue-600" />
              <div className="flex flex-col leading-tight">
  <span className="text-2xl font-semibold hidden sm:block">
    YC's Finest
  </span>

  <span className="text-xs text-gray-500 hidden sm:block">
    early jug catches the worm
  </span>
</div>
            </Link>

            {/* Search */}
            <div className="flex-1 max-w-2xl">
              <div className="flex">
                <select 
                  className="px-3 py-2 bg-gray-100 border border-r-0 rounded-l-lg text-sm hidden sm:block"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for items..."
                  className="flex-1 px-4 py-2 border rounded-l-lg sm:rounded-l-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700">
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              {user?.role === 'buyer' && (
                <Link to="/buyer/watchlist" className="flex flex-col items-center text-gray-600 hover:text-blue-600">
                  <Heart className="w-6 h-6" />
                  <span className="text-xs hidden sm:block">Watchlist</span>
                </Link>
              )}
              {user ? (
                <Link 
                  to={user.role === 'host' ? '/host/dashboard' : '/buyer/dashboard'}
                  className="flex flex-col items-center text-gray-600 hover:text-blue-600"
                >
                  <User className="w-6 h-6" />
                  <span className="text-xs hidden sm:block">Account</span>
                </Link>
              ) : (
                <Link to="/login" className="flex flex-col items-center text-gray-600 hover:text-blue-600">
                  <User className="w-6 h-6" />
                  <span className="text-xs hidden sm:block">Sign in</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Category nav */}
        <div className="border-t">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-hide">
              {categories.slice(1).map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-sm whitespace-nowrap rounded-full transition-colors ${
                    selectedCategory === cat 
                      ? 'bg-blue-600 text-white' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Deals of the Day */}
        {dealsOfTheDay.length > 0 && selectedCategory === 'All' && !searchQuery && (
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-red-500 text-white text-sm font-medium px-3 py-1 rounded">
                Deals of the Day
              </span>
              <span className="text-gray-500 text-sm">Ending soon - don't miss out!</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {dealsOfTheDay.slice(0, 5).map(listing => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </section>
        )}

        {/* All listings */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">
              {searchQuery ? `Results for "${searchQuery}"` : 
               selectedCategory !== 'All' ? selectedCategory : 'All Listings'}
            </h2>
            <span className="text-gray-500 text-sm">{filteredListings.length} results</span>
          </div>
          
          {filteredListings.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredListings.map(listing => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No listings found</p>
              <button 
                onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                className="text-blue-600 hover:underline mt-2"
              >
                Clear filters
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-3">Get to Know Us</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">About YC's Finest</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Press</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Make Money</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Sell on YC's Finest</a></li>
                <li><a href="#" className="hover:text-white">Become a Host</a></li>
                <li><a href="#" className="hover:text-white">Advertise</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Buyer Protection</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Money Back Guarantee</a></li>
                <li><a href="#" className="hover:text-white">Buyer Safety</a></li>
                <li><a href="#" className="hover:text-white">Returns</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Help</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Customer Service</a></li>
                <li><a href="#" className="hover:text-white">Shipping Rates</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
            © 2024 YC's Finest Marketplace. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
