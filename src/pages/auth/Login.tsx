import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, Lock, Chrome } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('demo@unfoldtribe.com');
  const [password, setPassword] = useState('demo123');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      toast({
        title: "Welcome back!",
        description: "You've been successfully logged in.",
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid email or password. Try demo@unfoldtribe.com / demo123",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
        <p className="text-white/70">Sign in to your Unfold Tribe account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-white">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
              placeholder="Enter your email"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-white">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
              placeholder="Enter your password"
              required
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Link 
            to="/auth/forgot-password" 
            className="text-sm text-white/70 hover:text-white transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        <Button 
          type="submit" 
          className="w-full btn-glow" 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-white/20" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-transparent px-2 text-white/60">Or continue with</span>
        </div>
      </div>

      <Button variant="outline" className="w-full btn-glass">
        <Chrome className="mr-2 h-4 w-4" />
        Continue with Google
      </Button>

      <div className="text-center">
        <span className="text-white/70">Don't have an account? </span>
        <Link 
          to="/auth/signup" 
          className="text-white font-semibold hover:underline"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
};

export default Login;