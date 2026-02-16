import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ShoppingBag, Eye, EyeOff } from 'lucide-react';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const success = await login(email, password);
    
    if (success) {
      // Navigation handled by ProtectedRoute
      window.location.reload();
    } else {
      setError('Invalid email or password');
    }
    
    setIsLoading(false);
  };

  const fillDemo = (type: 'host' | 'buyer') => {
    if (type === 'host') {
      setEmail('admin@chigona.com');
      setPassword('admin123');
    } else {
      setEmail('buyer@chigona.com');
      setPassword('buyer123');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center gap-2">
          <ShoppingBag className="w-6 h-6 text-blue-600" />
          <span className="text-xl font-semibold">YC's Finest</span>
        </div>
      </div>

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <h1 className="text-2xl font-semibold mb-2">Sign in</h1>
            <p className="text-gray-600 mb-6">Access your YC's Finest account</p>

            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            {/* Demo Accounts */}
            <div className="mt-6 pt-6 border-t">
              <p className="text-sm text-gray-500 mb-3">Quick login with demo accounts:</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => fillDemo('host')}
                  className="p-3 border rounded-lg hover:bg-gray-50 text-left transition-colors"
                >
                  <p className="font-medium text-sm">Host Account</p>
                  <p className="text-xs text-gray-500">admin@chigona.com</p>
                </button>
                <button
                  type="button"
                  onClick={() => fillDemo('buyer')}
                  className="p-3 border rounded-lg hover:bg-gray-50 text-left transition-colors"
                >
                  <p className="font-medium text-sm">Buyer Account</p>
                  <p className="text-xs text-gray-500">buyer@chigona.com</p>
                </button>
              </div>
            </div>
          </div>

          <p className="text-center text-sm text-gray-500 mt-4">
            Demo passwords: admin123 / buyer123
          </p>
        </div>
      </div>
    </div>
  );
}
