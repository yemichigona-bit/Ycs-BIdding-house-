import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { buyerStats, orders, listings, watchlist } from '@/data/mockData';
import { useCountdown } from '@/hooks/useCountdown';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Gavel, 
  Heart, 
  LogOut,
  SwitchCamera,
  ShoppingBag as LogoIcon,
  Eye,
  TrendingUp,
  CheckCircle
} from 'lucide-react';

function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  color,
  link
}: { 
  title: string; 
  value: string | number; 
  icon: React.ElementType;
  color: string;
  link: string;
}) {
  return (
    <Link to={link} className="bg-white p-6 rounded-lg border hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </Link>
  );
}

function WatchlistItem({ listingId }: { listingId: string }) {
  const listing = listings.find(l => l.id === listingId);
  const { formatted, isExpired } = useCountdown(listing?.endDate || new Date());
  
  if (!listing) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(price);
  };

  return (
    <Link 
      to={`/marketplace/${listing.id}`}
      className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
    >
      <img 
        src={listing.images[0]} 
        alt={listing.title}
        className="w-16 h-16 object-cover rounded"
      />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{listing.title}</p>
        <p className="text-sm text-gray-500">{formatPrice(listing.currentPrice)} · {listing.bidCount} bids</p>
      </div>
      <div className="text-right">
        <p className="text-sm text-gray-500">{isExpired ? 'Ended' : formatted}</p>
      </div>
    </Link>
  );
}

export function BuyerDashboard() {
  const { user, logout } = useAuth();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(price);
  };

  const myOrders = orders.filter(o => o.buyerId === 'buyer-1').slice(0, 5);
  const myBids = listings.filter(l => l.bids.some(b => b.userId === 'buyer-1')).slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r z-50 hidden lg:block">
        <div className="p-4 border-b">
          <Link to="/marketplace" className="flex items-center gap-2">
            <LogoIcon className="w-6 h-6 text-blue-600" />
            <span className="text-xl font-semibold">Chigona Market</span>
          </Link>
        </div>
        
        <nav className="p-4 space-y-1">
          <Link to="/buyer/dashboard" className="flex items-center gap-3 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg">
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </Link>
          <Link to="/buyer/orders" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
            <ShoppingBag className="w-5 h-5" />
            <span>My Orders</span>
          </Link>
          <Link to="/buyer/bids" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
            <Gavel className="w-5 h-5" />
            <span>My Bids</span>
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
            <span className="font-semibold">Chigona Market</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/buyer/orders" className="p-2 hover:bg-gray-100 rounded-lg">
              <ShoppingBag className="w-5 h-5" />
            </Link>
            <Link to="/buyer/bids" className="p-2 hover:bg-gray-100 rounded-lg">
              <Gavel className="w-5 h-5" />
            </Link>
            <Link to="/buyer/watchlist" className="p-2 hover:bg-gray-100 rounded-lg">
              <Heart className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="lg:ml-64 p-4 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold">Buyer Dashboard</h1>
            <p className="text-gray-500">Track your bids, orders, and saved items</p>
          </div>

          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              title="Watching"
              value={buyerStats.watchingCount}
              icon={Eye}
              color="bg-purple-100 text-purple-600"
              link="/buyer/watchlist"
            />
            <StatCard
              title="Active Bids"
              value={buyerStats.activeBids}
              icon={TrendingUp}
              color="bg-blue-100 text-blue-600"
              link="/buyer/bids"
            />
            <StatCard
              title="Winning"
              value={buyerStats.winningBids}
              icon={CheckCircle}
              color="bg-green-100 text-green-600"
              link="/buyer/bids"
            />
            <StatCard
              title="Orders"
              value={buyerStats.ordersCount}
              icon={ShoppingBag}
              color="bg-orange-100 text-orange-600"
              link="/buyer/orders"
            />
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* My Orders */}
            <div className="bg-white rounded-lg border">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="font-semibold">Recent Orders</h2>
                <Link to="/buyer/orders" className="text-blue-600 text-sm hover:underline">
                  View all
                </Link>
              </div>
              <div className="divide-y">
                {myOrders.length > 0 ? myOrders.map(order => (
                  <div key={order.id} className="p-4 flex items-center gap-4">
                    <img 
                      src={order.listingImage} 
                      alt={order.listingTitle}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{order.listingTitle}</p>
                      <p className="text-sm text-gray-500">{formatPrice(order.total)}</p>
                    </div>
                    <span className={`inline-block text-xs px-2 py-0.5 rounded ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'dispatched' ? 'bg-blue-100 text-blue-700' :
                      order.status === 'paid' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                )) : (
                  <div className="p-8 text-center text-gray-500">
                    <p>No orders yet</p>
                    <Link to="/marketplace" className="text-blue-600 hover:underline mt-2 inline-block">
                      Start shopping
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Watchlist */}
            <div className="bg-white rounded-lg border">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="font-semibold">Watchlist</h2>
                <Link to="/buyer/watchlist" className="text-blue-600 text-sm hover:underline">
                  View all
                </Link>
              </div>
              <div className="divide-y">
                {watchlist.length > 0 ? watchlist.slice(0, 5).map(item => (
                  <WatchlistItem key={item.listingId} listingId={item.listingId} />
                )) : (
                  <div className="p-8 text-center text-gray-500">
                    <p>No items in watchlist</p>
                    <Link to="/marketplace" className="text-blue-600 hover:underline mt-2 inline-block">
                      Browse items
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* My Bids Preview */}
          {myBids.length > 0 && (
            <div className="mt-8 bg-white rounded-lg border">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="font-semibold">My Active Bids</h2>
                <Link to="/buyer/bids" className="text-blue-600 text-sm hover:underline">
                  View all
                </Link>
              </div>
              <div className="divide-y">
                {myBids.slice(0, 3).map(listing => {
                  const myBid = listing.bids.find(b => b.userId === 'buyer-1');
                  const isWinning = listing.bids[0]?.userId === 'buyer-1';
                  const { formatted, isExpired } = useCountdown(listing.endDate);
                  
                  return (
                    <Link 
                      key={listing.id}
                      to={`/marketplace/${listing.id}`}
                      className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
                    >
                      <img 
                        src={listing.images[0]} 
                        alt={listing.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{listing.title}</p>
                        <p className="text-sm text-gray-500">
                          Your bid: {formatPrice(myBid?.amount || 0)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">{isExpired ? 'Ended' : formatted}</p>
                        <span className={`inline-block text-xs px-2 py-0.5 rounded ${
                          isWinning ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {isWinning ? 'Winning' : 'Outbid'}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
