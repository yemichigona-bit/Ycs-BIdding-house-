export interface User {
  id: string;
  email: string;
  name: string;
  role: 'host' | 'buyer';
  avatar?: string;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  category: string;
  condition: 'new' | 'like-new' | 'good' | 'fair';
  images: string[];
  startingPrice: number;
  currentPrice: number;
  buyNowPrice?: number;
  bidCount: number;
  bids: Bid[];
  endDate: Date;
  visibility: 'public' | 'private' | 'unlisted';
  isDealOfTheDay: boolean;
  sellerId: string;
  sellerName: string;
  sellerRating: number;
  sellerSales: number;
  shipping: number;
  watchers: number;
  createdAt: Date;
}

export interface Order {
  id: string;
  listingId: string;
  listingTitle: string;
  listingImage: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  finalPrice: number;
  shipping: number;
  total: number;
  status: 'pending' | 'paid' | 'dispatched' | 'delivered';
  createdAt: Date;
}

export interface Bid {
  id: string;
  listingId: string;
  userId: string;
  userName: string;
  amount: number;
  timestamp: Date;
}

export interface WatchlistItem {
  listingId: string;
  addedAt: Date;
}

export interface HostStats {
  totalRevenue: number;
  ordersCompleted: number;
  activeAuctions: number;
  pendingPayouts: number;
  dealsOfTheDay: number;
}

export interface BuyerStats {
  watchingCount: number;
  activeBids: number;
  winningBids: number;
  ordersCount: number;
}
