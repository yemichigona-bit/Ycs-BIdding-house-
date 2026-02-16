import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { hostStats, listings, orders } from '@/data/mockData';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Plus, 
  PoundSterling,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle,
  LogOut,
  SwitchCamera,
  Star
} from 'lucide-react';

function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  color,
  subtitle 
}: { 
  title: string; 
  value: string | number; 
  icon: React.ElementType;
  color: string;
  subtitle?: string;
}) {
  return (
    <div className="bg-white p-6 rounded-lg border">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {subtitle && <p className="text-sm text-gray-400 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

export function HostDashboard() {
  const { user, logout } = useAuth();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(price);
  };

  const recentOrders = orders.slice(0, 5);
  const activeListings = listings.filter(l => new Date(l.endDate) > new Date()).slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r z-50 hidden lg:block">
        <div className="p-4 border-b">
  <Link to="/marketplace" className="flex items-start gap-2">
    <ShoppingBag className="w-6 h-6 text-blue-600 mt-1" />
    <div className="leading-tight">
      <span className="text-xl font-semibold block">YC’s Finest</span>
      <span className="text-xs text-gray-500 block">
        Jug, jug and JUG some more
      </span>
    </div>
  </Link>
</div>
        
        <nav className="p-4 space-y-1">
          <Link to="/host/dashboard" className="flex items-center gap-3 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg">
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </Link>
          <Link to="/host/listings" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
            <Package className="w-5 h-5" />
            <span>Listings</span>
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
            <ShoppingBag className="w-6 h-6 text-blue-600" />
            <span className="font-semibold">Chigona</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/host/listings" className="p-2 hover:bg-gray-100 rounded-lg">
              <Package className="w-5 h-5" />
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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold">Host Dashboard</h1>
              <p className="text-gray-500">Manage your listings and orders</p>
            </div>
            <Link 
              to="/host/listings/new"
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Create Listing</span>
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
            <StatCard
              title="Total Revenue"
              value={formatPrice(hostStats.totalRevenue)}
              icon={PoundSterling}
              color="bg-green-100 text-green-600"
              subtitle="All time"
            />
            <StatCard
              title="Orders Completed"
              value={hostStats.ordersCompleted}
              icon={CheckCircle}
              color="bg-blue-100 text-blue-600"
              subtitle="Successfully delivered"
            />
            <StatCard
              title="Active Auctions"
              value={hostStats.activeAuctions}
              icon={TrendingUp}
              color="bg-purple-100 text-purple-600"
              subtitle="Currently live"
            />
            <StatCard
              title="Pending Payouts"
              value={formatPrice(hostStats.pendingPayouts)}
              icon={Clock}
              color="bg-yellow-100 text-yellow-600"
              subtitle="Awaiting release"
            />
            <StatCard
              title="Deals of the Day"
              value={hostStats.dealsOfTheDay}
              icon={Star}
              color="bg-red-100 text-red-600"
              subtitle="Featured items"
            />
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Recent Orders */}
            <div className="bg-white rounded-lg border">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="font-semibold">Recent Orders</h2>
                <Link to="/host/orders" className="text-blue-600 text-sm hover:underline">
                  View all
                </Link>
              </div>
              <div className="divide-y">
                {recentOrders.map(order => (
                  <div key={order.id} className="p-4 flex items-center gap-4">
                    <img 
                      src={order.listingImage} 
                      alt={order.listingTitle}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{order.listingTitle}</p>
                      <p className="text-sm text-gray-500">{order.buyerName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatPrice(order.total)}</p>
                      <span className={`inline-block text-xs px-2 py-0.5 rounded ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                        order.status === 'dispatched' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'paid' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Listings */}
            <div className="bg-white rounded-lg border">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="font-semibold">Active Listings</h2>
                <Link to="/host/listings" className="text-blue-600 text-sm hover:underline">
                  View all
                </Link>
              </div>
              <div className="divide-y">
                {activeListings.map(listing => (
                  <div key={listing.id} className="p-4 flex items-center gap-4">
                    <img 
                      src={listing.images[0]} 
                      alt={listing.title}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{listing.title}</p>
                      <p className="text-sm text-gray-500">{listing.bidCount} bids · {listing.watchers} watching</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatPrice(listing.currentPrice)}</p>
                      <span className={`inline-block text-xs px-2 py-0.5 rounded ${
                        listing.visibility === 'public' ? 'bg-green-100 text-green-700' :
                        listing.visibility === 'private' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {listing.visibility}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
