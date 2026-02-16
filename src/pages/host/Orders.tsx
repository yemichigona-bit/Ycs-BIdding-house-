import { useState } from 'react';
import { Link } from 'react-router-dom';
import { orders } from '@/data/mockData';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Search,
  Filter,
  ChevronDown,
  LogOut,
  SwitchCamera,
  ShoppingBag as LogoIcon
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const statusOptions = ['pending', 'paid', 'dispatched', 'delivered'] as const;

export function HostOrders() {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | typeof statusOptions[number]>('all');
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.listingTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.buyerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(price);
  };

  const handleStatusChange = (orderId: string, newStatus: typeof statusOptions[number]) => {
    setUpdatingOrder(orderId);
    // In a real app, this would update the order status
    setTimeout(() => {
      alert(`Order status updated to ${newStatus}`);
      setUpdatingOrder(null);
    }, 500);
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
          <Link to="/host/dashboard" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
          <Link to="/host/listings" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
            <Package className="w-5 h-5" />
            <span>Listings</span>
          </Link>
          <Link to="/host/orders" className="flex items-center gap-3 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg">
            <ShoppingBag className="w-5 h-5" />
            <span className="font-medium">Orders</span>
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
            <Link to="/host/listings" className="p-2 hover:bg-gray-100 rounded-lg">
              <Package className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="lg:ml-64 p-4 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Orders</h1>
            <p className="text-gray-500">Manage your sales and shipments</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Pending', count: orders.filter(o => o.status === 'pending').length, color: 'bg-gray-100' },
              { label: 'Paid', count: orders.filter(o => o.status === 'paid').length, color: 'bg-yellow-100' },
              { label: 'Dispatched', count: orders.filter(o => o.status === 'dispatched').length, color: 'bg-blue-100' },
              { label: 'Delivered', count: orders.filter(o => o.status === 'delivered').length, color: 'bg-green-100' },
            ].map(stat => (
              <div key={stat.label} className={`${stat.color} p-4 rounded-lg`}>
                <p className="text-2xl font-bold">{stat.count}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            ))}
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

          {/* Orders table */}
          <div className="bg-white rounded-lg border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-medium text-sm">Item</th>
                    <th className="text-left p-4 font-medium text-sm">Buyer</th>
                    <th className="text-left p-4 font-medium text-sm">Total</th>
                    <th className="text-left p-4 font-medium text-sm">Status</th>
                    <th className="text-left p-4 font-medium text-sm">Date</th>
                    <th className="text-left p-4 font-medium text-sm">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(order => (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={order.listingImage} 
                            alt={order.listingTitle}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div>
                            <p className="font-medium text-sm">{order.listingTitle}</p>
                            <p className="text-xs text-gray-500">Order #{order.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-sm">{order.buyerName}</p>
                      </td>
                      <td className="p-4">
                        <p className="font-medium">{formatPrice(order.total)}</p>
                        <p className="text-xs text-gray-500">{formatPrice(order.shipping)} shipping</p>
                      </td>
                      <td className="p-4">
                        <span className={`inline-block text-xs px-2 py-1 rounded capitalize ${statusColors[order.status]}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <p className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="p-4">
                        {order.status !== 'delivered' && (
                          <div className="relative">
                            <select
                              value={order.status}
                              onChange={(e) => handleStatusChange(order.id, e.target.value as typeof statusOptions[number])}
                              disabled={updatingOrder === order.id}
                              className="text-sm border rounded-lg px-3 py-1.5 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                            >
                              {statusOptions.map(status => (
                                <option key={status} value={status}>
                                  Mark as {status}
                                </option>
                              ))}
                            </select>
                            {updatingOrder === order.id && (
                              <span className="absolute right-8 top-1/2 -translate-y-1/2">
                                <span className="animate-spin inline-block w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full" />
                              </span>
                            )}
                          </div>
                        )}
                        {order.status === 'delivered' && (
                          <span className="text-sm text-green-600">Completed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredOrders.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                <p>No orders found</p>
                <button 
                  onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}
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
