import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { listings, bids as allBids } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { useCountdown } from '@/hooks/useCountdown';
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  Flag,
  Star,
  Gavel,
  Clock,
  Truck,
  Shield,
  RotateCcw,
  MapPin,
  ChevronRight,
  User
} from 'lucide-react';

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bidAmount, setBidAmount] = useState('');
  const [showBidModal, setShowBidModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  const listing = listings.find(l => l.id === id);
  const { formatted, isExpired } = useCountdown(listing?.endDate || new Date());

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-2">Listing not found</h1>
          <Link to="/marketplace" className="text-blue-600 hover:underline">
            Back to marketplace
          </Link>
        </div>
      </div>
    );
  }

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

  const listingBids = allBids.filter(b => b.listingId === listing.id).sort((a, b) => b.amount - a.amount);
  const minBid = listing.currentPrice + 1;

  const handleBid = () => {
    const amount = parseFloat(bidAmount);
    if (amount >= minBid) {
      // In a real app, this would submit the bid
      alert(`Bid placed: ${formatPrice(amount)}`);
      setShowBidModal(false);
      setBidAmount('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <Link to="/marketplace" className="text-xl font-semibold">YC's Finest</Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Link to="/marketplace" className="hover:text-blue-600">Marketplace</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to={`/marketplace?category=${listing.category}`} className="hover:text-blue-600">
            {listing.category}
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="truncate max-w-xs">{listing.title}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Images */}
          <div>
            <div className="aspect-square bg-white border rounded-lg overflow-hidden mb-4">
              <img
                src={listing.images[selectedImage]}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
            </div>
            {listing.images.length > 1 && (
              <div className="flex gap-2">
                {listing.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 h-20 border rounded-lg overflow-hidden ${
                      selectedImage === i ? 'ring-2 ring-blue-500' : ''
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className={`inline-block text-xs font-medium px-2 py-1 rounded ${conditionColors[listing.condition]}`}>
                  {listing.condition.replace('-', ' ')}
                </span>
                <h1 className="text-2xl font-semibold mt-2">{listing.title}</h1>
              </div>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Share2 className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Flag className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Seller info */}
            <div className="flex items-center gap-3 mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{listing.sellerName}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="flex items-center gap-0.5">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span>{listing.sellerRating}</span>
                  </div>
                  <span>·</span>
                  <span>{listing.sellerSales} sales</span>
                </div>
              </div>
            </div>

            {/* Price section */}
            <div className="mt-6 p-4 bg-white border rounded-lg">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">{formatPrice(listing.currentPrice)}</span>
                {listing.buyNowPrice && (
                  <>
                    <span className="text-gray-400 line-through">{formatPrice(listing.buyNowPrice)}</span>
                    <span className="text-green-600 text-sm">
                      Save {formatPrice(listing.buyNowPrice - listing.currentPrice)}
                    </span>
                  </>
                )}
              </div>
              
              <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {isExpired ? 'Auction ended' : `${formatted} left`}
                </div>
                <div className="flex items-center gap-1">
                  <Gavel className="w-4 h-4" />
                  {listing.bidCount} bids
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  {listing.watchers} watching
                </div>
              </div>

              {!isExpired && user?.role === 'buyer' && (
                <div className="mt-4 space-y-3">
                  <button
                    onClick={() => setShowBidModal(true)}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Place Bid
                  </button>
                  {listing.buyNowPrice && (
                    <button className="w-full border-2 border-blue-600 text-blue-600 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                      Buy It Now for {formatPrice(listing.buyNowPrice)}
                    </button>
                  )}
                </div>
              )}

              {!user && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg text-center">
                  <Link to="/login" className="text-blue-600 hover:underline font-medium">
                    Sign in to place a bid
                  </Link>
                </div>
              )}
            </div>

            {/* Shipping & returns */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-3 text-sm">
                <Truck className="w-5 h-5 text-gray-400" />
                <span>{listing.shipping === 0 ? 'Free shipping' : `${formatPrice(listing.shipping)} shipping`}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-5 h-5 text-gray-400" />
                <span>Ships from London, UK</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Shield className="w-5 h-5 text-gray-400" />
                <span>Buyer Protection Guarantee</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <RotateCcw className="w-5 h-5 text-gray-400" />
                <span>30-day returns</span>
              </div>
            </div>

            {/* Description */}
            <div className="mt-6">
              <h2 className="font-semibold mb-2">Description</h2>
              <p className="text-gray-600 whitespace-pre-line">{listing.description}</p>
            </div>

            {/* Bid history */}
            {listingBids.length > 0 && (
              <div className="mt-6">
                <h2 className="font-semibold mb-3">Bid History</h2>
                <div className="border rounded-lg overflow-hidden">
                  {listingBids.slice(0, 5).map((bid, i) => (
                    <div key={bid.id} className="flex items-center justify-between p-3 border-b last:border-b-0">
                      <div className="flex items-center gap-3">
                        <span className="text-gray-400 text-sm">#{listingBids.length - i}</span>
                        <span className="font-medium">{bid.userName}</span>
                      </div>
                      <span className="font-semibold">{formatPrice(bid.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Bid Modal */}
      {showBidModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-semibold mb-4">Place Your Bid</h2>
            <p className="text-gray-600 mb-4">
              Current bid: <span className="font-semibold">{formatPrice(listing.currentPrice)}</span>
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Enter {formatPrice(minBid)} or more
            </p>
            <div className="relative mb-4">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">£</span>
              <input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                placeholder={`${minBid}`}
                className="w-full pl-8 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min={minBid}
                step="0.01"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowBidModal(false)}
                className="flex-1 py-3 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleBid}
                disabled={!bidAmount || parseFloat(bidAmount) < minBid}
                className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Bid
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
