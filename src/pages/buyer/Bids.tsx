import { Link } from 'react-router-dom';
import { listings } from '@/data/mockData';
import { useCountdown } from '@/hooks/useCountdown';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Gavel, 
  Heart, 
  LogOut,
  SwitchCamera,
  ShoppingBag as LogoIcon,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

function BidItem({ listing }: { listing: typeof listings[0] }) {
  const { formatted, isExpired } = useCountdown(listing.endDate);
  const myBid = listing.bids.find(b => b.userId === 'buyer-1');
  const isWinning = listing.bids[0]?.userId === 'buyer-1';
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(price);
  };

  return (
    <Link 
      to={`/marketplace/${listing.id}`}
      className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
    >
      <img 
        src={listing.images[0]} 
        alt={listing.title}
        className="w-20 h-20 object-cover rounded"
      />
      <div className="flex-1">
        <p className="font-medium">{listing.title}</p>
        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
          <span>Your bid: {formatPrice(myBid?.amount || 0)}</span>
          <span>Current: {formatPrice(listing.currentPrice)}</span>
        </div>
        <div className="flex items-center gap-4 mt-2">
          <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded ${
            isWinning ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {isWinning ? <TrendingUp className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
            {isWinning ? 'You\'re winning' : 'You\'ve been outbid'}
          </span>
          <span className="text-sm text-gray-500">
            {isExpired ? 'Ended' : `${formatted} left`}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {!isExpired && !isWinning && (
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
            Bid again
          </button>
        )}
      </div>
    </Link>
  );
}

export function BuyerBids() {
  const { user, logout } = useAuth();

  const myBids = listings.filter(l => l.bids.some(b => b.userId === 'buyer-1'));
  const activeBids = myBids.filter(l => new Date(l.endDate) > new Date());
  const endedBids = myBids.filter(l => new Date(l.endDate) <= new Date());

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r z-50 hidden lg:block">
        <div className="p-4 border-b">
          <Link to="/marketplace" className="flex items-center gap-2">
            <LogoIcon className="w-6 h-6 text-blue-600" />
            <span className="text-xl font-semibold">Chigona Auctions</span>
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
          <Link to="/buyer/bids" className="flex items-center gap-3 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg">
            <Gavel className="w-5 h-5" />
            <span className="font-medium">My Bids</span>
          </Link>
          <Link to="/buyer/watchlist" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
            <Heart className="w-5 h-5" />
            <span>Watchlist</span>
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
            <span className="font-semibold">Chigona auctions </span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/buyer/dashboard" className="p-2 hover:bg-gray-100 rounded-lg">
              <LayoutDashboard className="w-5 h-5" />
            </Link>
            <Link to="/buyer/orders" className="p-2 hover:bg-gray-100 rounded-lg">
              <ShoppingBag className="w-5 h-5" />
            </Link>
            <Link to="/buyer/watchlist" className="p-2 hover:bg-gray-100 rounded-lg">
              <Heart className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="lg:ml-64 p-4 lg:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold">My Bids</h1>
            <p className="text-gray-500">Track your auction activity</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg border text-center">
              <p className="text-2xl font-bold">{activeBids.length}</p>
              <p className="text-sm text-gray-500">Active bids</p>
            </div>
            <div className="bg-white p-4 rounded-lg border text-center">
              <p className="text-2xl font-bold text-green-600">
                {activeBids.filter(l => l.bids[0]?.userId === 'buyer-1').length}
              </p>
              <p className="text-sm text-gray-500">Winning</p>
            </div>
            <div className="bg-white p-4 rounded-lg border text-center">
              <p className="text-2xl font-bold text-red-600">
                {activeBids.filter(l => l.bids[0]?.userId !== 'buyer-1').length}
              </p>
              <p className="text-sm text-gray-500">Outbid</p>
            </div>
          </div>

          {/* Active Bids */}
          <div className="bg-white rounded-lg border mb-6">
            <div className="p-4 border-b">
              <h2 className="font-semibold">Active Auctions</h2>
            </div>
            <div className="divide-y">
              {activeBids.length > 0 ? activeBids.map(listing => (
                <BidItem key={listing.id} listing={listing} />
              )) : (
                <div className="p-8 text-center text-gray-500">
                  <p>No active bids</p>
                  <Link to="/marketplace" className="text-blue-600 hover:underline mt-2 inline-block">
                    Browse auctions
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Ended Bids */}
          {endedBids.length > 0 && (
            <div className="bg-white rounded-lg border">
              <div className="p-4 border-b">
                <h2 className="font-semibold">Ended Auctions</h2>
              </div>
              <div className="divide-y">
                {endedBids.map(listing => (
                  <BidItem key={listing.id} listing={listing} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
