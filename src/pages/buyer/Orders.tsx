import { useState } from 'react';
import { Link } from 'react-router-dom';
import { orders } from '@/data/mockData';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Gavel, 
  Heart, 
  Search,
  Filter,
  LogOut,
  SwitchCamera,
  ShoppingBag as LogoIcon
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export function BuyerOrders() {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'paid' | 'dispatched' | 'delivered'>('all');

  const myOrders = orders.filter(o => o.buyerId === 'buyer-1');
  
  const filteredOrders = myOrders.filter(order => {
    const matchesSearch = order.listingTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(price);
  };

  const statusColors = {
    pending: 'bg-gray-100 text-gray-700',
    paid: 'bg-yellow-100 text-yellow-700',
    dispatched: 'bg-blue-100 text-blue-700',
    delivered: 'bg-green-100 text-green-700',
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
          <Link to="/buyer/dashboard" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
          <Link to="/buyer/orders" className="flex items-center gap-3 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg">
            <ShoppingBag className="w-5 h-5" />
            <span className="font-medium">My Orders</span>
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
            <span className="font-semibold">YC's Finest</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/buyer/dashboard" className="p-2 hover:bg-gray-100 rounded-lg">
              <LayoutDashboard className="w-5 h-5" />
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
          <div className="mb-6">
            <h1 className="text-2xl font-bold">My Orders</h1>
            <p className="text-gray-500">Track your purchases</p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search orders..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All statuses</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="dispatched">Dispatched</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
          </div>

          {/* Orders */}
          <div className="space-y-4">
            {filteredOrders.length > 0 ? filteredOrders.map(order => (
              <div key={order.id} className="bg-white rounded-lg border p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b">
                  <div>
                    <p className="text-sm text-gray-500">Order #{order.id}</p>
                    <p className="text-sm text-gray-500">
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`inline-block text-sm px-3 py-1 rounded capitalize w-fit ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </div>
                
                <div className="flex items-center gap-4">
                  <img 
                    src={order.listingImage} 
                    alt={order.listingTitle}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{order.listingTitle}</p>
                    <p className="text-sm text-gray-500">Sold by {order.sellerId === 'host-1' ? 'TechDeals UK' : 'Seller'}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="font-medium">{formatPrice(order.total)}</span>
                      <span className="text-sm text-gray-500">{formatPrice(order.shipping)} shipping</span>
                    </div>
                  </div>
                </div>

                {order.status === 'delivered' && (
                  <div className="mt-4 pt-4 border-t flex gap-3">
                    <button className="text-sm text-blue-600 hover:underline">
                      Leave feedback
                    </button>
                    <button className="text-sm text-blue-600 hover:underline">
                      Buy again
                    </button>
                  </div>
                )}
              </div>
            )) : (
              <div className="bg-white rounded-lg border p-8 text-center">
                <p className="text-gray-500">No orders found</p>
                <Link to="/marketplace" className="text-blue-600 hover:underline mt-2 inline-block">
                  Start shopping
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
