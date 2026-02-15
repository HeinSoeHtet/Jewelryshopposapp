import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Diamond, Sparkles, Lock, Mail } from 'lucide-react';
import { toast } from 'sonner';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/news');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    
    try {
      const success = await login(email, password);
      if (success) {
        toast.success('Welcome to Luxe Jewelry!');
        navigate('/news');
      } else {
        toast.error('Invalid credentials');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo and Branding */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl blur-lg opacity-75"></div>
              <div className="relative bg-gradient-to-br from-amber-400 to-amber-600 p-6 rounded-2xl">
                <Diamond className="size-12 text-slate-900" />
              </div>
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent mb-2">
            Luxe Jewelry
          </h1>
          <p className="text-amber-200/60 flex items-center justify-center gap-2">
            <Sparkles className="size-4" />
            Premium Point of Sale System
          </p>
        </div>

        {/* Login Card */}
        <Card className="bg-slate-800/50 backdrop-blur-xl border-amber-500/30">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-amber-50 flex items-center gap-2">
              <Lock className="size-5 text-amber-400" />
              Sign In
            </CardTitle>
            <CardDescription className="text-amber-200/60">
              Enter your credentials to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-amber-200/80">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-amber-400/50" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@luxejewelry.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-slate-900/50 border-amber-500/30 text-amber-50 placeholder:text-amber-200/30 focus:border-amber-500/50"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-amber-200/80">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-amber-400/50" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-slate-900/50 border-amber-500/30 text-amber-50 placeholder:text-amber-200/30 focus:border-amber-500/50"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-semibold shadow-lg shadow-amber-500/30 h-11"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="size-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            {/* Demo credentials hint */}
            <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <p className="text-xs text-amber-200/70 text-center">
                <span className="font-semibold text-amber-300">Demo:</span> Use any email and password to sign in
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-amber-200/40 text-sm mt-6">
          © 2026 Luxe Jewelry. All rights reserved.
        </p>
      </div>
    </div>
  );
}